export interface Game extends Record<string, unknown> {
  gameId: string;
  description: string;
  corporation: string;
  time: string;
  result: string;
}
