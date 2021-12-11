// Trim the input for \r etc
export const trimInput = (input: string): string => {
  return String(input)
    .trim()
    .split("\n")
    .map((i) => i.trim())
    .join("\n");
};
