// ? corporation headers look like "MANDAUE CITY (Piona Trading And Supply Corp.)"
// ? the operator in the parentheses changes over time, so we only rely on the
// ? city and ignore who is currently running the draw
const CORPORATION_HEADER = /^(.+?\bCITY)\s*\(.+\)$/i;

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/(^|[\s-])([a-z])/g, (_, separator, letter) => {
      return `${separator}${letter.toUpperCase()}`;
    });

// ? returns the city a game was drawn in, or null when the header is not a
// ? corporation (e.g. a date, or one of the site's non-results tables)
export const parseCity = (headerValue: string): string | null => {
  const match = headerValue.trim().match(CORPORATION_HEADER);

  if (!match) return null;

  return toTitleCase(match[1]);
};
