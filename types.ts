
export interface MathStep {
  title: string;
  explanation: string;
  formula?: string;
}

export interface MathResponse {
  domain: string;
  problem: string;
  assumptions: string[];
  steps: MathStep[];
  alternativeMethods?: string[];
  finalAnswer: string;
  latexAnswer: string;
}

export interface CalculationRecord {
  id: string;
  timestamp: number;
  problem: string;
  response: MathResponse;
}

export enum MathDomain {
  Arithmetic = "Arithmetic",
  Algebra = "Algebra",
  Trigonometry = "Trigonometry",
  Calculus = "Calculus",
  Geometry = "Coordinate Geometry",
  Matrices = "Matrices & Determinants",
  Probability = "Probability & Statistics",
  NumberTheory = "Number Theory",
  Other = "General Mathematics"
}
