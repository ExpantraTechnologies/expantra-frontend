export function suggestAlternativeTimes(requestedISO: string, serviceDuration: number) {
  const requested = new Date(requestedISO);

  const options = [];

  // Try 30 minutes earlier
  const earlier = new Date(requested.getTime() - 30 * 60000);
  options.push(earlier);

  // Try 30 minutes later
  const later = new Date(requested.getTime() + 30 * 60000);
  options.push(later);

  // Try 1 hour later
  const later2 = new Date(requested.getTime() + 60 * 60000);
  options.push(later2);

  return options.map((d) => d.toISOString());
}
