import { Filter } from "@/hooks/handle-filter";

export type WhereOperatorType =
  | "LIKE"
  | "EQUALS"
  | "NOT"
  | "GREATER_THAN"
  | "GREATER_THAN_OR_EQUALS"
  | "LESS_THAN"
  | "LESS_THAN_OR_EQUALS"
  | "BEFORE_DATE"
  | "AFTER_DATE";

export type ValueTypes = string | number | Date | boolean | null;

type WhereParam<T> = {
  columnName: T;
  value: ValueTypes;
  operator: WhereOperatorType;
};

export class Where<T> {
  private where: WhereParam<T>[] = [];

  constructor() {}

  addCondition(columnName: T, value: ValueTypes, operator: WhereOperatorType) {
    if (columnName && value && operator) {
      this.where.push({ columnName, value, operator });
    }

    return this; // Permite encadeamento de métodos
  }

  addFilters<IData>(filters: Filter<IData>[]) {
    filters.forEach((f) => {
      if (!f.key || !f.value || typeof f.key !== "string") return;
      this.addCondition(f.key as T, f.value, f.operator);
    });
  }

  build() {
    return encodeURIComponent(JSON.stringify(this.where));
  }
}
