import React, { useState, useEffect, useRef } from 'react';
import { ALL_CATEGORIES, TOTAL_RESOURCE_COUNT } from './data/navData';
import { NavCard } from './types';
import { TopBar } from './components/TopBar';
import { Header } from './components/Header';
import { QuickLinksBar } from './components/QuickLinksBar';
import { CategoryNav } from './components/CategoryNav';
import { CategorySection } from './components/CategorySection';
import { FavoritesSection } from './components/FavoritesSection';
import { AddCustomModal } from './components/AddCustomModal';
import { AboutModal } from './components/AboutModal';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { Toast } from './components/Toast';
import { TopProgressBar } from './components/TopProgressBar';
import { CardPreviewModal } from './components/CardPreviewModal';
import { ClickEffectManager } from './components/ClickEffectManager';
import { CustomBackgroundModal, BackgroundSettings } from './components/CustomBackgroundModal';
import { ResourceSkeletonGrid } from './components/ResourceSkeletonGrid';
import { BatchActionToolbar } from './components/BatchActionToolbar';
import { DataBackupModal } from './components/DataBackupModal';
import { SearchX } from 'lucide-react';

export default function App() {
  // Dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      return localStorage.getItem('iiice_darkmode') === 'enabled';
    } catch {
      return false;
    }
  });

  // Edit mode & batch card management
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([]);

  // Backup modal state
  const [isBackupOpen, setIsBackupOpen] = useState<boolean>(false);

  // Custom background settings
  const [bgSettings, setBgSettings] = useState<BackgroundSettings>(() => {
    try {
      const saved = localStorage.getItem('user_custom_bg');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { type: 'none', value: '', blur: 0, opacity: 0.9 };
  });

  const [isBgModalOpen, setIsBgModalOpen] = useState(false);

  // Save custom background settings
  const handleSaveBgSettings = (settings: BackgroundSettings) => {
    setBgSettings(settings);
    try {
      localStorage.setItem('user_custom_bg', JSON.stringify(settings));
    } catch {
      // ignore
    }
    showToast('自定义背景设置已成功更新！');
  };

  // Pinned favorites
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('user_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User custom cards
  const [customCards, setCustomCards] = useState<NavCard[]>(() => {
    try {
      const saved = localStorage.getItem('user_custom_cards');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // In-site query
  const [inSiteQuery, setInSiteQuery] = useState<string>('');

  // Active category
  const [activeCategoryId, setActiveCategoryId] = useState<string>('');

  // Top progress bar loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const loadingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerLoadingProgress = () => {
    setIsLoading(true);
    if (loadingTimerRef.current) clearTimeout(loadingTimerRef.current);
    loadingTimerRef.current = setTimeout(() => {
      setIsLoading(false);
    }, 450);
  };

  // Card hover preview modal state
  const [hoveredCard, setHoveredCard] = useState<NavCard | null>(null);
  const [previewPosition, setPreviewPosition] = useState<{ top: number; left: number; placeAbove: boolean }>({
    top: 0,
    left: 0,
    placeAbove: false
  });

  // Modals & Toast
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isAddCustomOpen, setIsAddCustomOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2200);
  };

  // Content loading transition state for switching category or query
  const [isContentTransitioning, setIsContentTransitioning] = useState(false);
  const transitionTimerRef = useRef<NodeJS.Timeout | null>(null);

  const startContentTransition = (duration = 180) => {
    if (transitionTimerRef.current) {
      clearTimeout(transitionTimerRef.current);
    }
    setIsContentTransitioning(true);
    transitionTimerRef.current = setTimeout(() => {
      setIsContentTransitioning(false);
    }, duration);
  };

  // Handle inSite query change with progress bar feedback & skeleton transition
  const handleInSiteQueryChange = (query: string) => {
    setInSiteQuery(query);
    triggerLoadingProgress();
    startContentTransition(160);
  };

  // Handle category select with progress bar feedback & skeleton transition
  const handleCategorySelect = (id: string) => {
    setActiveCategoryId(id);
    triggerLoadingProgress();
    startContentTransition(180);
  };

  // Card 1-second hover start handler
  const handleCardHoverStart = (card: NavCard, rect: DOMRect) => {
    // Calculate best position for preview popup
    const popupWidth = Math.min(320, window.innerWidth - 32);
    const popupHeight = 160;

    let left = rect.left + rect.width / 2 - popupWidth / 2;
    // Boundary check
    if (left < 16) left = 16;
    if (left + popupWidth > window.innerWidth - 16) {
      left = window.innerWidth - popupWidth - 16;
    }

    const spaceBelow = window.innerHeight - rect.bottom;
    const placeAbove = spaceBelow < popupHeight + 20 && rect.top > popupHeight + 20;

    const top = placeAbove ? rect.top - popupHeight - 10 : rect.bottom + 10;

    setHoveredCard(card);
    setPreviewPosition({ top, left, placeAbove });
  };

  const handleCardHoverEnd = () => {
    setHoveredCard(null);
  };

  // Sync dark mode
  useEffect(() => {
    try {
      if (isDark) {
        document.documentElement.classList.add('dark-mode');
        localStorage.setItem('iiice_darkmode', 'enabled');
      } else {
        document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('iiice_darkmode', 'disabled');
      }
    } catch {
      // Ignore storage errors
    }
  }, [isDark]);

  // Sync favorites
  const handleToggleFavorite = (card: NavCard) => {
    let newFavs: string[];
    if (favorites.includes(card.id)) {
      newFavs = favorites.filter((id) => id !== card.id);
      showToast(`已从收藏夹移除：${card.title}`);
    } else {
      newFavs = [...favorites, card.id];
      showToast(`已成功收藏：${card.title}`);
    }
    setFavorites(newFavs);
    try {
      localStorage.setItem('user_favorites', JSON.stringify(newFavs));
    } catch {
      // Ignore storage errors
    }
  };

  // Add custom card
  const handleAddCustomCard = (newCard: NavCard) => {
    const updated = [newCard, ...customCards];
    setCustomCards(updated);
    try {
      localStorage.setItem('user_custom_cards', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    showToast(`已添加自建网址：${newCard.title}`);
  };

  // Remove custom card
  const handleRemoveCustomCard = (id: string) => {
    const updated = customCards.filter((c) => c.id !== id);
    setCustomCards(updated);
    try {
      localStorage.setItem('user_custom_cards', JSON.stringify(updated));
    } catch {
      // Ignore
    }
    showToast('已删除该自建网址');
  };

  // Copy URL
  const handleCopyUrl = (url: string, title: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(
        () => showToast(`已复制链接: ${title}`),
        () => showToast(`复制失败，请手动复制: ${url}`)
      );
    } else {
      showToast(`网址: ${url}`);
    }
  };

  // Collect all favorited cards
  const allCardsList = ALL_CATEGORIES.flatMap((c) => c.cards);
  const favoriteCards = allCardsList.filter((card) => favorites.includes(card.id));

  // Count total matches when filtering
  const totalMatches = inSiteQuery.trim()
    ? allCardsList.filter(
        (c) =>
          c.title.toLowerCase().includes(inSiteQuery.toLowerCase().trim()) ||
          (c.desc && c.desc.toLowerCase().includes(inSiteQuery.toLowerCase().trim())) ||
          c.url.toLowerCase().includes(inSiteQuery.toLowerCase().trim())
      ).length
    : TOTAL_RESOURCE_COUNT;

  const scrollToFavorites = () => {
    const el = document.getElementById('section-favorites');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Toggle selection for a card in edit mode
  const handleToggleSelectCard = (card: NavCard) => {
    setSelectedCardIds((prev) =>
      prev.includes(card.id) ? prev.filter((id) => id !== card.id) : [...prev, card.id]
    );
  };

  // Toggle edit mode
  const handleToggleEditMode = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      if (!next) setSelectedCardIds([]);
      return next;
    });
  };

  // Select all visible cards
  const handleSelectAllCards = () => {
    const allVisibleIds = [
      ...customCards.map((c) => c.id),
      ...allCardsList.map((c) => c.id)
    ];
    setSelectedCardIds(Array.from(new Set(allVisibleIds)));
    showToast(`已全选 ${allVisibleIds.length} 个资源卡片`);
  };

  // Clear selection
  const handleClearSelection = () => {
    setSelectedCardIds([]);
  };

  // Batch favorite selected cards
  const handleBatchFavorite = (cardIds: string[]) => {
    if (cardIds.length === 0) return;
    const newFavs = Array.from(new Set([...favorites, ...cardIds]));
    const diff = newFavs.length - favorites.length;
    setFavorites(newFavs);
    try {
      localStorage.setItem('user_favorites', JSON.stringify(newFavs));
    } catch {
      // Ignore
    }
    showToast(`已将选中的 ${cardIds.length} 个卡片批量加入收藏夹 (新增 ${diff} 项)`);
    setSelectedCardIds([]);
  };

  // Batch delete or un-favorite selected cards
  const handleBatchDelete = (cardIds: string[]) => {
    if (cardIds.length === 0) return;

    // 1. Remove from customCards if any match
    const remainingCustom = customCards.filter((c) => !cardIds.includes(c.id));
    const customRemoved = customCards.length - remainingCustom.length;
    if (customRemoved > 0) {
      setCustomCards(remainingCustom);
      try {
        localStorage.setItem('user_custom_cards', JSON.stringify(remainingCustom));
      } catch {
        // Ignore
      }
    }

    // 2. Remove from favorites if any match
    const remainingFavs = favorites.filter((id) => !cardIds.includes(id));
    const favsRemoved = favorites.length - remainingFavs.length;
    if (favsRemoved > 0) {
      setFavorites(remainingFavs);
      try {
        localStorage.setItem('user_favorites', JSON.stringify(remainingFavs));
      } catch {
        // Ignore
      }
    }

    const totalRemoved = customRemoved + favsRemoved;
    if (totalRemoved > 0) {
      showToast(`已批量移除 ${totalRemoved} 项（${customRemoved} 个自建网址，${favsRemoved} 个收藏卡片）`);
    } else {
      showToast('已清空对选中卡片的选择');
    }
    setSelectedCardIds([]);
  };

  // Restore backup data
  const handleRestoreData = (data: {
    favorites: string[];
    customCards: NavCard[];
    bgSettings?: BackgroundSettings;
  }) => {
    setFavorites(data.favorites);
    setCustomCards(data.customCards);
    try {
      localStorage.setItem('user_favorites', JSON.stringify(data.favorites));
      localStorage.setItem('user_custom_cards', JSON.stringify(data.customCards));
    } catch {
      // Ignore
    }

    if (data.bgSettings) {
      setBgSettings(data.bgSettings);
      try {
        localStorage.setItem('user_custom_bg', JSON.stringify(data.bgSettings));
      } catch {
        // Ignore
      }
    }
  };

  const hasCustomBg = bgSettings.type !== 'none' && Boolean(bgSettings.value);

  return (
    <div
      className="min-h-screen flex flex-col bg-[var(--iiice-bg)] text-[var(--iiice-title)] selection:bg-blue-600 selection:text-white relative"
      style={
        hasCustomBg
          ? {
              backgroundImage: `url(${bgSettings.value})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }
          : undefined
      }
    >
      {/* Background Blur Overlay for readable text */}
      {hasCustomBg && (
        <div
          className="fixed inset-0 pointer-events-none z-0 transition-all"
          style={{
            backdropFilter: bgSettings.blur > 0 ? `blur(${bgSettings.blur}px)` : undefined,
            backgroundColor: isDark
              ? `rgba(15, 23, 42, ${1 - (bgSettings.opacity ?? 0.85)})`
              : `rgba(248, 250, 252, ${1 - (bgSettings.opacity ?? 0.85)})`
          }}
        />
      )}

      {/* Global Top Progress Bar */}
      <TopProgressBar isLoading={isLoading} />

      {/* Top Notification & Utility Bar */}
      <div className="relative z-10">
        <TopBar
          isDark={isDark}
          onToggleDark={() => setIsDark(!isDark)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenAddCustom={() => setIsAddCustomOpen(true)}
          onOpenCustomBackground={() => setIsBgModalOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
          favoritesCount={favorites.length + customCards.length}
          onScrollToFavorites={scrollToFavorites}
        />

        {/* Main Header with Multi-Search & Hot Tags Cloud */}
        <Header
          inSiteQuery={inSiteQuery}
          onInSiteQueryChange={handleInSiteQueryChange}
          onOpenAbout={() => setIsAboutOpen(true)}
          onOpenCustomBackground={() => setIsBgModalOpen(true)}
          onOpenBackup={() => setIsBackupOpen(true)}
          onShowToast={showToast}
          totalCardsCount={TOTAL_RESOURCE_COUNT}
        />

        {/* Quick Text Links Bar */}
        <QuickLinksBar onCategorySelect={handleCategorySelect} />
      </div>

      {/* Main Content Area */}
      <main
        className="flex-1 w-full max-w-[1320px] mx-auto px-2.5 sm:px-3 py-3 relative z-10"
        style={
          hasCustomBg
            ? {
                backgroundColor: isDark
                  ? `rgba(15, 23, 42, ${bgSettings.opacity})`
                  : `rgba(255, 255, 255, ${bgSettings.opacity})`,
                borderRadius: '16px',
                marginTop: '8px',
                marginBottom: '8px',
                boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)'
              }
            : undefined
        }
      >
        {/* Quick Category Anchors Nav with Edit Mode Switch */}
        {!inSiteQuery && (
          <CategoryNav
            categories={ALL_CATEGORIES}
            activeCategoryId={activeCategoryId}
            onSelectCategory={handleCategorySelect}
            isEditMode={isEditMode}
            onToggleEditMode={handleToggleEditMode}
            selectedCount={selectedCardIds.length}
          />
        )}

        {/* User's Pinned Favorites and Custom Cards */}
        {!inSiteQuery && (
          <FavoritesSection
            favoriteCards={favoriteCards}
            customCards={customCards}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onRemoveCustomCard={handleRemoveCustomCard}
            onCopyUrl={handleCopyUrl}
            onOpenAddCustom={() => setIsAddCustomOpen(true)}
            onCardHoverStart={handleCardHoverStart}
            onCardHoverEnd={handleCardHoverEnd}
            isEditMode={isEditMode}
            selectedCardIds={selectedCardIds}
            onToggleSelectCard={handleToggleSelectCard}
          />
        )}

        {/* Loading Skeleton during Category / Search Transition */}
        {isContentTransitioning ? (
          <div className="py-2">
            <ResourceSkeletonGrid cardCount={16} />
          </div>
        ) : (
          <div className="animate-content-fade-in space-y-3">
            {/* Search Results Summary (if query active) */}
            {inSiteQuery.trim() && (
              <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-xl p-3 text-xs flex items-center justify-between text-blue-900 dark:text-blue-200">
                <span>
                  正在为您实时筛选关键词 <strong>"{inSiteQuery}"</strong>，共找到 <strong>{totalMatches}</strong> 个匹配资源
                </span>
                <button
                  type="button"
                  onClick={() => handleInSiteQueryChange('')}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium cursor-pointer"
                >
                  清空搜索
                </button>
              </div>
            )}

            {/* If no match found */}
            {inSiteQuery.trim() && totalMatches === 0 && (
              <div className="bg-[var(--section-bg)] border border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-12 text-center my-6">
                <SearchX className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-semibold text-slate-700 dark:text-slate-200">
                  未找到与 "{inSiteQuery}" 相关的资源
                </h3>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  您可以切换上方为“外部搜索”前往搜索引擎查找，或添加自建网站。
                </p>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleInSiteQueryChange('')}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                  >
                    重置查看所有分类
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddCustomOpen(true)}
                    className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
                  >
                    直接添加此网站
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Categories */}
            {ALL_CATEGORIES.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                inSiteQuery={inSiteQuery}
                favorites={favorites}
                onToggleFavorite={handleToggleFavorite}
                onCopyUrl={handleCopyUrl}
                onCardHoverStart={handleCardHoverStart}
                onCardHoverEnd={handleCardHoverEnd}
                isEditMode={isEditMode}
                selectedCardIds={selectedCardIds}
                onToggleSelectCard={handleToggleSelectCard}
              />
            ))}
          </div>
        )}
      </main>

      {/* Hover Preview Tooltip Modal (When hovering for > 1s) */}
      <CardPreviewModal
        card={hoveredCard}
        position={previewPosition}
        isFavorite={hoveredCard ? favorites.includes(hoveredCard.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onCopyUrl={handleCopyUrl}
      />

      {/* Footer */}
      <Footer />

      {/* Floating Back to Top Button */}
      <BackToTop />

      {/* Batch Action Toolbar when in Edit Mode */}
      <BatchActionToolbar
        isEditMode={isEditMode}
        selectedCardIds={selectedCardIds}
        allVisibleCards={allCardsList}
        onSelectAll={handleSelectAllCards}
        onClearSelection={handleClearSelection}
        onBatchFavorite={handleBatchFavorite}
        onBatchDelete={handleBatchDelete}
        onExitEditMode={() => {
          setIsEditMode(false);
          setSelectedCardIds([]);
        }}
      />

      {/* Data Backup and Restore Modal */}
      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        favorites={favorites}
        customCards={customCards}
        bgSettings={bgSettings}
        onRestore={handleRestoreData}
        onShowToast={showToast}
      />

      {/* Modals */}
      <AddCustomModal
        isOpen={isAddCustomOpen}
        onClose={() => setIsAddCustomOpen(false)}
        onAdd={handleAddCustomCard}
      />

      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        onShowToast={showToast}
      />

      {/* Custom Background Settings Modal */}
      <CustomBackgroundModal
        isOpen={isBgModalOpen}
        onClose={() => setIsBgModalOpen(false)}
        currentSettings={bgSettings}
        onSaveSettings={handleSaveBgSettings}
      />

      {/* Core Socialist Values Floating Word Click Effect */}
      <ClickEffectManager />

      {/* Toast Notification */}
      <Toast message={toastMessage} />
    </div>
  );
}
