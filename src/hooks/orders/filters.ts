import { IOrderApi } from "@/api/OrderApi";
import { WhereOperatorType } from "@/api/Where";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Filter, handleFilter, NestedKeys } from "../handle-filter";

export type OrderKeys = NestedKeys<IOrderApi>;

type State = {
  filters: Filter<OrderKeys>[];
};

type FilterValues = string | number | Date | boolean | null;

type Actions = {
  setFilter: (filterKey: OrderKeys, value: FilterValues, operator: WhereOperatorType) => void;
  resetFilter: (filterKey: OrderKeys, operator?: WhereOperatorType) => void;
  clearFilters: () => void;
};

const initialState: State = {
  filters: [],
};

export const useOrderFilters = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setFilter: (key: OrderKeys, value: FilterValues, operator: WhereOperatorType) => {
        set((state) =>
          handleFilter<OrderKeys, State & Actions>({
            state,
            key,
            value,
            operator,
          })
        );
      },
      resetFilter: (filterKey: OrderKeys, operator?: WhereOperatorType) => {
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
      name: "@go-market-zustand-storage:orders-filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
