import { create } from "zustand";

export interface ForecastResult {
  id: number;
  product_name: string;
  period_months: number;
  summary: string;
  created_at: string;
}

interface DashboardStore {
  forecastResults: ForecastResult[];
  setForecastResults: (payload: ForecastResult[]) => void;
}

export const useHistoryStore = create<DashboardStore>((set) => ({
  forecastResults: [],
  setForecastResults: (payload) => set({ forecastResults: payload }),
}));
