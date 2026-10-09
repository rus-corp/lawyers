'use client';

import { useId, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { normalize } from '@/lib/text';
import type { SearchItem, SearchKind } from '@/lib/types';

const MAX_RESULTS = 8;

const KIND: Record<SearchKind, { label: string; color: string }> = {
  document: { label: 'Документ', color: '#1B4FD8' },
  section: { label: 'Раздел', color: '#C62828' },
  category: { label: 'Категория', color: '#C62828' },
};

const KIND_ORDER: SearchKind[] = ['document', 'section', 'category'];

function search(items: SearchItem[], query: string): SearchItem[] {
  const tokens = normalize(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  return items
    .map(item => {
      const title = normalize(item.title);
      const haystack = `${title} ${normalize(item.context)}`;
      if (!tokens.every(token => haystack.includes(token))) return null;
      // Matches in the title rank above matches that only hit the parent section.
      const inTitle = tokens.every(token => title.includes(token));
      const rank = (title.startsWith(tokens[0]) ? 0 : inTitle ? 1 : 2) * 10 + KIND_ORDER.indexOf(item.kind);
      return { item, rank };
    })
    .filter((entry): entry is { item: SearchItem; rank: number } => entry !== null)
    .sort((a, b) => a.rank - b.rank || a.item.title.localeCompare(b.item.title, 'ru'))
    .slice(0, MAX_RESULTS)
    .map(entry => entry.item);
}

interface Props {
  items: SearchItem[];
  placeholder: string;
}

export default function CatalogSearch({ items, placeholder }: Props) {
  const router = useRouter();
  const listId = useId();
  const blurTimer = useRef(0);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const results = useMemo(() => search(items, query), [items, query]);
  const showPanel = open && query.trim().length > 0;

  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      setOpen(false);
      return;
    }
    if (!showPanel || results.length === 0) return;
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive(index => (index + 1) % results.length);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive(index => (index - 1 + results.length) % results.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      router.push(results[Math.min(active, results.length - 1)].url);
    }
  };

  return (
    <div
      className="relative"
      onFocus={() => window.clearTimeout(blurTimer.current)}
      onBlur={() => {
        blurTimer.current = window.setTimeout(() => setOpen(false), 120);
      }}
    >
      <div className="relative flex items-center">
        <svg className="absolute left-5 text-[#8C8880]" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          role="combobox"
          aria-label="Поиск по документам"
          aria-expanded={showPanel}
          aria-controls={listId}
          aria-autocomplete="list"
          autoComplete="off"
          value={query}
          placeholder={placeholder}
          onChange={event => {
            setQuery(event.target.value);
            setActive(0);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className="font-body w-full rounded-2xl border border-[#E8E4DE] bg-white py-4 pl-12 pr-6 text-[14px] text-[#1C1915] placeholder-[#B8B4AE] shadow-[0_2px_12px_rgba(28,25,21,0.05)] outline-none transition-all duration-300 focus:border-[#1B4FD8] focus:shadow-[0_0_0_3px_rgba(27,79,216,0.1)] [&::-webkit-search-cancel-button]:appearance-none"
        />
      </div>

      {showPanel && (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[#E8E4DE] bg-white shadow-[0_24px_60px_rgba(28,25,21,0.12)]"
        >
          {results.length === 0 ? (
            <div className="px-5 py-5 text-[13px] text-[#8C8880]">По запросу «{query.trim()}» ничего не найдено</div>
          ) : (
            results.map((item, index) => {
              const kind = KIND[item.kind];
              const selected = index === active;
              return (
                <Link
                  key={item.url}
                  href={item.url}
                  role="option"
                  aria-selected={selected}
                  data-cursor="document"
                  onMouseEnter={() => setActive(index)}
                  className="flex items-center gap-4 border-b border-[#F5F3EF] px-5 py-3.5 transition-colors last:border-b-0"
                  style={{ background: selected ? `${kind.color}0A` : 'white' }}
                >
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: kind.color }} />
                  <span className="min-w-0 flex-1">
                    <span className="font-display block truncate text-[14px] font-semibold text-[#1C1915]">{item.title}</span>
                    {item.context && <span className="block truncate text-[11px] text-[#8C8880]">{item.context}</span>}
                  </span>
                  <span
                    className="font-display hidden shrink-0 text-[10px] font-semibold uppercase tracking-[0.14em] sm:inline"
                    style={{ color: kind.color }}
                  >
                    {kind.label}
                  </span>
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
