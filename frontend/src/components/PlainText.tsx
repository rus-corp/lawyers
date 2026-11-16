import { Fragment } from 'react';
import { parseText } from '@/lib/plain-text';

// Renders a text written in the admin panel as paragraphs and lists. The text is never treated as HTML.
export default function PlainText({ text, className }: { text: string; className?: string }) {
  return (
    <div className={className}>
      {parseText(text).map((block, index) => {
        if (block.kind === 'paragraph') {
          return (
            <p key={index}>
              {block.lines.map((line, lineIndex) => (
                <Fragment key={lineIndex}>
                  {lineIndex > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </p>
          );
        }
        const items = block.items.map((item, itemIndex) => <li key={itemIndex}>{item}</li>);
        if (block.kind === 'numbers') {
          return (
            <ol key={index} start={block.start === 1 ? undefined : block.start}>
              {items}
            </ol>
          );
        }
        return <ul key={index}>{items}</ul>;
      })}
    </div>
  );
}
