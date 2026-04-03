// src/lib/pdfParser.cjs
const pdf = require("pdf-parse");

async function parsePDF(buffer) {
  const data = await pdf(buffer);
  return data.text || "";
}

module.exports = { parsePDF };
