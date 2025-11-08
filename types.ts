
export enum Industry {
  Construction = "Construction & Subcontracting",
  Logistics = "Logistics & Freight",
  FieldServices = "Field Services",
  Dental = "Dental Practices",
  Accounting = "Accounting Firms",
}

export interface BaseInputs {
  employees: number;
  avgHourlyWage: number;
}

export interface ConstructionInputs extends BaseInputs {
  invoicesPerMonth: number;
  minutesPerInvoice: number;
}

export interface LogisticsInputs extends BaseInputs {
  invoicesPerMonth: number;
  minutesPerInvoice: number;
  avgInvoiceValue: number;
}

export interface FieldServicesInputs extends BaseInputs {
  missedCallsPerWeek: number;
  avgJobValue: number;
  noShowRate: number;
  jobsPerMonth: number;
}

export interface DentalInputs extends BaseInputs {
  patientsPerMonth: number;
  minutesPerVerification: number;
  noShowRate: number;
  avgAppointmentValue: number;
}

export interface AccountingInputs extends BaseInputs {
  clients: number;
  hoursPerClientReconciliation: number;
  billableRate: number;
}

export type AllInputs =
  | ConstructionInputs
  | LogisticsInputs
  | FieldServicesInputs
  | DentalInputs
  | AccountingInputs;

export interface RoiResult {
  monthlySavings: number;
  annualSavings: number;
  paybackMonths: number;
  annualROI: number;
  keyMetric: string;
}
