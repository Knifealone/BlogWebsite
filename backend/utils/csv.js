/**
 * Converts rows to CSV. Cells that start with a spreadsheet formula character
 * are prefixed with an apostrophe so opening the file in Excel cannot run
 * anything that a visitor managed to put into the log.
 */
function escapeCell(value) {
  let text = value === null || value === undefined ? '' : String(value);
  if (/^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  if (/[",\n\r]/.test(text)) text = `"${text.replace(/"/g, '""')}"`;
  return text;
}

function toCsv(rows, columns) {
  const header = columns.map((c) => escapeCell(c.label)).join(',');
  const lines = rows.map((row) => columns.map((c) => escapeCell(row[c.key])).join(','));
  return [header, ...lines].join('\r\n');
}

module.exports = { toCsv };
