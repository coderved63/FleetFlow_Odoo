'use client';
import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '@/store/authStore';
import { TrendingUp, Download, PieChart, Activity, DollarSign } from 'lucide-react';

export default function AnalyticsPage() {
    const { token } = useAuthStore();
    const [summary, setSummary] = useState({
        totalFuelCost: 0,
        roi: 0,
        utilization: 0,
        totalRevenue: 0,
        totalMaintenance: 0
    });
    const [financialSummary, setFinancialSummary] = useState([]);
    const [charts, setCharts] = useState({
        efficiencyTrend: [],
        vehicleCosts: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const headers = { 'Authorization': `Bearer ${token}` };

                const [summaryRes, financialRes, chartsRes] = await Promise.all([
                    fetch('http://localhost:5000/api/analytics/summary', { headers }),
                    fetch('http://localhost:5000/api/analytics/financial-summary', { headers }),
                    fetch('http://localhost:5000/api/analytics/charts', { headers })
                ]);

                if (summaryRes.ok) setSummary(await summaryRes.json());
                if (financialRes.ok) setFinancialSummary(await financialRes.json());
                if (chartsRes.ok) setCharts(await chartsRes.json());
            } catch (error) {
                console.error('Failed to fetch analytics', error);
            } finally {
                setLoading(false);
            }
        };

        if (token) fetchAnalytics();
    }, [token]);

    // Dynamic Chart Scaling Logic
    const efficiencyScaling = useMemo(() => {
        if (!charts.efficiencyTrend || charts.efficiencyTrend.length === 0) return { min: 0, max: 1 };
        const values = charts.efficiencyTrend.map(d => parseFloat(d.efficiency));
        const min = Math.min(...values);
        const max = Math.max(...values);
        // Add padding (20%) to top and bottom
        const range = max - min;
        const padding = range === 0 ? 5 : range * 0.2;
        return {
            min: Math.max(0, min - padding),
            max: max + padding
        };
    }, [charts.efficiencyTrend]);

    const vehicleCostScaling = useMemo(() => {
        if (!charts.vehicleCosts || charts.vehicleCosts.length === 0) return { max: 1 };
        const values = charts.vehicleCosts.map(d => d.cost);
        return { max: Math.max(...values, 1) };
    }, [charts.vehicleCosts]);

    const exportToCSV = () => {
        const headers = ['Month', 'Revenue', 'Fuel Cost', 'Maintenance', 'Net Profit'];
        const rows = financialSummary.map(row => [
            row.month,
            `Rs. ${row.revenue.toLocaleString()}`,
            `Rs. ${row.fuelCost.toLocaleString()}`,
            `Rs. ${row.maintenance.toLocaleString()}`,
            `Rs. ${row.netProfit.toLocaleString()}`
        ]);

        let csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `FleetFlow_Financial_Report_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full text-neutral-400">Loading Analytics...</div>;
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-neutral-100 pb-10 px-2 lg:px-6">
            {/* Main Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">8. Operational Analytics & Financial Reports</h1>
                <button
                    onClick={exportToCSV}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                >
                    <Download size={18} />
                    Export CSV
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-neutral-900 border-2 border-blue-500/50 rounded-[2rem] p-6 text-center shadow-lg shadow-blue-500/5 transition-transform hover:scale-[1.02]">
                    <h3 className="text-blue-400 text-sm md:text-md uppercase tracking-widest font-bold mb-4">Total Revenue</h3>
                    <p className="text-white text-2xl md:text-3xl font-black">Rs. {(summary.totalRevenue / 100000).toFixed(1)} L</p>
                </div>
                <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-[2rem] p-6 text-center shadow-lg shadow-emerald-500/5 transition-transform hover:scale-[1.02]">
                    <h3 className="text-emerald-400 text-sm md:text-md uppercase tracking-widest font-bold mb-4">Total Fuel Cost</h3>
                    <p className="text-white text-2xl md:text-3xl font-black">Rs. {(summary.totalFuelCost / 100000).toFixed(1)} L</p>
                </div>
                <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-[2rem] p-6 text-center shadow-lg shadow-emerald-500/5 transition-transform hover:scale-[1.02]">
                    <h3 className="text-emerald-400 text-sm md:text-md uppercase tracking-widest font-bold mb-4">Fleet ROI</h3>
                    <p className="text-white text-2xl md:text-3xl font-black">{summary.roi > 0 ? '+' : ''} {summary.roi.toFixed(1)}%</p>
                </div>
                <div className="bg-neutral-900 border-2 border-emerald-500/50 rounded-[2rem] p-6 text-center shadow-lg shadow-emerald-500/5 transition-transform hover:scale-[1.02]">
                    <h3 className="text-emerald-400 text-sm md:text-md uppercase tracking-widest font-bold mb-4">Utilization Rate</h3>
                    <p className="text-white text-2xl md:text-3xl font-black">{summary.utilization}%</p>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">
                {/* Fuel Efficiency Trend */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 flex flex-col items-center shadow-sm">
                    <h3 className="text-white text-lg font-black mb-1 w-full text-center">Fuel Efficiency Trend</h3>
                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-6">Kilometers per Liter (km/L)</p>

                    <div className="w-full h-56 bg-neutral-950/50 rounded-2xl relative border border-neutral-800 p-6 flex flex-col">
                        <div className="flex-1 relative">
                            <svg className="w-full h-full overflow-visible" viewBox="0 0 400 200" preserveAspectRatio="none">
                                {/* Grid Lines */}
                                <line x1="0" y1="0" x2="400" y2="0" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                <line x1="0" y1="100" x2="400" y2="100" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                <line x1="0" y1="200" x2="400" y2="200" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                {charts.efficiencyTrend.length > 0 && (
                                    <>
                                        {/* Main Path */}
                                        <path
                                            d={`M ${charts.efficiencyTrend.map((d, i) => {
                                                const x = (i * 400) / Math.max(1, charts.efficiencyTrend.length - 1);
                                                const val = parseFloat(d.efficiency);
                                                const y = 200 - ((val - efficiencyScaling.min) / (efficiencyScaling.max - efficiencyScaling.min)) * 200;
                                                return `${x},${y}`;
                                            }).join(' L ')}`}
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="4"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            className="drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                        />
                                        {/* Points and Labels */}
                                        {charts.efficiencyTrend.map((d, i) => {
                                            const x = (i * 400) / Math.max(1, charts.efficiencyTrend.length - 1);
                                            const val = parseFloat(d.efficiency);
                                            const y = 200 - ((val - efficiencyScaling.min) / (efficiencyScaling.max - efficiencyScaling.min)) * 200;
                                            return (
                                                <g key={i}>
                                                    <circle cx={x} cy={y} r="5" fill="#3b82f6" className="drop-shadow-[0_0_4px_rgba(59,130,246,1)]" />
                                                    <text x={x} y={y - 12} textAnchor="middle" fill="white" className="text-[10px] font-black">{val} km/L</text>
                                                </g>
                                            );
                                        })}
                                    </>
                                )}
                            </svg>
                        </div>
                        <div className="flex justify-between mt-4 text-[11px] text-neutral-400 font-bold uppercase tracking-widest px-2">
                            {charts.efficiencyTrend.length > 0 ? charts.efficiencyTrend.map((d, i) => (
                                <span key={i}>{d.month}</span>
                            )) : <span>No Data</span>}
                        </div>
                    </div>
                </div>

                {/* Top 5 Costliest Vehicles */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-8 flex flex-col items-center shadow-sm">
                    <h3 className="text-white text-lg font-black mb-1 w-full text-center">Top 5 Costliest Vehicles</h3>
                    <p className="text-neutral-500 text-[10px] uppercase font-bold tracking-[0.2em] mb-6">Fuel + Maintenance Costs</p>

                    <div className="w-full h-56 bg-neutral-950/50 rounded-2xl relative border border-neutral-800 p-6 flex items-end justify-around gap-4">
                        {charts.vehicleCosts.length > 0 ? charts.vehicleCosts.map((v, i) => {
                            const height = (v.cost / vehicleCostScaling.max) * 100;
                            return (
                                <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end">
                                    <span className="text-[9px] text-emerald-400 font-black mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        ₹{(v.cost / 1000).toFixed(1)}K
                                    </span>
                                    <div
                                        className="w-full bg-gradient-to-t from-emerald-600/20 to-emerald-500/50 border-x-2 border-t-2 border-emerald-400/50 rounded-t-xl relative overflow-hidden transition-all group-hover:from-emerald-600/30 group-hover:to-emerald-500/70"
                                        style={{ height: `${Math.max(10, height)}%` }}
                                    >
                                        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_5px,rgba(255,255,255,0.05)_5px,rgba(255,255,255,0.05)_10px)]"></div>
                                    </div>
                                    <span className="text-[9px] text-neutral-500 mt-3 font-black uppercase tracking-tighter w-full text-center break-all leading-tight">
                                        {v.label}
                                    </span>
                                </div>
                            );
                        }) : <span className="text-neutral-500">No Data</span>}
                    </div>
                </div>
            </div>

            {/* Financial Summary Section */}
            <div className="mt-16 space-y-6">
                <div className="flex justify-center">
                    <div className="bg-neutral-950 border-2 border-blue-500 text-blue-400 px-10 py-3 rounded-full text-lg md:text-xl font-black tracking-[0.1em] uppercase shadow-lg shadow-blue-500/10">
                        Financial Summary of Month
                    </div>
                </div>

                <div className="bg-neutral-900 border border-neutral-800 rounded-[2.5rem] overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-center border-collapse min-w-[600px]">
                            <thead>
                                <tr className="border-b-2 border-neutral-800 bg-neutral-950/50">
                                    <th className="p-6 font-black text-pink-500 border-r border-neutral-800/50 text-sm uppercase tracking-widest">Month</th>
                                    <th className="p-6 font-black text-pink-500 border-r border-neutral-800/50 text-sm uppercase tracking-widest">Revenue</th>
                                    <th className="p-6 font-black text-pink-500 border-r border-neutral-800/50 text-sm uppercase tracking-widest">Fuel Cost</th>
                                    <th className="p-6 font-black text-pink-500 border-r border-neutral-800/50 text-sm uppercase tracking-widest">Maintenance</th>
                                    <th className="p-6 font-black text-pink-500 text-sm uppercase tracking-widest">Net Profit</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {financialSummary.length > 0 ? financialSummary.map((row, i) => (
                                    <tr key={i} className={`hover:bg-neutral-800/30 transition-colors ${i !== 0 ? 'border-t border-neutral-800/30' : ''}`}>
                                        <td className="p-6 border-r border-neutral-800/50 text-white font-black">{row.month}</td>
                                        <td className="p-6 border-r border-neutral-800/50 text-neutral-300 font-bold">Rs. {(row.revenue / 100000).toFixed(1)} L</td>
                                        <td className="p-6 border-r border-neutral-800/50 text-neutral-300 font-bold">Rs. {(row.fuelCost / 100000).toFixed(1)} L</td>
                                        <td className="p-6 border-r border-neutral-800/50 text-neutral-300 font-bold">Rs. {(row.maintenance / 100000).toFixed(1)} L</td>
                                        <td className="p-6 text-emerald-400 font-black">Rs. {(row.netProfit / 100000).toFixed(1)} L</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="5" className="p-10 text-neutral-500 font-bold uppercase">No data recorded for this period</td>
                                    </tr>
                                )}
                                {[...Array(Math.max(0, 5 - financialSummary.length))].map((_, i) => (
                                    <tr key={i} className="border-t border-neutral-800/30 h-14">
                                        <td className="border-r border-neutral-800/50 text-neutral-800">•</td>
                                        <td className="border-r border-neutral-800/50 text-neutral-800">•</td>
                                        <td className="border-r border-neutral-800/50 text-neutral-800">•</td>
                                        <td className="border-r border-neutral-800/50 text-neutral-800">•</td>
                                        <td className="text-neutral-800">•</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
