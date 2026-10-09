import sanitizeHtml from 'sanitize-html';

const ALLOWED_TAGS = [
  ...sanitizeHtml.defaults.allowedTags,
  'img',
  'h1',
  'h2',
  'u',
  's',
];

export function sanitize(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ['href', 'name', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      td: ['colspan', 'rowspan'],
      th: ['colspan', 'rowspan'],
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', { rel: 'noopener noreferrer' }),
    },
  });
}

const BLOCK_BOUNDARY = /<\/?(?:p|div|li|ul|ol|h[1-6]|tr|td|th|blockquote|br)\b[^>]*>/gi;

export function stripHtml(html: string): string {
  // Block boundaries become spaces so that neighbouring paragraphs do not run together.
  return sanitizeHtml(html.replace(BLOCK_BOUNDARY, ' $& '), { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

export function excerpt(html: string, length = 200): string {
  const text = stripHtml(html);
  if (text.length <= length) return text;
  const cut = text.slice(0, length);
  return `${cut.slice(0, Math.max(cut.lastIndexOf(' '), length - 40)).replace(/[\s.,;:—-]+$/, '')}…`;
}

export function readTime(html: string): string {
  const words = stripHtml(html).split(' ').filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} мин`;
}
