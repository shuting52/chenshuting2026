import React, { useState } from 'react';
import { Category, NavCard } from '../types';
import { NavCardItem } from './NavCardItem';

interface CategorySectionProps {
  category: Category;
  inSiteQuery: string;
  favorites: string[];
  onToggleFavorite: (card: NavCard) => void;
  onCopyUrl: (url: string, title: string) => void;
  onCardHoverStart?: (card: NavCard, rect: DOMRect) => void;
  onCardHoverEnd?: () => void;
  onCardClick?: (card: NavCard) => void;
  isEditMode?: boolean;
  selectedCardIds?: string[];
  onToggleSelectCard?: (card: NavCard) => void;
}

export const CategorySection: React.FC<CategorySectionProps> = ({
  category,
  inSiteQuery,
  favorites,
  onToggleFavorite,
  onCopyUrl,
  onCardHoverStart,
  onCardHoverEnd,
  onCardClick,
  isEditMode = false,
  selectedCardIds = [],
  onToggleSelectCard
}) => {
  // Default to the first subcategory
  const defaultSubcat = category.subcategories[0]?.id || '';
  const [activeSubcat, setActiveSubcat] = useState<string>(defaultSubcat);

  // Filter cards:
  // If inSiteQuery is present, show cards that match the query in this category regardless of subcat.
  // Otherwise, show cards matching the active subcategory.
  const filteredCards = category.cards.filter((card) => {
    if (inSiteQuery.trim()) {
      const q = inSiteQuery.toLowerCase().trim();
      return (
        card.title.toLowerCase().includes(q) ||
        (card.desc && card.desc.toLowerCase().includes(q)) ||
        card.url.toLowerCase().includes(q)
      );
    }
    return card.subcatId === activeSubcat;
  });

  // If inSiteQuery is active and no cards match this category, don't show the category section
  if (inSiteQuery.trim() && filteredCards.length === 0) {
    return null;
  }

  return (
    <section
      id={`section-${category.id}`}
      data-category-id={category.id}
      className="iiice-section bg-[var(--section-bg)] border border-slate-200/80 dark:border-slate-800 rounded-xl p-3.5 mb-3 shadow-xs hover:shadow-md transition-all duration-300"
    >
      {/* Header */}
      <div className="min-h-7 flex items-center justify-between gap-3 flex-wrap mb-2.5">
        {/* Left: marker + title */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" aria-hidden="true" />
          <h2 className="text-[15px] font-bold text-[var(--iiice-title)] tracking-tight">
            {category.name}
          </h2>
        </div>

        {/* Middle: Subcategory pills (if not filtering by global query and subcats exist) */}
        {!inSiteQuery.trim() && category.subcategories.length > 0 && (
          <div className="iiice-subcategories overflow-x-auto shrink-0">
            {category.subcategories.map((subcat) => {
              const isActive = activeSubcat === subcat.id;
              return (
                <button
                  key={subcat.id}
                  type="button"
                  data-cateid={subcat.id}
                  onClick={() => setActiveSubcat(subcat.id)}
                  className={`iiice-subcat-item ${isActive ? 'active' : ''}`}
                >
                  {subcat.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Right: resource count */}
        <div className="text-xs text-slate-400 dark:text-slate-500 ml-auto shrink-0">
          {inSiteQuery.trim() ? (
            <span>匹配到 {filteredCards.length} 项</span>
          ) : (
            <span>
              {category.subcategories.find((s) => s.id === activeSubcat)?.name || ''} ({filteredCards.length}) · 全类共 {category.cards.length} 个资源
            </span>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      <div
        key={`${category.id}-${activeSubcat}-${inSiteQuery ? 'search' : 'normal'}`}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 animate-content-fade-in"
      >
        {filteredCards.map((card) => (
          <div key={card.id} className="iiice-card-container" data-cateid={card.subcatId}>
            <NavCardItem
              card={card}
              isFavorite={favorites.includes(card.id)}
              onToggleFavorite={onToggleFavorite}
              onCopyUrl={onCopyUrl}
              onCardHoverStart={onCardHoverStart}
              onCardHoverEnd={onCardHoverEnd}
              onCardClick={onCardClick}
              isEditMode={isEditMode}
              isSelected={selectedCardIds.includes(card.id)}
              onToggleSelect={onToggleSelectCard}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
