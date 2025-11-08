import React from 'react';
import { Industry, AllInputs } from '../types';

interface CalculatorFormProps {
  industry: Industry;
  inputs: AllInputs;
  setInputs: React.Dispatch<React.SetStateAction<AllInputs>>;
}

interface SliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: keyof AllInputs;
  unit?: string;
}

const Slider: React.FC<SliderProps> = ({ label, value, min, max, step, onChange, name, unit = '' }) => (
  <div className="space-y-3">
    <label htmlFor={name} className="flex justify-between font-medium text-slate-300 text-base">
      <span>{label}</span>
      <span className="text-indigo-300 font-bold bg-slate-700/50 px-2 py-1 rounded-md text-sm">{value.toLocaleString()}{unit}</span>
    </label>
    <input
      id={name}
      name={name}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={onChange}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500 transition-all duration-300"
    />
  </div>
);


const CalculatorForm: React.FC<CalculatorFormProps> = ({ industry, inputs, setInputs }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs(prev => ({ ...prev, [e.target.name]: Number(e.target.value) }));
  };

  const renderInputs = () => {
    const commonSliders = (
      <>
         <Slider label="Avg. Employee Hourly Wage" value={inputs.avgHourlyWage} min={15} max={150} step={1} onChange={handleInputChange} name="avgHourlyWage" unit="$" />
      </>
    );

    switch (industry) {
      case Industry.Construction:
      case Industry.Logistics:
        return (
          <>
            <Slider label="Monthly Invoices" value={(inputs as any).invoicesPerMonth} min={50} max={5000} step={10} onChange={handleInputChange} name="invoicesPerMonth" />
            <Slider label="Minutes per Invoice" value={(inputs as any).minutesPerInvoice} min={5} max={60} step={1} onChange={handleInputChange} name="minutesPerInvoice" unit=" min" />
            {industry === Industry.Logistics && <Slider label="Avg. Invoice Value" value={(inputs as any).avgInvoiceValue} min={100} max={10000} step={50} onChange={handleInputChange} name="avgInvoiceValue" unit="$" />}
            {commonSliders}
          </>
        );
      case Industry.FieldServices:
         return (
          <>
            <Slider label="Missed Calls per Week" value={(inputs as any).missedCallsPerWeek} min={1} max={100} step={1} onChange={handleInputChange} name="missedCallsPerWeek" />
            <Slider label="Avg. Job Value" value={(inputs as any).avgJobValue} min={100} max={5000} step={25} onChange={handleInputChange} name="avgJobValue" unit="$" />
            <Slider label="Monthly Jobs" value={(inputs as any).jobsPerMonth} min={20} max={1000} step={10} onChange={handleInputChange} name="jobsPerMonth" />
            <Slider label="Current No-Show Rate" value={(inputs as any).noShowRate} min={1} max={30} step={1} onChange={handleInputChange} name="noShowRate" unit="%" />
            {commonSliders}
          </>
        );
      case Industry.Dental:
        return (
          <>
            <Slider label="Monthly Patients" value={(inputs as any).patientsPerMonth} min={50} max={2000} step={10} onChange={handleInputChange} name="patientsPerMonth" />
            <Slider label="Minutes per Insurance Verification" value={(inputs as any).minutesPerVerification} min={5} max={45} step={1} onChange={handleInputChange} name="minutesPerVerification" unit=" min" />
            <Slider label="Avg. Appointment Value" value={(inputs as any).avgAppointmentValue} min={50} max={2000} step={25} onChange={handleInputChange} name="avgAppointmentValue" unit="$" />
            <Slider label="Current No-Show Rate" value={(inputs as any).noShowRate} min={1} max={25} step={1} onChange={handleInputChange} name="noShowRate" unit="%" />
            {commonSliders}
          </>
        );
       case Industry.Accounting:
        return (
          <>
            <Slider label="Number of Clients" value={(inputs as any).clients} min={5} max={500} step={1} onChange={handleInputChange} name="clients" />
            <Slider label="Monthly Reconciliation Hours per Client" value={(inputs as any).hoursPerClientReconciliation} min={1} max={20} step={1} onChange={handleInputChange} name="hoursPerClientReconciliation" unit=" hrs" />
            <Slider label="Avg. Billable Hourly Rate" value={(inputs as any).billableRate} min={50} max={500} step={5} onChange={handleInputChange} name="billableRate" unit="$" />
            {commonSliders}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-slate-900/70 p-6 rounded-xl shadow-2xl border border-slate-800 backdrop-blur-sm card-glow transition-all duration-300">
      <div className="content-wrapper">
        <h2 className="text-3xl font-bold mb-6 text-white">Your Business Metrics</h2>
        <div className="space-y-8">
          {renderInputs()}
        </div>
      </div>
    </div>
  );
};

export default CalculatorForm;