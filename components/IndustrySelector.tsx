import React from 'react';
import { Industry } from '../types';

interface IndustrySelectorProps {
  industries: Industry[];
  selectedIndustry: Industry;
  onSelectIndustry: (industry: Industry) => void;
}

const IndustrySelector: React.FC<IndustrySelectorProps> = ({ industries, selectedIndustry, onSelectIndustry }) => {
  return (
    <div className="mb-10 p-2 bg-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
      {industries.map((industry) => (
        <button
          key={industry}
          onClick={() => onSelectIndustry(industry)}
          className={`px-4 py-2 text-sm md:text-base font-medium rounded-md transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-indigo-500 transform hover:scale-105 ${
            selectedIndustry === industry
              ? 'bg-indigo-600 text-white shadow-lg'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {industry}
        </button>
      ))}
    </div>
  );
};

export default IndustrySelector;