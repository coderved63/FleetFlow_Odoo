'use client';
import { useAuthStore } from '@/store/authStore';
import { BarChart3, TrendingUp, PieChart, Activity } from 'lucide-react';

export default function AnalyticsPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-neutral-100">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Fleet Analytics</h1>
                <p className="text-neutral-400 mt-1">Deep insights into fleet efficiency, costs, and performance.</p>
            </div>

            {/* Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Distribution */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <PieChart className="text-blue-500" size={20} />
                            Cost Distribution
                        </h3>
                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">This Month</span>
                    </div>
                    <div className="flex flex-col gap-4">
                        {[
                            { label: 'Fuel Costs', value: '65%', color: 'bg-emerald-500' },
                            { label: 'Maintenance', value: '20%', color: 'bg-blue-500' },
                            { label: 'Driver Salaries', value: '10%', color: 'bg-amber-500' },
                            { label: 'Miscellaneous', value: '5%', color: 'bg-neutral-600' }
                        ].map((item) => (
                            <div key={item.label} className="space-y-1.5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-400">{item.label}</span>
                                    <span className="font-medium text-white">{item.value}</span>
                                </div>
                                <div className="w-full h-2 bg-neutral-950 rounded-full overflow-hidden">
                                    <div className={`h-full ${item.color}`} style={{ width: item.value }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Efficiency Trends */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={20} />
                            Efficiency Trends
                        </h3>
                        <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider">Q1 2026</span>
                    </div>
                    <div className="h-48 flex items-end justify-between gap-2 px-2 mt-4">
                        {[40, 65, 55, 85, 75, 95, 60, 80].map((h, i) => (
                            <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/20 to-emerald-500/60 rounded-t-lg transition-all hover:to-emerald-400 cursor-pointer group relative" style={{ height: `${h}%` }}>
                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-neutral-800 text-white text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {h}% Eff.
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between mt-4 text-[10px] text-neutral-500 uppercase tracking-widest font-bold px-2">
                        <span>Jan</span>
                        <span>Feb</span>
                        <span>Mar</span>
                        <span>Apr</span>
                        <span>May</span>
                        <span>Jun</span>
                        <span>Jul</span>
                        <span>Aug</span>
                    </div>
                </div>
            </div>

            {/* Bottom Row: Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl">
                        <BarChart3 className="text-blue-500" size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Total Revenue</p>
                        <p className="text-xl font-bold text-white tracking-tight">$234,500</p>
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-xl">
                        <Activity className="text-emerald-500" size={24} />
                    </div>
                    <div>
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider">Fleet Utilization</p>
                        <p className="text-xl font-bold text-white tracking-tight">88.2%</p>
                    </div>
                </div>
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 border-l-amber-500/50">
                    <p className="text-xs text-neutral-400 font-bold uppercase tracking-wider mb-2">System Status</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-emerald-400">All data synced</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
