// Formats a resource's city/county list into one readable line
export function formatResourceLocations(resource) {
  const cities = resource.cities || [];
  const counties = resource.counties || [];

  if (cities.length > 0) return cities.join(", ");
  if (counties.length > 0) return counties.join(", ");
  return "";
}
