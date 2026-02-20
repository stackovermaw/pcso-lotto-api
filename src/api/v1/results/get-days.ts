export const getDays = (year: number, month: number) => {
  return new Date(year, month, 0).getDate();
};
