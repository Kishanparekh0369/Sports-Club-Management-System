const generateCsv = (headers, rows) => {
  const escapeCsv = (str) => {
    if (str === null || str === undefined) return '""';
    const stringVal = String(str);
    return `"${stringVal.replace(/"/g, '""')}"`;
  };

  const headerLine = headers.map(h => escapeCsv(h.label)).join(',');
  const rowLines = rows.map(row => {
    return headers.map(h => escapeCsv(row[h.key])).join(',');
  });

  return [headerLine, ...rowLines].join('\r\n');
};

module.exports = { generateCsv };
