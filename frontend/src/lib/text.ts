export function plural(count: number, forms: [string, string, string]): string {
  const mod100 = Math.abs(count) % 100;
  const mod10 = mod100 % 10;
  if (mod100 > 10 && mod100 < 20) return forms[2];
  if (mod10 === 1) return forms[0];
  if (mod10 >= 2 && mod10 <= 4) return forms[1];
  return forms[2];
}

export const TEMPLATES: [string, string, string] = ['шаблон', 'шаблона', 'шаблонов'];
export const DOCUMENTS: [string, string, string] = ['документ', 'документа', 'документов'];
export const CATEGORIES: [string, string, string] = ['категория', 'категории', 'категорий'];
export const ARTICLES: [string, string, string] = ['статья', 'статьи', 'статей'];

export const withCount = (count: number, forms: [string, string, string]) => `${count} ${plural(count, forms)}`;

export const pad2 = (value: number) => String(value).padStart(2, '0');

export const normalize = (value: string) => value.toLowerCase().replace(/ё/g, 'е').trim();

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}

export const formatPrice = (price: number) => `${price.toLocaleString('ru-RU')} ₽`;

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
