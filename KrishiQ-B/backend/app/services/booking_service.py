
import logging
import uuid
import random
from typing import Optional, Dict, Any
from datetime import datetime, date
from fastapi import HTTPException, status

from app.schemas.booking import (
    BookingCreateRequest,
    BookingCreateResponseData,
    BookingResponse,
    QueueTokenResponse
)
from app.schemas.auth import AuthenticatedUser
from app.db.database import get_db_connection

logger = logging.getLogger("krishiq.booking_service")


class BookingService:
    """
    Core Booking Creation & Token Allocation Engine (SIH26032).

    Creates a farmer booking and queue token inside a single
    atomic database transaction.
    """

    @staticmethod
    def _execute_query(cur, query: str, params: tuple = ()) -> None:
        """
        Execute a database query.

        PostgreSQL uses %s placeholders. SQLite compatibility is
        retained for tests.
        """
        if cur.__class__.__module__.startswith("sqlite"):
            query = query.replace("%s", "?").replace(
                "NOW()", "CURRENT_TIMESTAMP"
            )
        cur.execute(query, params)

    @classmethod
    async def create_booking(
        cls,
        req: BookingCreateRequest,
        current_user: AuthenticatedUser,
        db_conn: Optional[Any] = None
    ) -> BookingCreateResponseData:

        # ============================================================
        # 1. AUTHENTICATE FARMER
        # ============================================================

        if not current_user.farmer_profile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=(
                    "Farmer agricultural profile not found. "
                    "Please complete farmer profile registration "
                    "before scheduling slots."
                )
            )

        farmer_id = current_user.farmer_profile.id
        farmer_max_allotment = float(
            current_user.farmer_profile.max_allotment_quintals
        )

        # ============================================================
        # 2. CHECK INDIVIDUAL ALLOTMENT
        # ============================================================

        if req.quantity_quintals > farmer_max_allotment:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=(
                    f"Requested quantity ({req.quantity_quintals} Qtl) "
                    f"exceeds your registered land allotment quota "
                    f"({farmer_max_allotment} Qtl)."
                )
            )

        # ============================================================
        # 3. DATABASE CONNECTION + TRANSACTION
        # ============================================================

        conn = db_conn or get_db_connection()
        should_close = db_conn is None

        try:
            is_sqlite = conn.__class__.__module__.startswith("sqlite")

            tx_context = conn if is_sqlite else conn.transaction()

            with tx_context:

                cur = conn.cursor()

                try:

                    # ====================================================
                    # A. VALIDATE PROCUREMENT CENTRE
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        SELECT id, name, status
                        FROM procurement_centres
                        WHERE id = %s
                        """,
                        (req.centre_id,)
                    )

                    centre = cur.fetchone()

                    if not centre:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=(
                                f"Procurement centre "
                                f"'{req.centre_id}' not found."
                            )
                        )

                    # ====================================================
                    # B. VALIDATE CROP
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        SELECT id, name, is_active
                        FROM crops
                        WHERE id = %s
                        """,
                        (req.crop_id,)
                    )

                    crop = cur.fetchone()

                    if not crop:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=f"Crop '{req.crop_id}' not found."
                        )

                    crop_is_active = (
                        crop["is_active"]
                        if isinstance(crop, dict)
                        else crop[2]
                    )

                    if not crop_is_active:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=(
                                f"Crop '{req.crop_id}' is currently "
                                f"inactive for procurement."
                            )
                        )

                    # ====================================================
                    # C. VALIDATE SLOT
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        SELECT
                            id,
                            centre_id,
                            slot_date,
                            time_window,
                            start_time,
                            end_time,
                            max_capacity,
                            booked_count
                        FROM slots
                        WHERE id = %s
                        """,
                        (req.slot_id,)
                    )

                    slot = cur.fetchone()

                    if not slot:
                        raise HTTPException(
                            status_code=status.HTTP_404_NOT_FOUND,
                            detail=(
                                f"Intake slot '{req.slot_id}' "
                                f"not found."
                            )
                        )

                    slot_centre_id = (
                        slot["centre_id"]
                        if isinstance(slot, dict)
                        else slot[1]
                    )

                    if slot_centre_id != req.centre_id:
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=(
                                f"Slot '{req.slot_id}' belongs to "
                                f"centre '{slot_centre_id}', not "
                                f"'{req.centre_id}'."
                            )
                        )

                    slot_date_raw = (
                        slot["slot_date"]
                        if isinstance(slot, dict)
                        else slot[2]
                    )

                    if isinstance(slot_date_raw, str):
                        slot_date = datetime.strptime(
                            slot_date_raw,
                            "%Y-%m-%d"
                        ).date()
                    else:
                        slot_date = slot_date_raw

                    if slot_date < date.today():
                        raise HTTPException(
                            status_code=status.HTTP_400_BAD_REQUEST,
                            detail=(
                                f"Cannot book slots in the past. "
                                f"Slot date is {slot_date}."
                            )
                        )

                    # ====================================================
                    # D. CUMULATIVE FARMER QUOTA CHECK
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        SELECT
                            COALESCE(SUM(quantity_quintals), 0)
                            AS total_booked
                        FROM bookings
                        WHERE farmer_id = %s
                          AND booking_status IN (
                              'CONFIRMED',
                              'RESCHEDULED',
                              'COMPLETED'
                          )
                        """,
                        (farmer_id,)
                    )

                    quota_row = cur.fetchone()

                    total_booked = float(
                        quota_row["total_booked"]
                        if isinstance(quota_row, dict)
                        else quota_row[0]
                    )

                    if (
                        total_booked + req.quantity_quintals
                        > farmer_max_allotment
                    ):
                        remaining_quota = max(
                            0.0,
                            farmer_max_allotment - total_booked
                        )

                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=(
                                f"Quota exceeded. You have already "
                                f"booked/procured {total_booked:.2f} Qtl. "
                                f"Remaining allotment is "
                                f"{remaining_quota:.2f} Qtl "
                                f"(Max Allotment: "
                                f"{farmer_max_allotment:.2f} Qtl)."
                            )
                        )

                    # ====================================================
                    # E. SAME-DAY ACTIVE BOOKING CHECK
                    #
                    # IMPORTANT:
                    # bookings table does NOT contain slot_date.
                    # The date is stored in slots.slot_date.
                    #
                    # Therefore we JOIN bookings -> slots.
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        SELECT
                            b.id,
                            b.booking_number
                        FROM bookings b
                        INNER JOIN slots s
                            ON s.id = b.slot_id
                        WHERE b.farmer_id = %s
                          AND s.slot_date = %s
                          AND b.booking_status IN (
                              'CONFIRMED',
                              'RESCHEDULED'
                          )
                        LIMIT 1
                        """,
                        (farmer_id, str(slot_date))
                    )

                    existing = cur.fetchone()

                    if existing:
                        booking_number_existing = (
                            existing["booking_number"]
                            if isinstance(existing, dict)
                            else existing[1]
                        )

                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=(
                                f"Farmer already holds an active "
                                f"booking ({booking_number_existing}) "
                                f"on {slot_date}. Only one active "
                                f"booking per day is permitted."
                            )
                        )

                    # ====================================================
                    # F. ATOMIC SLOT CAPACITY RESERVATION
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        UPDATE slots
                        SET booked_count = booked_count + 1
                        WHERE id = %s
                          AND booked_count < max_capacity
                        RETURNING id, booked_count, max_capacity
                        """,
                        (req.slot_id,)
                    )

                    reserved = cur.fetchone()

                    if not reserved:
                        raise HTTPException(
                            status_code=status.HTTP_409_CONFLICT,
                            detail=(
                                f"Slot capacity reached. "
                                f"Slot '{req.slot_id}' is full. "
                                f"Please select an alternative "
                                f"time window."
                            )
                        )

                    # ====================================================
                    # G. CREATE BOOKING
                    #
                    # IMPORTANT:
                    # slot_date is NOT inserted into bookings because
                    # that column does not exist there.
                    # We retain slot_date in memory for the response.
                    # ====================================================

                    year = slot_date.year

                    rand_suffix = random.randint(
                        100000,
                        999999
                    )

                    booking_number = (
                        f"BK-{year}-{rand_suffix}"
                    )

                    booking_id = str(uuid.uuid4())

                    now_iso = datetime.now().isoformat()

                    cls._execute_query(
                        cur,
                        """
                        INSERT INTO bookings (
                            id,
                            booking_number,
                            farmer_id,
                            centre_id,
                            slot_id,
                            crop_id,
                            variety,
                            quantity_quintals,
                            booking_status,
                            stage_number,
                            created_at,
                            updated_at
                        )
                        VALUES (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            'CONFIRMED',
                            2,
                            NOW(),
                            NOW()
                        )
                        RETURNING *
                        """,
                        (
                            booking_id,
                            booking_number,
                            farmer_id,
                            req.centre_id,
                            req.slot_id,
                            req.crop_id,
                            req.variety or "Standard Grade A",
                            req.quantity_quintals
                        )
                    )

                    booking_rec = cur.fetchone()

                    if not booking_rec:
                        raise Exception(
                            "Booking insert returned no record."
                        )

                    # ====================================================
                    # H. GENERATE QUEUE TOKEN
                    #
                    # Database status is WAITING.
                    # PENDING_ARRIVAL is not a valid queue status
                    # in the current schema.
                    # ====================================================

                    cls._execute_query(
                        cur,
                        """
                        SELECT
                            COALESCE(MAX(sequence_number), 0) + 1
                            AS next_seq
                        FROM queue_tokens
                        WHERE centre_id = %s
                          AND queue_date = %s
                        """,
                        (
                            req.centre_id,
                            str(slot_date)
                        )
                    )

                    seq_row = cur.fetchone()

                    next_seq = int(
                        seq_row["next_seq"]
                        if isinstance(seq_row, dict)
                        else seq_row[0]
                    )

                    token_number = f"A{100 + next_seq}"

                    token_id = str(uuid.uuid4())

                    cls._execute_query(
                        cur,
                        """
                        INSERT INTO queue_tokens (
                            id,
                            booking_id,
                            centre_id,
                            token_number,
                            sequence_number,
                            queue_date,
                            status,
                            estimated_wait_minutes,
                            created_at,
                            updated_at
                        )
                        VALUES (
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            %s,
                            'WAITING',
                            30,
                            NOW(),
                            NOW()
                        )
                        RETURNING *
                        """,
                        (
                            token_id,
                            booking_id,
                            req.centre_id,
                            token_number,
                            next_seq,
                            str(slot_date)
                        )
                    )

                    token_rec = cur.fetchone()

                    if not token_rec:
                        raise Exception(
                            "Queue token insert returned no record."
                        )

                finally:
                    cur.close()

            # ============================================================
            # TRANSACTION COMMITTED SUCCESSFULLY
            # ============================================================

            return BookingCreateResponseData(
                booking=BookingResponse(
                    id=booking_id,
                    booking_number=booking_number,
                    farmer_id=farmer_id,
                    centre_id=req.centre_id,
                    slot_id=req.slot_id,
                    slot_date=str(slot_date),
                    crop_id=req.crop_id,
                    variety=req.variety or "Standard Grade A",
                    quantity_quintals=req.quantity_quintals,
                    booking_status="CONFIRMED",
                    stage_number=2,
                    created_at=now_iso,
                    updated_at=now_iso,
                ),
                queue_token=QueueTokenResponse(
                    id=token_id,
                    booking_id=booking_id,
                    centre_id=req.centre_id,
                    token_number=token_number,
                    sequence_number=next_seq,
                    queue_date=str(slot_date),
                    status="WAITING",
                    assigned_counter=None,
                    estimated_wait_minutes=30,
                    created_at=now_iso,
                )
            )

        # ================================================================
        # EXPECTED HTTP ERRORS
        # ================================================================

        except HTTPException:
            raise

        # ================================================================
        # DATABASE / UNEXPECTED ERRORS
        # ================================================================

        except Exception as e:

            err_str = str(e).lower()

            if (
                "unique" in err_str
                or "duplicate" in err_str
                or "uq_farmer" in err_str
                or "23505" in err_str
            ):
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        "Conflict: A booking on this date already "
                        "exists for this farmer, or a token collision "
                        "occurred."
                    )
                )

            logger.error(
                f"Booking transaction failure: {e}",
                exc_info=True
            )

            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=(
                    "Transaction failed while creating booking. "
                    "All changes have been safely rolled back."
                )
            )

        finally:

            if should_close and conn:
                conn.close()


booking_service = BookingService()