export function formatDate(date) {
  const newDate = new Date(date);

  // Format as DD/MM/YYYY
  const formatted = newDate.toLocaleDateString("en-IN");
  // 👉 "19/8/2025"
  return formatted;
}
