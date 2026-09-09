"""
KrishiQ Machine Learning Architecture Stubs
Problem Statement: SIH26032
Phase 7 Preparation: scikit-learn & XGBoost Integration

NOTE: These classes define the architectural interface and input/output contracts
for the ML pipeline. Live models will be trained on APMC historical intake datasets
in subsequent phases.
"""

from typing import Dict, Any, List, Optional

class WaitTimePredictor:
    """
    XGBoost Regression Model interface for dynamic queue wait-time estimation.
    Feature Vector:
      - active_counters (int)
      - current_queue_count (int)
      - arrival_time_of_day (minutes from 08:00)
      - crop_type_encoded (int)
      - historical_avg_assay_time_minutes (float)
    """
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.is_loaded = False

    def predict_wait_minutes(self, active_counters: int, queue_count: int, crop: str) -> int:
        """Baseline heuristic estimation until trained XGBoost weights are integrated"""
        if active_counters <= 0:
            return 60
        # Baseline: ~5 vehicles per counter per 30 mins -> ~6 mins per vehicle
        estimated = (queue_count * 6) // active_counters
        return max(5, estimated)

class CongestionPredictor:
    """
    scikit-learn Classifier interface for station-level bottleneck forecasting.
    Predicts likelihood of Weighbridge / QC congestion 60-120 minutes in advance.
    """
    def __init__(self, model_path: Optional[str] = None):
        self.model_path = model_path
        self.is_loaded = False

    def predict_congestion_risk(self, centre_id: str, hourly_inflow: int, active_counters: int) -> Dict[str, Any]:
        """Calculates utilization risk metric"""
        ratio = (hourly_inflow / (active_counters * 10)) if active_counters > 0 else 1.0
        severity = "critical" if ratio > 1.2 else ("warning" if ratio > 0.8 else "normal")
        return {
            "centre_id": centre_id,
            "utilization_ratio": round(ratio, 2),
            "severity": severity,
            "recommended_action": "Divert excess vehicles to auxiliary weighbridge" if severity == "critical" else "Normal operation"
        }

class CentreRecommender:
    """
    Cost-Function Optimizer / Recommender:
    Balancing road travel distance vs. predicted Mandi wait times to minimize total farmer turnaround time.
    """
    @staticmethod
    def calculate_time_saved(closer_centre_wait: int, farther_centre_wait: int, extra_travel_mins: int) -> int:
        """Net minutes saved by traveling to an uncongested sub-mandi"""
        return max(0, (closer_centre_wait - farther_centre_wait) - extra_travel_mins)

wait_time_predictor = WaitTimePredictor()
congestion_predictor = CongestionPredictor()
centre_recommender = CentreRecommender()
