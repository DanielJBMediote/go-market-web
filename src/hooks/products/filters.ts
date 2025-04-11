import { IProductApi } from "@/api/ProductApi";
import { WhereOperatorType } from "@/api/Where";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Filter, handleFilter, NestedKeys } from "../handle-filter";

export type ProductKeys = NestedKeys<IProductApi>;

type State = {
  filters: Filter<ProductKeys>[];
};

type FilterValues = string | number | Date | boolean | null;

type Actions = {
  setFilter: (filterKey: ProductKeys, value: FilterValues, operator: WhereOperatorType) => void;
  removeFilter: (filterkey: ProductKeys, operator?: WhereOperatorType) => void;
  resetFilters: () => void;
};

const initialState: State = {
  filters: [],
};

export const useProductFilters = create<State & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setFilter: (key: ProductKeys, value: FilterValues, operator: WhereOperatorType) => {
        set((state) =>
          handleFilter<ProductKeys, State & Actions>({
            state,
            key,
            value,
            operator,
          })
        );
      },
      removeFilter: (filterKey: ProductKeys, operator?: WhereOperatorType) => {
        set((state) => ({
          ...state,
          filters: state.filters.filter(
            (filter) => !(filter.key === filterKey && (!operator || filter.operator === operator))
          ),
        }));
      },
      resetFilters: () => {
        set({ ...initialState });
      },
    }),
    {
      name: "@go-market-zustand-storage:products-filters",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
