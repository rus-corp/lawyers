// Texts from the admin panel are plain: paragraphs are separated by an empty line,
// lines that start with a dash or a bullet form a list, lines that start with "1." or "1)" a numbered one.
export type TextBlock =
  | { kind: 'paragraph'; lines: string[] }
  | { kind: 'bullets'; items: string[] }
  | { kind: 'numbers'; items: string[]; start: number };

const BULLET = /^[-–—•*]\s+/;
const NUMBER = /^(\d{1,2})[.)]\s+/;

export function parseText(text: string): TextBlock[] {
  const blocks: TextBlock[] = [];
  let current: TextBlock | null = null;
  for (const raw of text.replace(/\r\n?/g, '\n').split('\n')) {
    const line = raw.trim();
    if (!line) {
      current = null;
      continue;
    }
    const number = NUMBER.exec(line);
    if (BULLET.test(line)) {
      const item = line.replace(BULLET, '');
      if (current?.kind === 'bullets') current.items.push(item);
      else blocks.push((current = { kind: 'bullets', items: [item] }));
    } else if (number) {
      const item = line.slice(number[0].length);
      if (current?.kind === 'numbers') current.items.push(item);
      else blocks.push((current = { kind: 'numbers', items: [item], start: Number(number[1]) }));
    } else if (current?.kind === 'paragraph') {
      current.lines.push(line);
    } else {
      blocks.push((current = { kind: 'paragraph', lines: [line] }));
    }
  }
  return blocks;
}

// One line of text, for descriptions and structured data.
export function flattenText(text: string): string {
  return parseText(text)
    .map(block => (block.kind === 'paragraph' ? block.lines.join(' ') : block.items.join('; ')))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}
