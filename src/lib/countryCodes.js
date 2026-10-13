// Country name -> ISO code lookup
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

// Codes supported by zip lookup
export const SUPPORTED_ZIP_LOOKUP_CODES = Object.values(COUNTRY_NAME_TO_CODE);