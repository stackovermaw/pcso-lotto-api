export const groupBy = (items: any[], key: string) =>
  items.reduce(
    (prev, current) => {
      const { gameId, ...newCurrent } = current;

      const groupKey = current[key];

      if (!prev[groupKey]) {
        prev[groupKey] = [];
      }

      prev[groupKey].push(newCurrent);

      return prev;
    },
    {} as Record<string, any[]>,
  );
