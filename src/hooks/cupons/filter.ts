import { ICuponApi } from "@/api/CuponApi";
import { WhereOperatorType } from "@/api/Where";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Filter, handleFilter, NestedKeys } from "../handle-filter";

export type CuponsKeys = NestedKeys<ICuponApi>;

type State = {
  filters: Filter<CuponsKeys>[];
};

type FilterValues = string | number | Date | boolean | null;

type Actions = {
  setFilter: (filterKey: CuponsKeys, value: FilterValues, operator: WhereOperatorType) => void;
  resetFilter: (filterKey: CuponsKeys, operator?: WhereOperatorType) => void;
  clearFilters: () => void;
};

const initialState: State = {
  filters: [],
};

export const useCuponsFilters = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setFilter: (key: CuponsKeys, value: FilterValues, operator: WhereOperatorType) => {
        set((state) =>
          handleFilter<CuponsKeys, State & Actions>({
            state,
            key,
            value,
            operator,
          })
        );
      },
      resetFilter: (filterKey: CuponsKeys, operator?: WhereOperatorType) => {
        set((state) => ({
          ...state,
          filters: state.filters.filter(
            (filter) => !(filter.key === filterKey && (!operator || filter.operator === operator))
          ),
        }));
      },
      clearFilters: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "@go-market-zustand-storage:cupons-filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
