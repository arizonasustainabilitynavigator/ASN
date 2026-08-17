import fs from "fs";
import path from "path";
import { parse } from "csv-parse/sync";
import {
  SUPPORTED_ZIP_LOOKUP_CODES,
  COUNTRY_CODE_TO_NAME,
} from "@/lib/countryCodes";

// In-memory cache: { US: Set("10001", "10002", ...), CA: Set(...), ... }
// Lives for the life of the server process / lambda instance.
const zipSetCache = {};

function loadZipSet(countryCode) {
  if (zipSetCache[countryCode]) return zipSetCache[countryCode];

  const filePath = path.join(
    process.cwd(),
    "data",
    "postal-codes",
    `${countryCode}.csv`
  );

  if (!fs.existsSync(filePath)) {
    zipSetCache[countryCode] = new Set();
    return zipSetCache[countryCode];
  }

  const raw = fs.readFileSync(filePath, "utf-8");
  const rows = parse(raw, { columns: true, skip_empty_lines: true });

  const set = new Set(
    rows.map((row) => normalizeZip(row.zipcode))
  );
  zipSetCache[countryCode] = set;
  return set;
}

function normalizeZip(zip) {
  return String(zip).trim().toUpperCase().replace(/\s+/g, "");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const zip = searchParams.get("zip");

  if (!zip || zip.trim().length < 3) {
    return Response.json({ matches: [] });
  }

  const normalized = normalizeZip(zip);
  const matches = [];

  for (const code of SUPPORTED_ZIP_LOOKUP_CODES) {
    const zipSet = loadZipSet(code);
    if (zipSet.has(normalized)) {
      matches.push({ code, name: COUNTRY_CODE_TO_NAME[code] });
    }
  }

  return Response.json({ matches });
}
