export function formatDate(date) {
  if (!date) return 'N/A';

  const parsedDate = new Date(date);
  if (isNaN(parsedDate)) return 'Invalid date';

  return parsedDate.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
