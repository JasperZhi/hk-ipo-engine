
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SearchLog {
    id: number;
    company_name: string;
    stock_code: string;
    created_at: string;
    user_email?: string; // joined
}

const AdminDashboard: React.FC = () => {
    const { profile, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [logs, setLogs] = useState<SearchLog[]>([]);
    const [topSearches, setTopSearches] = useState<{ name: string, count: number }[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && profile?.role !== 'admin') {
            navigate('/');
        }
    }, [profile, authLoading, navigate]);

    useEffect(() => {
        if (profile?.role === 'admin') {
            fetchData();
        }
    }, [profile]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Log
            const { data, error } = await supabase
                .from('search_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(100);

            if (error) throw error;
            setLogs(data || []);

            // Calculate Top Searches (Client side aggregation for simplicity, or use RPC in real app)
            const counts: Record<string, number> = {};
            data?.forEach(log => {
                const key = `${log.company_name} (${log.stock_code || '?'})`;
                counts[key] = (counts[key] || 0) + 1;
            });

            const sorted = Object.entries(counts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([name, count]) => ({ name, count }));

            setTopSearches(sorted);

        } catch (error) {
            console.error('Error fetching admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) return <div className="p-8">Loading Admin Data...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
                    <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-800">Exit to App</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Card 1: Top Searches */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">🔥 Top 5 Trending Searches</h2>
                        <div className="space-y-3">
                            {topSearches.length > 0 ? topSearches.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-2">
                                    <span className="font-medium text-gray-700">{idx + 1}. {item.name}</span>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{item.count} searches</span>
                                </div>
                            )) : <p className="text-gray-500">No data yet.</p>}
                        </div>
                    </div>

                    {/* Card 2: Stats */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">📊 Quick Stats</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-4 rounded text-center">
                                <p className="text-gray-500 text-sm">Total Searches (Last 100)</p>
                                <p className="text-3xl font-bold text-slate-900">{logs.length}</p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded text-center">
                                <p className="text-gray-500 text-sm">Unique Companies</p>
                                <p className="text-3xl font-bold text-slate-900">{topSearches.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Recent Search Logs</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {logs.map(log => (
                                    <tr key={log.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {new Date(log.created_at).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono text-xs">
                                            {log.user_id}
                                            {/* Note: In production you'd join with profiles to get email */}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {log.company_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {log.stock_code || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
