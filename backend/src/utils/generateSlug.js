const slugify = require('slugify');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 6);

/**
 * Generate a URL-friendly slug from a title with a short unique suffix.
 * Example: "Tech Meetup 2026" → "tech-meetup-2026-a3f8k2"
 */
const generateSlug = (title) => {
  const base = slugify(title, { lower: true, strict: true });
  return `${base}-${nanoid()}`;
};

module.exports = generateSlug;
