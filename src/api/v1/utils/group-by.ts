export const groupBy = <
  T extends { gameId?: unknown } & Record<string, unknown>,
  K extends keyof T & string,
>(
  items: T[],
  key: K,
): Record<string, Omit<T, "gameId">[]> =>
  items.reduce<Record<string, Omit<T, "gameId">[]>>((prev, current) => {
    const { gameId, ...newCurrent } = current;
    const groupKey = String(current[key]);
    if (!prev[groupKey]) {
      prev[groupKey] = [];
    }
    prev[groupKey].push(newCurrent as Omit<T, "gameId">);
    return prev;
  }, {});
