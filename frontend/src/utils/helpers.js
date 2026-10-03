export const calculatePercentage = (score, total) => {
  if (!total) return 0;

  return Math.round((score / total) * 100);
};

export const getDifficultyClass = (difficulty) => {
  return difficulty?.toLowerCase() || "normal";
};