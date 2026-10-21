export function formatDate(dateValue, fallback = 'Reciente') {
  if (!dateValue) return fallback;
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return fallback;
  return date.toLocaleDateString();
}
