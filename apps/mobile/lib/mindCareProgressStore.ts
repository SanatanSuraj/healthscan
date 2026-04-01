import { create } from 'zustand';

type MindCareProgressState = {
  streak: number;
  xp: number;
  level: number;
  soundOn: boolean;
  /** UI hint only — full copy localization can plug in later */
  preferHindiUi: boolean;
  setSoundOn: (on: boolean) => void;
  toggleLangHint: () => void;
  addXp: (amount: number) => void;
};

export const useMindCareProgressStore = create<MindCareProgressState>((set) => ({
  streak: 4,
  xp: 155,
  level: 2,
  soundOn: true,
  preferHindiUi: false,
  setSoundOn: (on) => set({ soundOn: on }),
  toggleLangHint: () => set((s) => ({ preferHindiUi: !s.preferHindiUi })),
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
}));
