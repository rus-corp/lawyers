import sanitizeHtml from 'sanitize-html';
import { truncate } from './text';

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

export const excerpt = (html: string, length = 200) => truncate(stripHtml(html), length);

export function readTime(html: string): string {
  const words = stripHtml(html).split(' ').filter(Boolean).length;
  return `${Math.max(1, Math.round(words / 180))} мин`;
}
