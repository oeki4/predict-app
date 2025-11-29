import { create } from "zustand";
import type { SelectOption } from "@shared/ui/select/model";
import { forecastMonths } from "@shared/assets/const/forecastMonths";

export interface Forecast {
  product_name: string;
  historical_data: {
    date: string;
    value: number;
  }[];
  forecast_data: {
    date: string;
    value: number;
  }[];
  summary: string;
}

interface DashboardStore {
  forecast: Forecast | null;
  setForecast: (payload: Forecast | null) => void;
  setSelectedProduct: (payload: SelectOption) => void;
  setProducts: (payload: SelectOption[]) => void;
  selectedProduct: SelectOption | null;
  products: SelectOption[];
  forecastMonths: SelectOption;
  setForecastMonths: (payload: SelectOption) => void;
}

export const useDashboardStore = create<DashboardStore>((set) => ({
  forecast: null,
  selectedProduct: null,
  products: [],
  setForecast: (payload) => set({ forecast: payload }),
  setSelectedProduct: (payload) => set({ selectedProduct: payload }),
  setProducts: (payload) => set({ products: payload }),
  forecastMonths: forecastMonths[0],
  setForecastMonths: (payload) => set({ forecastMonths: payload }),
}));
