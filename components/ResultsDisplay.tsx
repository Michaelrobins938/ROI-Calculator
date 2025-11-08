import React from 'react';
import { RoiResult } from '../types';
import RoiCharts from './RoiCharts';

interface ResultsDisplayProps {
  results: RoiResult;
}

const ResultCard: React.FC<{ title: string; value: string; isPositive?: boolean }> = ({ title, value, isPositive = false }) => (
  <div className="bg-slate-800/50 p-4 rounded-lg text-center border border-slate-700/50 transition-all duration-300 hover:bg-slate-800/80">
    <p className="text-sm font-medium text-slate-400">{title}</p>
    <p className={`text-3xl lg:text-4xl font-bold mt-1 ${isPositive ? 'text-green-400' : 'text-cyan-300'}`}>{value}</p>
  </div>
);

const PaybackPeriodVisual: React.FC<{ months: number }> = ({ months }) => {
    const displayMonths = isFinite(months) ? Math.min(months, 12) : 12;
    const percentage = isFinite(months) ? (displayMonths / 12) * 100 : 0;
    const isInfinite = !isFinite(months);

    return (
        <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50 transition-all duration-300 hover:bg-slate-800/80">
             <p className="text-sm font-medium text-slate-400 text-center mb-2">Payback Period</p>
             <div className="w-full bg-slate-700 rounded-full h-4 relative overflow-hidden">
                <div 
                    className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-4 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${isInfinite ? 0 : percentage}%` }}
                ></div>
             </div>
             <p className="text-center mt-2 font-bold text-cyan-300 text-2xl">
                {isInfinite ? 'N/A' : `${months.toFixed(1)} Months`}
             </p>
        </div>
    )
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className="bg-slate-900/70 p-6 rounded-xl shadow-2xl border border-slate-800 backdrop-blur-sm card-glow transition-all duration-300">
      <div className="content-wrapper">
        <h2 className="text-3xl font-bold mb-6 text-white">Your Potential ROI</h2>
        <div className="space-y-8">
          <RoiCharts results={results} />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ResultCard 
                  title="Annual ROI" 
                  value={`${results.annualROI.toLocaleString('en-US', { maximumFractionDigits: 0 })}%`}
                  isPositive={true}
              />
              <PaybackPeriodVisual months={results.paybackMonths} />
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-lg text-center border border-slate-700/50">
              <p className="text-sm font-medium text-slate-400">Key Improvement Metric</p>
              <p className="text-lg font-semibold text-white mt-1">{results.keyMetric}</p>
          </div>
          <div className="pt-2 text-center text-xs text-slate-500">
              * Calculations are estimates based on industry averages and a monthly automation software cost of $499.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;