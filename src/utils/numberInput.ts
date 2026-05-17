export const coerceNumberInput = (
  value: string | number,
  fallback = 0
): number => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : fallback;
  }

  if (value.trim() === "") {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const normalizeNumberInput = (
  value: string | number,
  fallback = 0
): string => {
  return String(coerceNumberInput(value, fallback));
};