export function formatPrice(value) {
  if (value === null || value === undefined || value === '') return '$0';
  const num = Number(value);
  if (Number.isNaN(num)) return `$${value}`;
  return `$${num.toLocaleString('es-MX')}`;
}
