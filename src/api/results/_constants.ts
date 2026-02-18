import {
  Corporation,
  GameID,
  GameKeys,
  Month,
  ResultTime,
} from "./results-enum";

export const RESULTS_TODAY_URL =
  "https://www.lottopcso.com/lotto-result-today-summary/";

export const RESULTS_BY_DATE_URL =
  "https://www.lottopcso.com/pcso-lotto-result-";

export const GAME_IDS = [
  GameID.ULTRALOTTO_6_58,
  GameID.GRANDLOTTO_6_55,
  GameID.SUPERLOTTO_6_49,
  GameID.MEGALOTTO_6_45,
  GameID.LOTTO_6_42,
  GameID.LOTTO_6D,
  GameID.LOTTO_4D,
  GameID.LOTTO_3D,
  GameID.LOTTO_2D,
  GameID.STL_SWER3,
  GameID.SLT_SWER3_LAPU_LAPU_CITY,
  GameID.SLT_SWER3_MANDAUE_CITY,
  GameID.SWERTRES,
  GameID.EZ2,
  GameID.STL_PARES,
  GameID.STL_SWER2,
  GameID.STL_SWER4,
  GameID.OLD_GRAND_LOTTO,
  GameID.OLD_MEGA_LOTTO,
  GameID.OLD_LOTTO,
  GameID.OLD_SUPER_LOTTO,
  GameID.OLD_ULTRA_LOTTO,
];

export const RESULTS_TIME = [
  ResultTime.MORNING_10_00,
  ResultTime.AFTERNOON_2_00,
  ResultTime.AFTERNOON_3_00,
  ResultTime.AFTERNOON_5_00,
  ResultTime.EVENING_7_00,
  ResultTime.EVENING_8_00,
  ResultTime.EVENING_9_00,
];

export const CORPORATIONS = [
  Corporation.LAPU_LAPU_CITY,
  Corporation.MANDAUE_CITY,
  Corporation.OLD_LAPU_LAPU_CITY,
];

export const DESCRIPTION_KEYS = [
  GameKeys.WINNING_COMBINATION,
  GameKeys.WINNING_COMBINATION_EXACT,
  GameKeys.VISAYAS,
  GameKeys.MINDANAO,
  GameKeys.OLD_WINNING_COMBINATION,
  GameKeys.JACKPOT_PRIZE,
  GameKeys.NUMBER_OF_WINNERS,
  GameKeys.FIRST_PRIZE,
];

export const MONTHS = [
  Month.JANUARY,
  Month.FEBRUARY,
  Month.MARCH,
  Month.APRIL,
  Month.MAY,
  Month.JUNE,
  Month.JULY,
  Month.AUGUST,
  Month.SEPTEMBER,
  Month.OCTOBER,
  Month.NOVEMBER,
  Month.DECEMBER,
];

export const MS_IN_A_SECOND = 1000;
export const MS_IN_AN_HOUR = 3_600_000;

export const LOCALE = "en-PH";
export const LOCALE_OPTIONS = {
  hour12: false,
  timeZone: "Asia/Manila",
};

export const CUTOVER_DATE = new Date(2024, 5, 3);
