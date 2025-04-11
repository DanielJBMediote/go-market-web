/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValueTypes, WhereOperatorType } from "@/api/Where";

// Tipos auxiliares para chaves encadeadas
export type NestedKeys<T> = {
  [K in keyof T & string]: T[K] extends (...args: any[]) => any
    ? never // Exclui métodos
    : T[K] extends object
    ?
        | `${K}.${Exclude<
            keyof T[K],
            | symbol
            | {
                [P in keyof T[K]]: T[K][P] extends (...args: any[]) => any ? P : never;
              }[keyof T[K]]
          >}`
        | K
    : K;
}[keyof T & string];

interface HandleFilterProps<TKey, TState> {
  state: TState;
  key: TKey;
  value: ValueTypes;
  operator: WhereOperatorType;
}

export interface Filter<TKey> {
  key: TKey;
  value: ValueTypes;
  operator: WhereOperatorType;
}

// Tipo para extrair o tipo de uma chave encadeada
export type NestedKeyType<T, K extends string> = K extends `${infer P}.${infer S}`
  ? P extends keyof T
    ? S extends keyof T[P]
      ? T[P][S]
      : never
    : never
  : K extends keyof T
  ? T[K]
  : never;

export function handleFilter<
  TKey extends string,
  TState extends {
    filters: Array<Filter<TKey>>;
  }
>({ state, key, value, operator }: HandleFilterProps<TKey, TState>): TState {
  const filters = [...state.filters];

  // Comparação de chaves considerando encadeamento
  const existingFilterIndex = filters.findIndex((f) => f.key === key && f.operator === operator);

  // Se o valor for null ou vazio, remove o filtro
  if (value === null || value === "") {
    if (existingFilterIndex !== -1) {
      filters.splice(existingFilterIndex, 1);
    }
    return { ...state, filters };
  }

  // Se o filtro já existir, substitui o valor
  if (existingFilterIndex !== -1) {
    filters[existingFilterIndex] = { key, value, operator };
  } else {
    // Caso contrário, adiciona o novo filtro
    filters.push({ key, value, operator });
  }

  return { ...state, filters };
}
