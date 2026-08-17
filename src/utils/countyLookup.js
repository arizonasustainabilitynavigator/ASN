let zipRecords = null;

async function loadZipData() {
  if (zipRecords) return zipRecords;

  const res = await fetch(`${import.meta.env.BASE_URL}AZ_COUNTYS.csv`);
  const text = await res.text();

  zipRecords = text
    .trim()
    .split('\n')
    .map((line) => {
      const cols = line.split(',').map((c) => c.trim());
      return {
        zip: cols[1],
        city: cols[2],
        county: cols[5],
      };
    })
    .filter((row) => row.zip && row.county);

  return zipRecords;
}

export async function getCountiesForZip(zip) {
  const data = await loadZipData();
  const cleanZip = zip.trim();

  const matches = data.filter((row) => row.zip === cleanZip);
  return [...new Set(matches.map((row) => row.county))];
}

// Returns every unique county in the dataset, alphabetically sorted.
export async function getAllCounties() {
  const data = await loadZipData();
  const unique = [...new Set(data.map((row) => row.county))];
  return unique.sort();
}