import type { CSSProperties } from 'react';

const EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)';

interface Enter {
  // start offset: pixels or any CSS length
  x?: number | string;
  y?: number | string;
  scale?: number;
  scaleY?: number;
  // opacity at the start (0 by default) and at the end (1 by default)
  from?: number;
  to?: number;
  // seconds
  duration?: number;
  delay?: number;
  // the sharp ease-out used for headings
  expo?: boolean;
}

const length = (value: number | string) => (typeof value === 'number' ? `${value}px` : value);

// Start state of the `.enter` animation from globals.css, as CSS variables for the `style` prop.
export function enter({ x, y, scale, scaleY, from, to, duration, delay, expo }: Enter = {}): CSSProperties {
  const transform = [
    x !== undefined || y !== undefined ? `translate(${length(x ?? 0)}, ${length(y ?? 0)})` : '',
    scale !== undefined ? `scale(${scale})` : '',
    scaleY !== undefined ? `scaleY(${scaleY})` : '',
  ]
    .filter(Boolean)
    .join(' ');
  const style: Record<string, string | number> = {};
  if (transform) style['--enter-transform'] = transform;
  if (from !== undefined) style['--enter-opacity'] = from;
  if (to !== undefined) style['--enter-to'] = to;
  if (duration !== undefined) style['--enter-duration'] = `${duration}s`;
  if (delay) style['--enter-delay'] = `${delay}s`;
  if (expo) style['--enter-ease'] = EXPO;
  return style as CSSProperties;
}

// Delay for the n-th item of a list; items far down the list do not wait for the whole list.
export const stagger = (index: number, step: number, max = 10) => Math.min(index, max) * step;
