import { IStoreApi } from "@/api/StoreApi";
import { ValueTypes, WhereOperatorType } from "@/api/Where";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { Filter, handleFilter, NestedKeys } from "../handle-filter";

export type StoreKeys = NestedKeys<IStoreApi>;

type States = {
  filters: Filter<StoreKeys>[];
};

type Actions = {
  setFilter: (key: StoreKeys, value: ValueTypes, operator: WhereOperatorType) => void;
  resetFilters: () => void;
  removeFilter: (filterKey: StoreKeys) => void;
};

const initialState: States = {
  filters: [],
};

export const useStoreFilters = create<States & Actions>()(
  persist(
    (set) => ({
      ...initialState,
      setFilter: (key: StoreKeys, value: ValueTypes, operator: WhereOperatorType) => {
        set((state) =>
          handleFilter<StoreKeys, States & Actions>({
            state,
            key,
            value,
            operator,
          })
        );
      },
      resetFilters: () => {
        set({ ...initialState });
      },
      removeFilter: (filterKey: StoreKeys) => {
        set((state) => ({
          ...state,
          filters: state.filters.filter((f) => f.key !== filterKey),
        }));
      },
    }),
    {
      name: "@go-market-zustand-storage:stores-filters",
      storage: createJSONStorage(() => localStorage), // Armazenamento na localStorage
    }
  )
);
