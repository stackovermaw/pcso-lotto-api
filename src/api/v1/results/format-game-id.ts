export const formatGameId = (gameId: string): string => {
  return gameId.toLowerCase().replace(/[\s/]+/g, "-");
};
