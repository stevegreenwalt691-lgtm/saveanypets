function escapeCsvCell(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

/** Builds CSV text from a header row and data rows. Every cell is stringified and escaped. */
export function buildCsv(headers: string[], rows: (string | number | boolean | null)[][]): string {
  const lines = [headers, ...rows].map((row) =>
    row.map((cell) => escapeCsvCell(cell === null || cell === undefined ? "" : String(cell))).join(","),
  );
  return lines.join("\r\n");
}
