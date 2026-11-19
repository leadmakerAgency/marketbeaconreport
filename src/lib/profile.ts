// Step 2 of signup: optional details that help tailor briefings. Values are stored as Brevo text attributes.
export const COUNTRIES = ["Canada", "Germany", "United States", "Australia", "United Kingdom", "Austria", "Switzerland", "Ireland", "New Zealand", "Singapore", "Other"];

export const EXPERIENCE = [
  ["new", "New to investing"],
  ["some", "A few years in"],
  ["experienced", "Experienced"],
  ["pro", "Professional or adviser"],
] as const;

export const APPETITE = [
  ["steady", "Steady", "Large caps, dividends, index funds"],
  ["balanced", "Balanced", "A mix of established and growth names"],
  ["speculative", "Speculative", "Small caps, junior miners, early-stage tech"],
] as const;
