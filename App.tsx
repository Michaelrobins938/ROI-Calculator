import React, { useState, useMemo } from 'react';
import { Industry, AllInputs, ConstructionInputs, LogisticsInputs, FieldServicesInputs, DentalInputs, AccountingInputs } from './types';
import { useRoiCalculator } from './hooks/useRoiCalculator';
import Header from './components/Header';
import IndustrySelector from './components/IndustrySelector';
import CalculatorForm from './components/CalculatorForm';
import ResultsDisplay from './components/ResultsDisplay';
import GeminiInsights from './components/GeminiInsights';
import PdfExportButton from './components/PdfExportButton';

const industries = Object.values(Industry);

const defaultInputs: Record<Industry, AllInputs> = {
  [Industry.Construction]: { invoicesPerMonth: 300, minutesPerInvoice: 18, avgHourlyWage: 35 } as ConstructionInputs,
  [Industry.Logistics]: { invoicesPerMonth: 500, minutesPerInvoice: 15, avgInvoiceValue: 1500, avgHourlyWage: 28 } as LogisticsInputs,
  [Industry.FieldServices]: { missedCallsPerWeek: 15, avgJobValue: 450, jobsPerMonth: 150, noShowRate: 10, avgHourlyWage: 40 } as FieldServicesInputs,
  [Industry.Dental]: { patientsPerMonth: 200, minutesPerVerification: 15, noShowRate: 18, avgAppointmentValue: 300, avgHourlyWage: 25 } as DentalInputs,
  [Industry.Accounting]: { clients: 50, hoursPerClientReconciliation: 4, billableRate: 150, avgHourlyWage: 50 } as AccountingInputs,
};

function App() {
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>(Industry.Construction);
  
  const [inputs, setInputs] = useState<AllInputs>(defaultInputs[selectedIndustry]);

  const handleIndustryChange = (industry: Industry) => {
    setSelectedIndustry(industry);
    setInputs(defaultInputs[industry]);
  };
  
  const roiResults = useRoiCalculator(selectedIndustry, inputs);

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans">
      <main id="export-container" className="container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <IndustrySelector
          industries={industries}
          selectedIndustry={selectedIndustry}
          onSelectIndustry={handleIndustryChange}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <CalculatorForm 
            industry={selectedIndustry} 
            inputs={inputs} 
            setInputs={setInputs} 
          />
          <ResultsDisplay results={roiResults} />
        </div>
        <div className="mt-8">
            <GeminiInsights industry={selectedIndustry} inputs={inputs} results={roiResults} />
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 no-export">
            <PdfExportButton 
                elementId="export-container"
                fileName={`ROI_Report_${selectedIndustry.replace(/[\s&]/g, '_')}.pdf`}
            />
        </div>
      </main>
    </div>
  );
}

export default App;