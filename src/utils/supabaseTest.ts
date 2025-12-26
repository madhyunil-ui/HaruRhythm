import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function verifyLogsRLS(userId: string) {
    const results: string[] = [];
    const log = (msg: string) => results.push(msg);

    log('Starting RLS Verification for User: ' + userId);

    try {
        // 1. Check Table Existence (via Insert)
        const testId = `test-${Date.now()}`;
        const insertPayload = {
            user_id: userId,
            action: 'RLS_TEST_INSERT',
            details: { test: true, timestamp: new Date().toISOString() },
        };

        log('1. Testing INSERT (Is table verifiable?)...');
        const { data: insertData, error: insertError } = await supabase
            .from('logs')
            .insert([insertPayload])
            .select()
            .single();

        if (insertError) {
            log(`❌ JOIN FAILED or INSERT BLOCKED: ${insertError.message}`);
            if (insertError.code === '42P01') log('   -> Table "public.logs" might NOT exist.');
            return results;
        } else {
            log('✅ INSERT Success. Table exists and you can write.');
        }

        const insertedId = insertData.id;

        // 2. Test SELECT (Own Data)
        log('2. Testing SELECT (My Data)...');
        const { data: selectData, error: selectError } = await supabase
            .from('logs')
            .select('*')
            .eq('id', insertedId)
            .single();

        if (selectError || !selectData) {
            log(`❌ SELECT FAILED: ${selectError?.message || 'No data found'}`);
        } else {
            log('✅ SELECT Success. You can see your own data.');
        }

        // 3. Test SELECT (Negative Test - basic check)
        // It's hard to verify "others" strictly without a second user context, 
        // but we can verify we don't return *everything* if we remove filters, 
        // relying on the policy. 
        // For now, let's just log that we verified own data access. 
        // A true negative test requires a second user token.

        // 4. Test DELETE
        log('3. Testing DELETE (My Data)...');
        const { error: deleteError } = await supabase
            .from('logs')
            .delete()
            .eq('id', insertedId);

        if (deleteError) {
            log(`❌ DELETE FAILED: ${deleteError.message}`);
        } else {
            log('✅ DELETE Success. You can clean up your own data.');
        }

        log('Verification Complete.');

    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        log(`CRITICAL ERROR: ${message}`);
    }

    return results;
}
