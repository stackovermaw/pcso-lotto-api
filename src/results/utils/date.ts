import { MONTHS } from "../_constants";
import type { Month } from "../results-enum";

const decomposeDateString = (date: string) => {
  const [month, day, year] = date.split("-");
  const givenMonth = month.toLowerCase() as Month;
  const givenMonthIndex = MONTHS.indexOf(givenMonth);

  return { month, day, year, givenMonthIndex };
};

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

export const isWithinMonthDays = (date: string) => {
  const { day, year, givenMonthIndex } = decomposeDateString(date);
  // ? setting day as 0 rolls back the month so having it correctly indexed will get the prev month
  const monthDays = new Date(
    parseInt(year, 10),
    givenMonthIndex + 1,
    0,
  ).getDate();

  const parsedDay = parseInt(day, 10);

  return parsedDay >= 1 && parsedDay <= monthDays;
};

export const isWithinValidDate = (date: string) => {
  // june-3-2024
  const earliestMonthIndex = 6;
  const earliestDay = 3;
  const earliestYear = 2024;
  const earliestDate = new Date(
    earliestYear,
    earliestMonthIndex - 1,
    earliestDay,
  );

  const { day, year, givenMonthIndex } = decomposeDateString(date);

  const givenDate = new Date(
    parseInt(year, 10),
    givenMonthIndex,
    parseInt(day, 10),
  );

  return givenDate >= earliestDate;
};

export const isAFutureDate = (date: string) => {
  const now = new Date();

  const { day, year, givenMonthIndex } = decomposeDateString(date);

  const givenDate = new Date(
    parseInt(year, 10),
    givenMonthIndex,
    parseInt(day, 10),
  );

  return givenDate <= now;
};
