export class ObjectUtls {
  static isEmpty<K extends string, V extends string>(obj: Record<K, V>) {
    return Object.keys(obj).length == 0;
  }
}
