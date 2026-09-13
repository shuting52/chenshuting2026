import React, { useState, useMemo } from 'react';
import { NavCard } from '../types';
import { NavCardItem } from './NavCardItem';
import { Bookmark, Trash2, PlusCircle, Flame, Clock, ArrowDownAZ } from 'lucide-react';
import { getCardDailyClickCount } from '../utils/cardClicks';

export type FavoritesSortMode = 'hot' | 'recent' | 'alphabetical';

interface FavoritesSectionProps {
  favoriteCards: NavCard[];
  customCards: NavCard[];
  favorites: string[];
  onToggleFavorite: (card: NavCard) => void;
  onRemoveCustomCard: (id: string) => void;
  onCopyUrl: (url: string, title: string) => void;
  onOpenAddCustom: () => void;
  onCardHoverStart?: (card: NavCard, rect: DOMRect) => void;
  onCardHoverEnd?: () => void;
  onCardClick?: (card: NavCard) => void;
  isEditMode?: boolean;
  selectedCardIds?: string[];
  onToggleSelectCard?: (card: NavCard) => void;
}

export const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favoriteCards,
  customCards,
  favorites,
  onToggleFavorite,
  onRemoveCustomCard,
  onCopyUrl,
  onOpenAddCustom,
  onCardHoverStart,
  onCardHoverEnd,
  onCardClick,
  isEditMode = false,
  selectedCardIds = [],
  onToggleSelectCard
}) => {
  const [sortMode, setSortMode] = useState<FavoritesSortMode>('recent');

  const allPinned = useMemo(() => {
    const raw = [...customCards, ...favoriteCards.filter((f) => !customCards.some((c) => c.id === f.id))];

    if (sortMode === 'hot') {
      return [...raw].sort(
        (a, b) => getCardDailyClickCount(b.id, b.title) - getCardDailyClickCount(a.id, a.title)
      );
    }

    if (sortMode === 'alphabetical') {
      return [...raw].sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN'));
    }

    // Default 'recent' maintains order of addition
    return raw;
  }, [favoriteCards, customCards, sortMode]);

  if (allPinned.length === 0) {
    return null;
  }

  return (
    <section
      id="section-favorites"
      className="bg-[var(--section-bg)] border-2 border-amber-400/40 dark:border-amber-500/30 rounded-xl p-3.5 mb-3 shadow-xs"
    >
      <div className="flex items-center justify-between gap-3 flex-wrap mb-2.5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
          <h2 className="text-[15px] font-bold text-[var(--iiice-title)] flex items-center gap-1.5">
            <Bookmark className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>我的专属收藏夹与自建网站</span>
          </h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
            {allPinned.length} 项
          </span>
        </div>

        {/* Sorting Button Group & Add Custom Button */}
        <div className="flex items-center gap-2.5 flex-wrap ml-auto">
          {/* Sorting Buttons */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700 text-[11px]">
            <button
              type="button"
              onClick={() => setSortMode('recent')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer font-medium ${
                sortMode === 'recent'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="按最近添加顺序排序"
            >
              <Clock className="w-3 h-3" />
              <span>最近添加</span>
            </button>

            <button
              type="button"
              onClick={() => setSortMode('hot')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer font-medium ${
                sortMode === 'hot'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="按今日点击热度从高到低排序"
            >
              <Flame className="w-3 h-3 text-orange-500" />
              <span>点击热度</span>
            </button>

            <button
              type="button"
              onClick={() => setSortMode('alphabetical')}
              className={`flex items-center gap-1 px-2 py-1 rounded-md transition-all cursor-pointer font-medium ${
                sortMode === 'alphabetical'
                  ? 'bg-white dark:bg-slate-700 text-amber-600 dark:text-amber-400 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
              }`}
              title="按卡片标题字母/拼音顺序排序"
            >
              <ArrowDownAZ className="w-3 h-3" />
              <span>字母顺序</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onOpenAddCustom}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer font-medium"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>添加自建网址</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5 animate-content-fade-in">
        {allPinned.map((card) => (
          <div key={card.id} className="relative group/fav">
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
            {!isEditMode && card.isCustom && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveCustomCard(card.id);
                }}
                className="absolute top-1 right-1 hidden group-hover/fav:flex p-1 rounded bg-red-600 text-white shadow-sm hover:bg-red-700 z-20 cursor-pointer"
                title="删除自建网址"
              >
                <Trash2 className="w-2.5 h-2.5" />
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
