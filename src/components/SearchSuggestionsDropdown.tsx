import React, { useMemo } from 'react';
import { Category, NavCard } from '../types';
import { Sparkles, ExternalLink, ArrowRight, Compass } from 'lucide-react';

export interface SearchSuggestionItem {
  type: 'card' | 'category';
  id: string;
  title: string;
  desc?: string;
  categoryId: string;
  categoryName: string;
  subcatName?: string;
  icon?: string;
  url?: string;
  card?: NavCard;
}

interface SearchSuggestionsDropdownProps {
  query: string;
  isOpen: boolean;
  categories: Category[];
  customCards?: NavCard[];
  onSelectSuggestion: (item: SearchSuggestionItem) => void;
  onClose: () => void;
}

export const SearchSuggestionsDropdown: React.FC<SearchSuggestionsDropdownProps> = ({
  query,
  isOpen,
  categories,
  customCards = [],
  onSelectSuggestion,
  onClose
}) => {
  const suggestions = useMemo<SearchSuggestionItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const results: SearchSuggestionItem[] = [];

    // 1. Check matching categories first
    for (const cat of categories) {
      if (cat.name.toLowerCase().includes(q)) {
        results.push({
          type: 'category',
          id: `cat-${cat.id}`,
          title: cat.name,
          desc: `浏览该分类下全部 ${cat.cards.length} 个精选网址`,
          categoryId: cat.id,
          categoryName: cat.name
        });
      }
    }

    // 2. Check custom cards
    for (const card of customCards) {
      const matchTitle = card.title.toLowerCase().includes(q);
      const matchDesc = card.desc && card.desc.toLowerCase().includes(q);
      if (matchTitle || matchDesc) {
        results.push({
          type: 'card',
          id: `custom-${card.id}`,
          title: card.title,
          desc: card.desc,
          categoryId: 'favorites',
          categoryName: '我的收藏与自建',
          icon: card.icon,
          url: card.url,
          card
        });
      }
    }

    // 3. Check preset cards
    for (const cat of categories) {
      for (const card of cat.cards) {
        const titleLower = card.title.toLowerCase();
        const matchTitle = titleLower.includes(q);
        const matchDesc = card.desc && card.desc.toLowerCase().includes(q);

        if (matchTitle || matchDesc) {
          const sub = cat.subcategories.find((s) => s.id === card.subcatId);
          results.push({
            type: 'card',
            id: card.id,
            title: card.title,
            desc: card.desc,
            categoryId: cat.id,
            categoryName: cat.name,
            subcatName: sub?.name,
            icon: card.icon,
            url: card.url,
            card
          });
        }
        if (results.length >= 25) break;
      }
      if (results.length >= 25) break;
    }

    // Sort: title exact match / startsWith first, then contains
    return results
      .sort((a, b) => {
        const aTitleLower = a.title.toLowerCase();
        const bTitleLower = b.title.toLowerCase();
        const aStarts = aTitleLower.startsWith(q);
        const bStarts = bTitleLower.startsWith(q);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return 0;
      })
      .slice(0, 8);
  }, [query, categories, customCards]);

  if (!isOpen || !query.trim() || suggestions.length === 0) {
    return null;
  }

  // Highlight matched substrings
  const renderHighlighted = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-950/60 px-0.5 rounded">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div
      className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-[var(--iiice-white)] border border-[var(--iiice-border)] rounded-xl shadow-2xl shadow-black/15 overflow-hidden animate-content-fade-in"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/60 border-b border-[var(--iiice-border)] flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>实时联想建议 ({suggestions.length})</span>
        </span>
        <span className="text-[10px] text-slate-400">按 Enter 或直接点击跳转</span>
      </div>

      <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
        {suggestions.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              onSelectSuggestion(item);
              onClose();
            }}
            className="p-2.5 hover:bg-blue-50/70 dark:hover:bg-slate-800/80 transition-colors flex items-center justify-between gap-2.5 cursor-pointer group"
          >
            <div className="flex items-center gap-2.5 min-w-0 flex-1">
              {item.type === 'category' ? (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
                  {item.icon ? (
                    <img
                      src={item.icon}
                      alt=""
                      className="w-4 h-4 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <span className="text-xs font-bold text-slate-500">
                      {item.title.charAt(0)}
                    </span>
                  )}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs font-semibold text-[var(--iiice-title)] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {renderHighlighted(item.title, query)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-medium">
                    {item.categoryName} {item.subcatName ? `· ${item.subcatName}` : ''}
                  </span>
                </div>
                {item.desc && (
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {renderHighlighted(item.desc, query)}
                  </p>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-1 text-[11px] text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              <span className="hidden sm:inline">直达</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
