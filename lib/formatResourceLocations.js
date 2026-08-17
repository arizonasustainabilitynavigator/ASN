// Curated resources come from the grouped Supabase view, so `cities` /
// `counties` are arrays (a resource can apply to many places) rather than
// a single city/county. This joins them into one visible, readable line
// instead of collapsing them into a bare count.
export function formatResourceLocations(resource) {
  const cities = resource.cities || [];
  const counties = resource.counties || [];

  if (cities.length > 0) return cities.join(", ");
  if (counties.length > 0) return counties.join(", ");
  return "";
}
