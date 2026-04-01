import { create } from 'zustand';

type MindScreeningState = {
  phq9Scores: number[] | null;
  setPhq9Scores: (scores: number[]) => void;
  clearPhq9: () => void;
  gad7Scores: number[] | null;
  setGad7Scores: (scores: number[]) => void;
  clearGad7: () => void;
  /** Raw 0–4 responses per question (reverse items scored in `pss10TotalFromRaw`). */
  pss10RawScores: number[] | null;
  setPss10RawScores: (scores: number[]) => void;
  clearPss10: () => void;
};

export const useMindScreeningStore = create<MindScreeningState>((set) => ({
  phq9Scores: null,
  setPhq9Scores: (scores) => set({ phq9Scores: scores }),
  clearPhq9: () => set({ phq9Scores: null }),
  gad7Scores: null,
  setGad7Scores: (scores) => set({ gad7Scores: scores }),
  clearGad7: () => set({ gad7Scores: null }),
  pss10RawScores: null,
  setPss10RawScores: (scores) => set({ pss10RawScores: scores }),
  clearPss10: () => set({ pss10RawScores: null }),
}));
