export function validateInput(value: string, minLength = 0): string | null {
  if (!value.trim()) return "Please paste some content before continuing.";
  if (value.trim().length < minLength)
    return `Please enter at least ${minLength} characters for accurate results.`;
  return null;
}
