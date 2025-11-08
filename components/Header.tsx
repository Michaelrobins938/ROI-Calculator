import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="py-8 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
        Interactive Automation ROI Calculator
      </h1>
      <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
        Instantly discover your potential savings and unlock data-driven insights for your business in under a minute.
      </p>
    </header>
  );
};

export default Header;