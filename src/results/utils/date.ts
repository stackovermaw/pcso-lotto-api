import { MONTHS } from "../_constants";

export const formatDate = (date: Date) => {
  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const isSameDate = (dateA: Date, dateB: Date) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDay() === dateB.getDay();
