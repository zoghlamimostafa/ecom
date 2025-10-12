/**
 * Generate a URL-friendly slug from a title
 * @param {string} title - The title to convert to slug
 * @returns {string} - URL-friendly slug
 */
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[àáâäãåą]/g, 'a')
    .replace(/[èéêëę]/g, 'e')
    .replace(/[ìíîïį]/g, 'i')
    .replace(/[òóôöõøő]/g, 'o')
    .replace(/[ùúûüű]/g, 'u')
    .replace(/[ÿý]/g, 'y')
    .replace(/[ñń]/g, 'n')
    .replace(/[çć]/g, 'c')
    .replace(/[ß]/g, 'ss')
    .replace(/[àáâäãåąčćďđèéêëęğìíîïįłńñòóôöõøőřšťùúûüűýÿž]/g, '')
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
};

module.exports = generateSlug;
