'use client';

import { useState } from 'react';
import { verifyLogsRLS, supabase } from '../utils/supabaseTest';

export default function RLSTester() {
    const [logs, setLogs] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const runTest = async () => {
        setLoading(true);
        setLogs(['Initializing...']);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                setLogs(prev => [...prev, '❌ No Active Session. Please perform Google Login first.']);
                setLoading(false);
                return;
            }

            const results = await verifyLogsRLS(session.user.id);
            setLogs(results);
        } catch (e: unknown) {
            const message = e instanceof Error ? e.message : String(e);
            setLogs(prev => [...prev, `Error: ${message}`]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50 p-4 bg-black/80 text-white rounded-lg border border-gray-700 max-w-md shadow-xl backdrop-blur-md">
            <h3 className="font-bold mb-2 text-green-400">🛡️ Supabase RLS Verifier</h3>
            <button
                onClick={runTest}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded disabled:opacity-50 text-sm font-bold w-full mb-3"
            >
                {loading ? 'Verifying...' : 'Start Verification'}
            </button>
            <div className="bg-gray-900 p-2 rounded text-xs font-mono h-40 overflow-y-auto border border-gray-800">
                {logs.length === 0 ? (
                    <span className="text-gray-500">Waiting to start...</span>
                ) : (
                    logs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-gray-800 pb-1 last:border-0">{log}</div>
                    ))
                )}
            </div>
        </div>
    );
}
