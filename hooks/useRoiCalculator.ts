import { useMemo } from 'react';
import { Industry, AllInputs, RoiResult, ConstructionInputs, LogisticsInputs, FieldServicesInputs, DentalInputs, AccountingInputs } from '../types';

export const AUTOMATION_MONTHLY_COST = 499; // Assumed cost for the automation software

const calculateRoi = (industry: Industry, inputs: AllInputs): RoiResult => {
  let monthlySavings = 0;
  let keyMetric = "";

  const hourlyRate = inputs.avgHourlyWage;
  const minuteRate = hourlyRate / 60;

  switch (industry) {
    case Industry.Construction: {
      const { invoicesPerMonth, minutesPerInvoice } = inputs as ConstructionInputs;
      const timeSavedMinutes = invoicesPerMonth * minutesPerInvoice * 0.8; // Assume 80% time reduction
      monthlySavings = timeSavedMinutes * minuteRate;
      keyMetric = `${(timeSavedMinutes / 60).toFixed(0)} hours saved per month on invoicing.`;
      break;
    }
    case Industry.Logistics: {
      const { invoicesPerMonth, minutesPerInvoice, avgInvoiceValue } = inputs as LogisticsInputs;
      const timeSavedMinutes = invoicesPerMonth * minutesPerInvoice * 0.85; // Assume 85% reduction
      const dsoImprovementDays = 5; // Assume automation improves DSO by 5 days
      const dailyRevenue = (invoicesPerMonth * avgInvoiceValue) / 30;
      const cashflowImprovement = dailyRevenue * dsoImprovementDays;
      monthlySavings = (timeSavedMinutes * minuteRate) + (cashflowImprovement * 0.01); // Add a small value for cashflow improvement
       keyMetric = `Improved cash flow by ~$${cashflowImprovement.toFixed(0)} and saved ${(timeSavedMinutes / 60).toFixed(0)} hours.`;
      break;
    }
    case Industry.FieldServices: {
      const { missedCallsPerWeek, avgJobValue, noShowRate, jobsPerMonth } = inputs as FieldServicesInputs;
      const capturedRevenue = missedCallsPerWeek * 4 * 0.5 * avgJobValue; // Capture 50% of missed calls
      const recoveredRevenue = jobsPerMonth * (noShowRate/100) * 0.75 * avgJobValue; // Recover 75% of no-shows
      monthlySavings = capturedRevenue + recoveredRevenue;
      keyMetric = `~$${monthlySavings.toFixed(0)} in monthly captured & recovered revenue.`;
      break;
    }
    case Industry.Dental: {
      const { patientsPerMonth, minutesPerVerification, noShowRate, avgAppointmentValue } = inputs as DentalInputs;
      const verificationTimeSaved = patientsPerMonth * minutesPerVerification * 0.9 * minuteRate;
      const recoveredRevenue = patientsPerMonth * (noShowRate/100) * 0.8 * avgAppointmentValue; // Recover 80%
      monthlySavings = verificationTimeSaved + recoveredRevenue;
      keyMetric = `~$${recoveredRevenue.toFixed(0)} in recovered revenue and ${(verificationTimeSaved / minuteRate / 60).toFixed(0)} hours saved on admin.`;
      break;
    }
    case Industry.Accounting: {
      const { clients, hoursPerClientReconciliation, billableRate } = inputs as AccountingInputs;
      const adminHoursSaved = clients * hoursPerClientReconciliation * 0.7; // 70% reduction in reconciliation time
      const convertedToBillable = adminHoursSaved * 0.5; // Assume 50% of saved time becomes billable
      monthlySavings = convertedToBillable * billableRate;
      keyMetric = `Converted ${convertedToBillable.toFixed(0)} monthly admin hours into billable work.`;
      break;
    }
    default:
      return { monthlySavings: 0, annualSavings: 0, paybackMonths: 0, annualROI: 0, keyMetric: "" };
  }

  const netMonthlySavings = monthlySavings - AUTOMATION_MONTHLY_COST;
  const annualSavings = netMonthlySavings * 12;
  const paybackMonths = netMonthlySavings > 0 ? AUTOMATION_MONTHLY_COST / netMonthlySavings : Infinity;
  const annualROI = netMonthlySavings > 0 ? (annualSavings / (AUTOMATION_MONTHLY_COST * 12)) * 100 : 0;

  return {
    monthlySavings: Math.max(0, monthlySavings),
    annualSavings: Math.max(0, annualSavings),
    paybackMonths,
    annualROI,
    keyMetric,
  };
};

export const useRoiCalculator = (industry: Industry, inputs: AllInputs): RoiResult => {
  return useMemo(() => calculateRoi(industry, inputs), [industry, inputs]);
};