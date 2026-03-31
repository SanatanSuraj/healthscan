import { create } from 'zustand';

export type Sex = '' | 'male' | 'female' | 'other';

export type HistoryField =
  | 'diabetes'
  | 'hypertension'
  | 'glasses'
  | 'cataract';

export type EyeSide = 'od' | 'os';

export interface PatientDetails {
  fullName: string;
  age: string;
  sex: Sex;
  phone: string;
  village: string;
  history: Record<HistoryField, boolean>;
}

export interface VisualAcuityEyeResult {
  correct: number;
  total: number;
  snellenLabel: string;
  logMAR: string;
}

export interface ColorPlateResult {
  plateIndex: number;
  selected: number;
  correctDigit: number;
}

function emptyPatient(): PatientDetails {
  return {
    fullName: '',
    age: '',
    sex: '',
    phone: '',
    village: '',
    history: {
      diabetes: false,
      hypertension: false,
      glasses: false,
      cataract: false,
    },
  };
}

export interface EyeScreeningState {
  consent: boolean;
  setConsent: (v: boolean) => void;
  patient: PatientDetails;
  setPatientField: <K extends keyof PatientDetails>(
    key: K,
    value: PatientDetails[K],
  ) => void;
  setHistory: (key: HistoryField, value: boolean) => void;
  visualAcuity: Record<EyeSide, VisualAcuityEyeResult | null>;
  setVisualAcuity: (side: EyeSide, result: VisualAcuityEyeResult) => void;
  nearVisionN: string | null;
  setNearVisionN: (n: string) => void;
  colorResults: ColorPlateResult[];
  addColorResult: (r: ColorPlateResult) => void;
  contrastFinal: { percent: number; logCS: string; levelIndex: number } | null;
  setContrastFinal: (v: {
    percent: number;
    logCS: string;
    levelIndex: number;
  }) => void;
  amsler: Record<EyeSide, string[]>;
  markAmsler: (side: EyeSide, cellKey: string) => void;
  symptoms: (boolean | null)[];
  setSymptom: (index: number, value: boolean) => void;
  /** Clears screening data but keeps landing consent for the current visit */
  resetClinicalData: () => void;
  resetSession: () => void;
}

export const useEyeScreeningStore = create<EyeScreeningState>((set) => ({
  consent: false,
  setConsent: (v) => set({ consent: v }),
  patient: emptyPatient(),
  setPatientField: (key, value) =>
    set((s) => ({
      patient: { ...s.patient, [key]: value },
    })),
  setHistory: (key, value) =>
    set((s) => ({
      patient: {
        ...s.patient,
        history: { ...s.patient.history, [key]: value },
      },
    })),
  visualAcuity: { od: null, os: null },
  setVisualAcuity: (side, result) =>
    set((s) => ({
      visualAcuity: { ...s.visualAcuity, [side]: result },
    })),
  nearVisionN: null,
  setNearVisionN: (n) => set({ nearVisionN: n }),
  colorResults: [],
  addColorResult: (r) =>
    set((s) => ({ colorResults: [...s.colorResults, r] })),
  contrastFinal: null,
  setContrastFinal: (v) => set({ contrastFinal: v }),
  amsler: { od: [], os: [] },
  markAmsler: (side, cellKey) =>
    set((s) => {
      const cur = s.amsler[side];
      if (cur.includes(cellKey)) return s;
      return {
        amsler: { ...s.amsler, [side]: [...cur, cellKey] },
      };
    }),
  symptoms: Array(10).fill(null) as (boolean | null)[],
  setSymptom: (index, value) =>
    set((s) => {
      const next = [...s.symptoms];
      next[index] = value;
      return { symptoms: next };
    }),
  resetClinicalData: () =>
    set((s) => ({
      consent: s.consent,
      patient: emptyPatient(),
      visualAcuity: { od: null, os: null },
      nearVisionN: null,
      colorResults: [],
      contrastFinal: null,
      amsler: { od: [], os: [] },
      symptoms: Array(10).fill(null) as (boolean | null)[],
    })),
  resetSession: () =>
    set({
      consent: false,
      patient: emptyPatient(),
      visualAcuity: { od: null, os: null },
      nearVisionN: null,
      colorResults: [],
      contrastFinal: null,
      amsler: { od: [], os: [] },
      symptoms: Array(10).fill(null) as (boolean | null)[],
    }),
}));
