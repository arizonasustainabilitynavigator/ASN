// Maps the labels in ORG_COUNTRY_OPTIONS to ISO 3166-1 alpha-2 codes,
// which is what the zauberware postal-codes CSV filenames use
// (e.g. data/postal-codes/zipcodes.US.csv).
export const COUNTRY_NAME_TO_CODE = {
  "United States": "US",
  "Canada": "CA",
  "United Kingdom": "GB",
  "Germany": "DE",
  "France": "FR",
  "Australia": "AU",
};

export const COUNTRY_CODE_TO_NAME = Object.fromEntries(
  Object.entries(COUNTRY_NAME_TO_CODE).map(([name, code]) => [code, name])
);

// Only these countries get looked up against a zip code.
export const SUPPORTED_ZIP_LOOKUP_CODES = Object.values(COUNTRY_NAME_TO_CODE);