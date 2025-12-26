import { Utils } from './utils'; // Assuming you might have a utils file, otherwise remove or replace.
import { Preferences } from '@capacitor/preferences';
import { supabase } from './supabaseClient';

const ROUTINE_KEY = 'my_routine_data';

export const DataManager = {
    /**
     * Save routine data.
     * If logged in, save to Supabase.
     * If guest, save to Capacitor Preferences.
     */
    async saveRoutine(routineData) {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Logged in: Save to Supabase
                // RLS policy: Users can only INSERT/UPDATE their own rows.
                // Assuming 'routines' table exists with 'user_id' and 'data' columns.
                const { error } = await supabase
                    .from('routines')
                    .upsert({
                        user_id: session.user.id,
                        data: routineData,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'user_id' }); // Upsert based on user_id

                if (error) throw error;
                console.log('Routine saved to Supabase');
            } else {
                // Guest: Save to Local Storage (Capacitor Preferences)
                await Preferences.set({
                    key: ROUTINE_KEY,
                    value: JSON.stringify(routineData),
                });
                console.log('Routine saved locally');
            }
        } catch (error) {
            console.error('Error saving routine:', error);
            throw error;
        }
    },

    /**
     * Get routine data.
     * If logged in, fetch from Supabase.
     * If guest, fetch from Capacitor Preferences.
     */
    async getRoutine() {
        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                // Logged in: Fetch from Supabase
                const { data, error } = await supabase
                    .from('routines')
                    .select('data')
                    .email('user_id', session.user.id) // Redundant with RLS but explicit
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 is 'not found'
                    throw error;
                }

                return data ? data.data : null;
            } else {
                // Guest: Fetch from Local Storage
                const { value } = await Preferences.get({ key: ROUTINE_KEY });
                return value ? JSON.parse(value) : null;
            }
        } catch (error) {
            console.error('Error fetching routine:', error);
            return null;
        }
    }
};
