import React from 'react';
import { ResponsiveContainer, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { RoiResult } from '../types';
import { AUTOMATION_MONTHLY_COST } from '../hooks/useRoiCalculator';

interface RoiChartsProps {
  results: RoiResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/50 p-3 border border-slate-700 rounded-lg shadow-lg backdrop-blur-sm">
        <p className="label text-slate-300 font-bold mb-1">{`${label}`}</p>
        {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.color }} className="font-medium">{`${pld.name}: $${pld.value.toLocaleString(undefined, {maximumFractionDigits: 0})}`}</p>
        ))}
      </div>
    );
  }
  return null;
};


const RoiCharts: React.FC<RoiChartsProps> = ({ results }) => {
    const savingsData = [
        { name: 'Comparison', 'Monthly Savings': results.monthlySavings, 'Software Cost': AUTOMATION_MONTHLY_COST },
    ];

    const netMonthlySavings = results.monthlySavings - AUTOMATION_MONTHLY_COST;

    const paybackData = Array.from({ length: 12 }, (_, i) => {
        const month = i + 1;
        const cumulativeNetSavings = netMonthlySavings > 0 ? netMonthlySavings * month : 0;
        return {
            name: `M${month}`,
            'Cumulative Net Savings': cumulativeNetSavings,
        };
    });

    return (
        <div className="space-y-10">
            <div>
                 <h3 className="text-lg font-semibold mb-2 text-slate-300 text-center">Monthly Savings vs. Cost</h3>
                 <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={savingsData} layout="vertical" margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis type="number" stroke="#94a3b8" tickFormatter={(tick) => `$${tick.toLocaleString()}`} />
                        <YAxis type="category" dataKey="name" hide={true} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(71, 85, 105, 0.5)' }} />
                        <Legend wrapperStyle={{ color: '#cbd5e1', paddingTop: '20px' }} iconSize={12} />
                        <Bar dataKey="Monthly Savings" fill="#22d3ee" radius={[0, 4, 4, 0]} barSize={35} />
                        <Bar dataKey="Software Cost" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={35} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
             <div>
                <h3 className="text-lg font-semibold mb-2 text-slate-300 text-center">12-Month Cumulative Net Savings</h3>
                <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={paybackData} margin={{ top: 10, right: 20, left: 10, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#0891b2" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
                        <XAxis dataKey="name" stroke="#94a3b8" />
                        <YAxis stroke="#94a3b8" tickFormatter={(tick) => `$${(tick/1000).toLocaleString()}k`} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#818cf8', strokeWidth: 1 }} />
                        <Area type="monotone" dataKey="Cumulative Net Savings" stroke="#22d3ee" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
};

export default RoiCharts;