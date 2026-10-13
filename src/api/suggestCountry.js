import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { parse } from "csv-parse/sync";
import {
  SUPPORTED_ZIP_LOOKUP_CODES,
  COUNTRY_CODE_TO_NAME,
} from "../lib/countryCodes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Zip code data cache, per country
const zipDataCache = {};

// Load (and cache) the zip code data for a country
function loadZipData(countryCode) {
  if (zipDataCache[countryCode]) return zipDataCache[countryCode];

  const postalCodesDir = path.join(__dirname, "..", "..", "data", "postal-codes");

  const candidateNames = [
    `zipcodes.${countryCode}.csv`,
    `${countryCode}.csv`,
  ];
  const filePath = candidateNames
    .map((name) => path.join(postalCodesDir, name))
    .find((p) => fs.existsSync(p));

  if (!filePath) {
    console.warn(`[suggest-country] No CSV found for ${countryCode} (looked for: ${candidateNames.join(", ")})`);
    const empty = { set: new Set(), list: [] };
    zipDataCache[countryCode] = empty;
    return empty;
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  const zips = rows.map((row) => normalizeZip(row.zipcode));
  const data = { set: new Set(zips), list: zips };
  zipDataCache[countryCode] = data;
  return data;
}

// Normalize a zip code for comparison
function normalizeZip(zip) {
  return String(zip).trim().toUpperCase().replace(/\s+/g, "");
}

// Route: suggest countries matching a (possibly partial) zip code
router.get("/suggest-country", (req, res) => {
  const { zip } = req.query;

  if (!zip || zip.trim().length < 3) {
    return res.json({ matches: [] });
  }

  const normalized = normalizeZip(zip);
  const matches = [];

  for (const code of SUPPORTED_ZIP_LOOKUP_CODES) {
    const { set, list } = loadZipData(code);

    // Exact match, then prefix match
    let isMatch = set.has(normalized);

    if (!isMatch) {
      isMatch = list.some((z) => z.startsWith(normalized));
    }

    if (isMatch) {
      matches.push({ code, name: COUNTRY_CODE_TO_NAME[code] });
    }
  }

  res.json({ matches });
});

export default router;