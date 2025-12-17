import React, { useEffect, useRef, useState } from 'react';

// Small, safe wrapper that shows a mobile hint when inner table overflows horizontally.
// Defensive: checks for window, ResizeObserver, and degrades to no hint in non-browser environments.
export default function TableWithHint({ children, className = '' }) {
  const rootRef = useRef(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const el = rootRef.current;
    if (!el) return undefined;

    const check = () => {
      try {
        const table = el.querySelector('table');
        if (!table) {
          setShowHint(false);
          return;
        }
        const isSmall = window.matchMedia('(max-width: 767px)').matches;
        setShowHint(isSmall && table.scrollWidth > table.clientWidth + 2);
      } catch {
        // fail silently
        setShowHint(false);
      }
    };

    check();

    let ro;
    if (typeof ResizeObserver !== 'undefined') {
      ro = new ResizeObserver(check);
      ro.observe(el);
      // also observe the table if present
      const table = el.querySelector('table');
      if (table) ro.observe(table);
    }

    window.addEventListener('resize', check);

    const mq = window.matchMedia('(max-width: 767px)');
    const mqHandler = () => check();
    if (mq.addEventListener) mq.addEventListener('change', mqHandler);
    else mq.addListener(mqHandler);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', check);
      if (mq.removeEventListener) mq.removeEventListener('change', mqHandler);
      else mq.removeListener(mqHandler);
    };
  }, []);

  return (
    <div ref={rootRef} className={className}>
      {showHint && (
        <div className="mb-2 text-sm text-slate-300 italic">Scorri a destra per visualizzare l'intera tabella.</div>
      )}
      {children}
    </div>
  );
}
