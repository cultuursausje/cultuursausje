/**
 * Minimale CSV-parser die quoted fields met komma's en escape-quotes ("") aankan.
 */
export function parseCSV(text: string): Record<string, string>[] {
  const rows = splitRows(text);
  if (rows.length === 0) return [];
  const header = parseLine(rows[0]);
  return rows.slice(1).filter(r => r.trim().length > 0).map(line => {
    const cells = parseLine(line);
    const obj: Record<string, string> = {};
    header.forEach((h, i) => { obj[h] = cells[i] ?? ""; });
    return obj;
  });
}

function splitRows(text: string): string[] {
  const rows: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      if (inQuotes && text[i + 1] === '"') { cur += '""'; i++; }
      else { inQuotes = !inQuotes; cur += c; }
    } else if ((c === "\n" || c === "\r") && !inQuotes) {
      if (cur.length > 0) rows.push(cur);
      cur = "";
      if (c === "\r" && text[i + 1] === "\n") i++;
    } else {
      cur += c;
    }
  }
  if (cur.length > 0) rows.push(cur);
  return rows;
}

function parseLine(line: string): string[] {
  const cells: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQuotes && line[i + 1] === '"') { cur += '"'; i++; }
      else { inQuotes = !inQuotes; }
    } else if (c === "," && !inQuotes) {
      cells.push(cur);
      cur = "";
    } else {
      cur += c;
    }
  }
  cells.push(cur);
  return cells.map(s => s.trim());
}
