import React, { useState, useRef, useEffect } from 'react';
import { NavCard } from '../types';
import { Star, Copy, Check } from 'lucide-react';
import { recordKeywordHit } from '../utils/hotKeywords';
import { recordCardClick, getCardDailyClickCount } from '../utils/cardClicks';

interface NavCardItemProps {
  card: NavCard;
  isFavorite: boolean;
  onToggleFavorite: (card: NavCard) => void;
  onCopyUrl: (url: string, title: string) => void;
  onCardHoverStart?: (card: NavCard, rect: DOMRect) => void;
  onCardHoverEnd?: () => void;
  onCardClick?: (card: NavCard) => void;
  isEditMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (card: NavCard) => void;
}

export const NavCardItem: React.FC<NavCardItemProps> = ({
  card,
  isFavorite,
  onToggleFavorite,
  onCopyUrl,
  onCardHoverStart,
  onCardHoverEnd,
  onCardClick,
  isEditMode = false,
  isSelected = false,
  onToggleSelect
}) => {
  const [imgErrorStage, setImgErrorStage] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [dailyClicks, setDailyClicks] = useState<number>(() =>
    getCardDailyClickCount(card.id, card.title)
  );
  const cardRef = useRef<HTMLAnchorElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 3-tier fallback icon logic
  const handleImgError = () => {
    if (imgErrorStage === 0 && card.fallbackDomain) {
      setImgErrorStage(1); // Try iowen favicon
    } else {
      setImgErrorStage(2); // Fallback to character badge
    }
  };

  const getImgSrc = () => {
    if (imgErrorStage === 0 && card.icon) {
      return card.icon;
    }
    if (imgErrorStage === 1 && card.fallbackDomain) {
      return `https://api.iowen.cn/favicon/${card.fallbackDomain}.png`;
    }
    return '';
  };

  const fallbackLetter = card.fallbackText || card.title.slice(0, 1) || '网';

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onCopyUrl(card.url, card.title);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(card);
  };

  // 1-second hover timer for preview modal
  const handleMouseEnter = () => {
    if (isEditMode) return;
    // Refresh click count on hover
    setDailyClicks(getCardDailyClickCount(card.id, card.title));

    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = setTimeout(() => {
      if (cardRef.current && onCardHoverStart) {
        const rect = cardRef.current.getBoundingClientRect();
        onCardHoverStart(card, rect);
      }
    }, 1000);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    if (onCardHoverEnd) {
      onCardHoverEnd();
    }
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditMode) {
      e.preventDefault();
      e.stopPropagation();
      if (onToggleSelect) onToggleSelect(card);
      return;
    }

    // Click count request (+1) with keepalive simulation
    const updatedClicks = recordCardClick(card.id, card.title, card.url, card.subcatId);
    setDailyClicks(updatedClicks);

    // Record click count for popular search keywords
    recordKeywordHit(card.title, 2);
    if (onCardClick) onCardClick(card);
  };

  // Determine badge text variations (desktop full vs mobile short)
  const isNew = card.badge === '新' || card.badge === 'NEW';
  const badgeTextShort = card.badge ? (card.badge === '推荐' ? '推' : card.badge) : '';
  const badgeTextFull = card.badge
    ? card.badge === '推'
      ? '推荐'
      : card.badge === '热'
      ? '热门'
      : card.badge === '火'
      ? '火爆'
      : card.badge === '新'
      ? 'NEW'
      : card.badge
    : '';

  return (
    <div className="relative group/card min-w-0">
      <a
        ref={cardRef}
        href={isEditMode ? undefined : card.url}
        target={isEditMode ? undefined : "_blank"}
        rel={isEditMode ? undefined : "external nofollow noopener"}
        title={isEditMode ? `点击勾选/取消: ${card.title}` : `${card.title} - 今日点击 ${dailyClicks} 次`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`h-10 rounded-lg border px-2.5 flex items-center gap-2 transition-all duration-200 overflow-hidden relative ${
          isEditMode
            ? isSelected
              ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-500 ring-2 ring-blue-500 shadow-sm cursor-pointer'
              : 'bg-[var(--card-bg)] border-slate-300 dark:border-slate-700 hover:border-blue-400 cursor-pointer opacity-90 hover:opacity-100'
            : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:-translate-y-1 hover:scale-[1.03] hover:shadow-xl hover:shadow-blue-500/15 hover:border-blue-500/60 dark:hover:border-blue-400/60 active:scale-95'
        }`}
      >
        {/* Edit mode checkbox */}
        {isEditMode && (
          <div
            className={`w-4 h-4 rounded shrink-0 flex items-center justify-center border transition-all ${
              isSelected
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'bg-white dark:bg-slate-800 border-slate-400 dark:border-slate-600'
            }`}
          >
            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
        )}

        {/* Angled Badge Sticker on Top-Left Corner (-15 deg) */}
        {!isEditMode && card.badge && (
          <span
            className={`navcat-badge ${isNew ? 'navcat-badge-new' : ''}`}
            aria-label={badgeTextFull}
          >
            <span className="badge-full">{badgeTextFull}</span>
            <span className="badge-short">{badgeTextShort}</span>
          </span>
        )}

        {/* Favicon / Letter Badge */}
        <div className="relative w-5 h-5 shrink-0 flex items-center justify-center rounded overflow-hidden transition-transform duration-200 group-hover/card:scale-110 ml-0.5">
          {imgErrorStage < 2 && getImgSrc() ? (
            <img
              src={getImgSrc()}
              alt={card.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={handleImgError}
              className="w-5 h-5 rounded object-cover"
            />
          ) : (
            <div className="w-5 h-5 rounded flex items-center justify-center text-[11px] font-bold bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 dark:from-slate-700 dark:to-slate-800 dark:text-blue-300">
              {fallbackLetter}
            </div>
          )}
        </div>

        {/* Title */}
        <span
          className={`min-w-0 flex-1 truncate text-[13px] font-medium transition-colors duration-200 ${
            card.isTitleRed
              ? 'text-red-600 dark:text-red-400 font-semibold'
              : 'text-[var(--card-name)] group-hover/card:text-blue-600 dark:group-hover/card:text-blue-400'
          }`}
        >
          {card.title}
        </span>

        {/* Quick action buttons on hover */}
        <div className="hidden group-hover/card:flex items-center gap-1 shrink-0 bg-[var(--card-bg)] pl-1 z-10 animate-in fade-in duration-150">
          <button
            type="button"
            onClick={handleFav}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-amber-500 cursor-pointer transition-colors"
            title={isFavorite ? '取消收藏' : '收藏此网站'}
          >
            <Star className={`w-3 h-3 ${isFavorite ? 'fill-amber-400 text-amber-500' : ''}`} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-blue-500 cursor-pointer transition-colors"
            title="复制网址"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </a>
    </div>
  );
};
