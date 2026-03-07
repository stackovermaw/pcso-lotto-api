import { LOCALE, LOCALE_OPTIONS, MONTHS } from "../../../results/_constants";
import type { Month } from "../../../results/results-enum";

const decomposeDateString = (date: string) => {
  const [month, day, year] = date.split("-");
  const givenMonth = month.toLowerCase() as Month;
  const givenMonthIndex = MONTHS.indexOf(givenMonth);

  return { month, day, year, givenMonthIndex };
};

export const formatDate = (input: Date | string) => {
  let date: Date;

  if (typeof input === "string") {
    // parse M/D/YYYY manually
    const [month, day, year] = input.split("/").map(Number);
    date = new Date(year, month - 1, day);
  } else {
    date = input;
  }

  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid date");
  }

  const month = MONTHS[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();

  return `${month}-${day}-${year}`;
};

export const parseDate = (date: string): Date => {
  const { day, year, givenMonthIndex, month } = decomposeDateString(date);

  if (givenMonthIndex === -1) throw new Error(`Invalid month: ${month}`);

  return new Date(parseInt(year, 10), givenMonthIndex, parseInt(day, 10));
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

export const isToday = (date: string): boolean => {
  const { day, givenMonthIndex, year } = decomposeDateString(date);

  const now = new Date();
  const nowParts = new Intl.DateTimeFormat(LOCALE, {
    ...LOCALE_OPTIONS,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  })
    .formatToParts(now)
    .reduce(
      (acc, part) => {
        console.log({ part });
        if (part.type === "day") acc.day = parseInt(part.value, 10);
        if (part.type === "month") acc.month = parseInt(part.value, 10);
        if (part.type === "year") acc.year = parseInt(part.value, 10);
        return acc;
      },
      {} as { day: number; month: number; year: number },
    );

  const isSameDate =
    parseInt(year, 10) === nowParts.year &&
    // add 1 to givenMonthIndex since it's 0-indexed but the formatted month is 1-indexed
    givenMonthIndex + 1 === nowParts.month &&
    parseInt(day, 10) === nowParts.day;

  return isSameDate;
};
