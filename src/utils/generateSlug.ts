/**
 * Converts a string into a clean, URL-friendly slug.
 * Example: "Laptop Gaming ASUS" -> "laptop-gaming-asus"
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // remove non-alphanumeric/non-space/non-hyphen characters
    .replace(/[\s_]+/g, '-')  // replace spaces and underscores with a single hyphen
    .replace(/^-+|-+$/g, ''); // remove leading and trailing hyphens
}
