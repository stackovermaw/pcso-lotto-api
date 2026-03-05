export type GameResultsSource = {
  url: string;
  date: string;
};

export type ExtractedResults = {
  date: string;
  results: Record<string, Record<string, string>>;
};
