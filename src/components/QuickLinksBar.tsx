import React from 'react';
import { TOP_NAV_LINKS } from '../data/searchEngines';

interface QuickLinksBarProps {
  onCategorySelect?: (categoryId: string) => void;
}

export const QuickLinksBar: React.FC<QuickLinksBarProps> = ({ onCategorySelect }) => {
  return (
    <div id="quicklinks" className="w-full bg-[var(--iiice-white)] border-b border-slate-200/60 dark:border-slate-800/80 select-none">
      <div className="max-w-[1320px] h-10 mx-auto px-3 flex items-center gap-4 overflow-x-auto whitespace-nowrap text-xs">
        {TOP_NAV_LINKS.map((link, idx) => {
          const isAnchor = link.url.startsWith('#');
          return (
            <a
              key={idx}
              href={link.url}
              onClick={(e) => {
                if (isAnchor && onCategorySelect) {
                  e.preventDefault();
                  const targetId = link.url.replace('#section-', '');
                  onCategorySelect(targetId);
                  const el = document.getElementById(link.url.replace('#', ''));
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              target={isAnchor ? '_self' : '_blank'}
              rel={isAnchor ? undefined : 'external nofollow noopener'}
              className={`shrink-0 transition-colors ${
                link.hot
                  ? 'text-red-600 dark:text-red-400 font-bold hover:text-red-700'
                  : 'text-[var(--iiice-title)] hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              {link.name}
            </a>
          );
        })}
      </div>
    </div>
  );
};
