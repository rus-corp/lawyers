'use client';

import { useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';

// The custom cursor is decoration: its code loads after the page and only on devices with a mouse.
const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });

const MOUSE = '(hover: hover) and (pointer: fine)';

function subscribe(onChange: () => void) {
  const query = window.matchMedia(MOUSE);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

export default function DeferredCursor() {
  const hasMouse = useSyncExternalStore(subscribe, () => window.matchMedia(MOUSE).matches, () => false);
  return hasMouse ? <CustomCursor /> : null;
}
