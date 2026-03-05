import { MONTHS } from "../../../results/_constants";

export const formatDate = (date: Date) => {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const getDays = (year: number, month: number) => {
  // needs to add 1 because having day 0 gets the last day of the previous month,
  // so month + 1 gets the last day of the current month
  return new Date(year, month + 1, 0).getDate();
};
