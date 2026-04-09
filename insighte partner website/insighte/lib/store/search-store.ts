import { create } from 'zustand';

export type DiscoveryMode = 'specialists' | 'pathways';

export interface SearchState {
  query: string;
  specializations: string[];
  careModes: string[];
  targetAges: string[];
  location: string;
  city: string;
  discoveryMode: DiscoveryMode;
}

interface SearchStore extends SearchState {
  setQuery: (query: string) => void;
  setSpecializations: (specializations: string[]) => void;
  toggleSpecialization: (specialization: string) => void;
  setCareModes: (careModes: string[]) => void;
  toggleCareMode: (careMode: string) => void;
  setTargetAges: (targetAges: string[]) => void;
  toggleTargetAge: (targetAge: string) => void;
  setLocation: (location: string) => void;
  setCity: (city: string) => void;
  setDiscoveryMode: (mode: DiscoveryMode) => void;
  reset: () => void;
}

const initialState: SearchState = {
  query: '',
  specializations: [],
  careModes: [],
  targetAges: [],
  location: '',
  city: 'All',
  discoveryMode: 'specialists',
};

export const useSearchStore = create<SearchStore>((set) => ({
  ...initialState,
  setQuery: (query) => set({ query }),
  setSpecializations: (specializations) => set({ specializations }),
  toggleSpecialization: (spec) => set((state) => ({
    specializations: state.specializations.includes(spec)
      ? state.specializations.filter((s) => s !== spec)
      : [...state.specializations, spec],
  })),
  setCareModes: (careModes) => set({ careModes }),
  toggleCareMode: (mode) => set((state) => ({
    careModes: state.careModes.includes(mode)
      ? state.careModes.filter((m) => m !== mode)
      : [...state.careModes, mode],
  })),
  setTargetAges: (targetAges) => set({ targetAges }),
  toggleTargetAge: (age) => set((state) => ({
    targetAges: state.targetAges.includes(age)
      ? state.targetAges.filter((a) => a !== age)
      : [...state.targetAges, age],
  })),
  setLocation: (location) => set({ location }),
  setCity: (city) => set({ city }),
  setDiscoveryMode: (mode) => set({ discoveryMode: mode }),
  reset: () => set(initialState),
}));
