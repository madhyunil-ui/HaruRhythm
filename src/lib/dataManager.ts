import { Preferences } from '@capacitor/preferences';
import { createClient, Session } from '@supabase/supabase-js';

// Initialize Supabase Client (Singleton-ish for this module)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true, // Requested by user
    }
});

const GUEST_DATA_KEY = 'haru_guest_logs';

export type LogData = {
    mood: string;
    date: string;
    description?: string;
};

export const DataManager = {
    /**
     * Save a log entry. Uses Supabase if session exists, otherwise Local Storage (Capacitor Preferences).
     */
    saveLog: async (session: Session | null, data: LogData) => {
        if (session?.user) {
            // Login Mode: Save to Supabase
            const { error } = await supabase.from('logs').insert({
                user_id: session.user.id,
                action: 'DIARY_ENTRY',
                details: data
            });
            if (error) throw error;
            return 'SUPABASE';
        } else {
            // Guest Mode: Save to Capacitor Preferences
            // 1. Get existing logs
            const { value } = await Preferences.get({ key: GUEST_DATA_KEY });
            const currentLogs = value ? JSON.parse(value) : [];

            // 2. Add new log
            const newLog = { ...data, id: Date.now().toString(), saved_at: new Date().toISOString() };
            currentLogs.push(newLog);

            // 3. Save back
            await Preferences.set({
                key: GUEST_DATA_KEY,
                value: JSON.stringify(currentLogs),
            });
            return 'LOCAL';
        }
    },

    /**
     * Syncs guest data to Supabase after login.
     * Returns number of synced items.
     */
    syncGuestData: async (session: Session) => {
        if (!session?.user) return 0;

        // 1. Get guest data
        const { value } = await Preferences.get({ key: GUEST_DATA_KEY });
        if (!value) return 0;

        const guestLogs = JSON.parse(value);
        if (guestLogs.length === 0) return 0;

        // 2. Transform and Upload to Supabase
        const rowsToInsert = guestLogs.map((log: any) => ({
            user_id: session.user.id,
            action: 'DIARY_ENTRY',
            details: {
                mood: log.mood,
                date: log.date,
                description: log.description || "Guest Mode Entry"
            },
            created_at: log.saved_at // Preserve original timestamp if column exists or put in details
        }));

        // In a real app, you might want to handle partial failures or huge batches.
        // For now, we assume a simple small batch.
        const { error } = await supabase.from('logs').insert(rowsToInsert);

        if (error) {
            console.error("Sync failed:", error);
            throw error;
        }

        // 3. Clear local guest data on success
        await Preferences.remove({ key: GUEST_DATA_KEY });

        return guestLogs.length;
    }
};
