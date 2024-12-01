export const isDefined = <T>(v: T | undefined | null): v is T => v !== undefined && v !== null;

export const wait = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const times = <T>(n: number, operation: () => T): T[] => {
    if (n < 0) throw new RangeError('Count must be non-negative');
    return Array.from({ length: n }, () => operation());
};

export const asyncTimes = async <T>(n: number, operation: () => Promise<T>, parallel = false): Promise<T[]> => {
    if (n < 0) throw new RangeError('Count must be non-negative');

    return parallel
        ? Promise.all(Array.from({ length: n }, () => operation()))
        : Array.from({ length: n }).reduce<Promise<T[]>>(
              async (acc, _) => {
                  const results = await acc;
                  results.push(await operation());
                  return results;
              },
              Promise.resolve([] as T[]),
          );
};

type Creator<V> = () => V;

export const mapGetOrCreate = <K, V>(map: Map<K, V>, key: K, creator: Creator<V>): V => {
    let value = map.get(key);
    if (!isDefined(value)) {
        value = creator();
        map.set(key, value);
    }
    return value;
};

export const invert = <T extends string | number | symbol>(map: Record<string, T>): Record<T, string> => {
    const entries = Object.entries(map);
    const hasDuplicateValues = new Set(Object.values(map)).size !== entries.length;

    if (hasDuplicateValues) {
        throw new Error('Cannot invert map with duplicate values');
    }

    return entries.reduce<Record<T, string>>(
        (acc, [k, v]) => {
            acc[v as T] = k;
            return acc;
        },
        {} as Record<T, string>,
    );
};
