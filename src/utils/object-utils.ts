export class ObjectUtls {
  static isEmpty<K extends string, V extends string>(obj: Record<K, V>) {
    return Object.keys(obj).length == 0;
  }

  static getKeys<K extends string, V extends string>(obj: Record<K, V>) {
    return Object.keys(obj).map((key) => key) as K[];
  }

  static getValues<K extends string, V extends string>(obj: Record<K, V>) {
    return Object.values(obj).map((value) => value) as V[];
  }
}
