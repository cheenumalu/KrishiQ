import { createClient, RealtimeChannel } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = (): boolean => {
  return (
    typeof supabaseUrl === "string" &&
    supabaseUrl.trim().length > 0 &&
    !supabaseUrl.includes("your-project-id") &&
    typeof supabaseAnonKey === "string" &&
    supabaseAnonKey.trim().length > 0 &&
    !supabaseAnonKey.includes("your-anon-key")
  );
};

export const supabase = isSupabaseConfigured()
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

// Reusable Realtime helper with automatic cleanup
export function setupRealtimeSubscription<T = any>(
  tableName: string,
  onInsert?: (payload: T) => void,
  onUpdate?: (payload: T) => void,
  onDelete?: (payload: { id: string }) => void
): RealtimeChannel | null {
  if (!supabase) return null;

  const channelName = `realtime_${tableName}_${Math.random().toString(36).substring(2, 7)}`;
  const channel = supabase.channel(channelName);

  if (onInsert) {
    channel.on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: tableName },
      (payload) => onInsert(payload.new as T)
    );
  }

  if (onUpdate) {
    channel.on(
      "postgres_changes",
      { event: "UPDATE", schema: "public", table: tableName },
      (payload) => onUpdate(payload.new as T)
    );
  }

  if (onDelete) {
    channel.on(
      "postgres_changes",
      { event: "DELETE", schema: "public", table: tableName },
      (payload) => onDelete(payload.old as { id: string })
    );
  }

  channel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      console.log(`[Supabase Realtime] Subscribed to ${tableName}`);
    }
  });

  return channel;
}
