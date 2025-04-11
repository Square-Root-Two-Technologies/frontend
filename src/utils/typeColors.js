// FILE: src/utils/typeColors.js

// Using warmer Tailwind v3 classes (adjust shades 500/600/700 as needed)
export const typeToColorMap = {
  // Warmer Tones
  technology: "border-orange-600", // Was blue
  creative: "border-blue-600", // Was purple
  tutorial: "border-lime-600", // Was green, Lime is warmer
  lifestyle: "border-rose-500", // Was pink, Rose feels warmer
  news: "border-red-600", // Keep red or maybe amber-700?
  javascript: "border-amber-500", // Was yellow, Amber is richer
  salesforce: "border-teal-600", // Was cyan, Teal is warmer
  sociology: "border-indigo-600", // Keep Indigo or change to purple-600?
  life: "border-emerald-600", // Was teal, Emerald is a rich green

  // Default - use a warm gray
  default: "border-stone-500", // Was gray
};

export const getTypeColor = (type) => {
  if (!type) return typeToColorMap.default;
  const typeLower = type.toLowerCase();
  // Ensure direct match or fallback to default
  return typeToColorMap[typeLower] || typeToColorMap.default;
};
