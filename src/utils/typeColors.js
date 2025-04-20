// Map category names (lowercase) to Tailwind border color classes
export const categoryNameToColorMap = {
  technology: "border-orange-600",
  creative: "border-blue-600",
  tutorial: "border-lime-600",
  // 'lifestyle': "border-rose-500", // Example
  news: "border-red-600",
  javascript: "border-amber-500",
  salesforce: "border-teal-600",
  sociology: "border-indigo-600",
  life: "border-emerald-600",
  general: "border-stone-500", // Color for the 'General' tag fallback if needed
  // Add mappings for ALL your category names (lowercase)
  // It's crucial that the keys here match the lowercase names of your categories in the DB
  default: "border-gray-500", // Default fallback
};

/**
 * Gets the Tailwind border color class for a given category name.
 * @param {string | undefined} categoryName - The name of the category.
 * @returns {string} Tailwind border color class (e.g., "border-blue-600").
 */
export const getTypeColor = (categoryName) => {
  if (!categoryName) return categoryNameToColorMap.default;
  const nameLower = categoryName.toLowerCase();
  return categoryNameToColorMap[nameLower] || categoryNameToColorMap.default;
};
