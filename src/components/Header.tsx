import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, UserCheck, X, Sparkles, Filter, Settings, HardDriveDownload } from 'lucide-react';
import { SEARCH_ENGINES } from '../data/searchEngines';
import { SearchEngine } from '../types';
import { HotSearchTags } from './HotSearchTags';
import { SearchHistoryDropdown } from './SearchHistoryDropdown';
import { VoiceSearchButton } from './VoiceSearchButton';
import { NewsMarquee, NewsHeadline } from './NewsMarquee';
import { NewsDetailModal } from './NewsDetailModal';
import { TechNewsItem } from '../data/staticAiNews';
import { SearchSuggestionsDropdown, SearchSuggestionItem } from './SearchSuggestionsDropdown';
import { ALL_CATEGORIES } from '../data/navData';
import {
  getSearchHistory,
  addSearchHistory,
  clearSearchHistory,
  removeSearchHistoryItem,
  getDynamicHotKeywords,
  recordKeywordHit
} from '../utils/hotKeywords';

interface HeaderProps {
  inSiteQuery: string;
  onInSiteQueryChange: (q: string) => void;
  onOpenAbout: () => void;
  onOpenCustomBackground?: () => void;
  onOpenBackup?: () => void;
  onShowToast?: (msg: string) => void;
  totalCardsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  inSiteQuery,
  onInSiteQueryChange,
  onOpenAbout,
  onOpenCustomBackground,
  onOpenBackup,
  onShowToast = () => {},
  totalCardsCount
}) => {
  const [selectedEngine, setSelectedEngine] = useState<SearchEngine>(SEARCH_ENGINES[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [engineKeyword, setEngineKeyword] = useState('');
  const [searchMode, setSearchMode] = useState<'engine' | 'inSite'>('engine');
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [selectedNewsForDetail, setSelectedNewsForDetail] = useState<TechNewsItem | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Search history state (top 5)
  const [searchHistory, setSearchHistory] = useState<string[]>(() => getSearchHistory());
  const [historyOpen, setHistoryOpen] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);

  // Dynamic hot search tags
  const [hotKeywords, setHotKeywords] = useState<{ name: string; tag?: string; count: number }[]>(
    () => getDynamicHotKeywords()
  );

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
        setHistoryOpen(false);
        setSuggestionsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleExternalSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (searchMode === 'inSite') {
      if (inSiteQuery.trim()) {
        const updated = addSearchHistory(inSiteQuery.trim());
        setSearchHistory(updated);
        setHotKeywords(getDynamicHotKeywords());
        setHistoryOpen(false);
        setSuggestionsOpen(false);
      }
      return;
    }

    if (!engineKeyword.trim()) return;
    const kw = engineKeyword.trim();
    // Record to history and stats
    const updated = addSearchHistory(kw);
    setSearchHistory(updated);
    setHotKeywords(getDynamicHotKeywords());
    setHistoryOpen(false);
    setSuggestionsOpen(false);

    const targetUrl = selectedEngine.url + encodeURIComponent(kw);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClearInSite = () => {
    onInSiteQueryChange('');
    setSuggestionsOpen(false);
  };

  // Hot search tag click handler: triggers filter instantly
  const handleSelectHotKeyword = (kw: string) => {
    recordKeywordHit(kw, 3);
    setHotKeywords(getDynamicHotKeywords());
    const updated = addSearchHistory(kw);
    setSearchHistory(updated);
    setHistoryOpen(false);
    setSuggestionsOpen(false);

    // If currently in external engine mode, switch to inSite so user sees filtered resources immediately
    if (searchMode === 'engine') {
      setSearchMode('inSite');
    }
    onInSiteQueryChange(kw);
  };

  // History item select handler
  const handleSelectHistoryItem = (kw: string) => {
    setHistoryOpen(false);
    setSuggestionsOpen(false);
    if (searchMode === 'engine') {
      setEngineKeyword(kw);
      setSearchMode('inSite');
    }
    onInSiteQueryChange(kw);
    const updated = addSearchHistory(kw);
    setSearchHistory(updated);
  };

  const handleDeleteHistoryItem = (kw: string) => {
    const updated = removeSearchHistoryItem(kw);
    setSearchHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
    setHistoryOpen(false);
    setSuggestionsOpen(false);
  };

  // Voice speech recognition result handler
  const handleVoiceResult = (spokenText: string) => {
    if (!spokenText) return;
    if (searchMode === 'engine') {
      setEngineKeyword(spokenText);
      setSearchMode('inSite');
    }
    onInSiteQueryChange(spokenText);
    const updated = addSearchHistory(spokenText);
    setSearchHistory(updated);
    recordKeywordHit(spokenText, 2);
    setHotKeywords(getDynamicHotKeywords());
  };

  // News marquee headline click handler
  const handleSelectNews = (news: NewsHeadline) => {
    const query = news.query || news.title;
    setSearchMode('inSite');
    onInSiteQueryChange(query);
    const updated = addSearchHistory(query);
    setSearchHistory(updated);
    recordKeywordHit(query, 2);
    setHotKeywords(getDynamicHotKeywords());
  };

  // Current query for search suggestions
  const currentQuery = searchMode === 'engine' ? engineKeyword : inSiteQuery;

  const handleSelectSuggestion = (suggestion: SearchSuggestionItem) => {
    setSuggestionsOpen(false);
    setHistoryOpen(false);

    if (suggestion.type === 'category') {
      setSearchMode('inSite');
      onInSiteQueryChange('');
      const el = document.getElementById(`section-${suggestion.id}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else if (suggestion.card) {
      setSearchMode('inSite');
      onInSiteQueryChange(suggestion.card.title);
      recordKeywordHit(suggestion.card.title, 2);
      const updated = addSearchHistory(suggestion.card.title);
      setSearchHistory(updated);
      setHotKeywords(getDynamicHotKeywords());

      setTimeout(() => {
        const cardEl = document.querySelector(`[data-card-id="${suggestion.card?.id}"]`);
        if (cardEl) {
          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 200);
    }
  };

  return (
    <header className="w-full bg-[var(--iiice-white)] border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-[1320px] min-h-[105px] mx-auto px-3 py-3 flex items-center justify-between gap-4 flex-wrap">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-[240px]">
          <a
            href="/"
            className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 bg-gradient-to-br from-[#0f3460] to-[#2563eb] text-white text-2xl font-bold tracking-wider shadow-lg shadow-blue-900/20 hover:scale-105 hover:shadow-xl transition-all cursor-pointer"
            title="陈淑婷 · 资源收藏导航"
          >
            陈淑婷
          </a>
          <div className="leading-tight">
            <h1 className="text-xl font-bold text-[var(--iiice-title)] flex items-center gap-1.5">
              <a href="/" className="hover:text-blue-600 transition-colors">陈淑婷</a>
              <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
                导航站
              </span>
            </h1>
            
            {/* Marquee Banner for 白嫖怪的互联网净土 */}
            <div className="relative overflow-hidden w-44 sm:w-52 h-5 mt-1 rounded-md bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 flex items-center px-1">
              <div className="animate-netland-marquee flex items-center gap-4 text-[11px] font-semibold text-amber-700 dark:text-amber-300">
                <span>✨ 白嫖怪的互联网净土 · 资源免费下载 ✨</span>
                <span>✨ 白嫖怪的互联网净土 · 资源免费下载 ✨</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">站内所有收集的资源都能免费下载 ({totalCardsCount}+精选)</p>
          </div>
        </div>

        {/* Search Engine & In-site Search Bar */}
        <div className="flex-1 min-w-[280px] max-w-[540px]" ref={dropdownRef}>
          <div className="relative p-1.5 sm:p-2 rounded-xl bg-[var(--search-bg)] border-2 border-transparent search-glow transition-all">
            {/* Mode Switcher */}
            <div className="flex items-center justify-between mb-1.5 px-1 text-xs">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('engine');
                    setSuggestionsOpen(false);
                  }}
                  className={`px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                    searchMode === 'engine'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  外部搜索
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSearchMode('inSite');
                    setSuggestionsOpen(false);
                  }}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md font-medium transition-colors cursor-pointer ${
                    searchMode === 'inSite'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                  }`}
                >
                  <Filter className="w-3 h-3" />
                  站内直达
                  {inSiteQuery && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  )}
                </button>
              </div>

              {searchMode === 'inSite' && inSiteQuery && (
                <button
                  type="button"
                  onClick={handleClearInSite}
                  className="text-slate-400 hover:text-red-500 text-[11px] flex items-center gap-0.5 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  清除筛选
                </button>
              )}
            </div>

            {searchMode === 'engine' ? (
              /* External Search Engine Form */
              <form onSubmit={handleExternalSearch} className="h-9 bg-[var(--search-input-bg)] rounded-lg flex items-center gap-1 border border-[var(--iiice-border)] overflow-hidden relative">
                <button
                  type="button"
                  onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setHistoryOpen(false);
                    setSuggestionsOpen(false);
                  }}
                  className="h-full flex items-center gap-1 px-2.5 bg-slate-50 dark:bg-slate-800/60 border-r border-[var(--iiice-border)] text-xs text-[var(--iiice-title)] font-medium hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer shrink-0 transition-colors"
                >
                  <span>{selectedEngine.name}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                <input
                  type="text"
                  value={engineKeyword}
                  onFocus={() => {
                    if (engineKeyword.trim()) {
                      setSuggestionsOpen(true);
                      setHistoryOpen(false);
                    } else if (searchHistory.length > 0) {
                      setHistoryOpen(true);
                    }
                    setDropdownOpen(false);
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEngineKeyword(val);
                    if (val.trim()) {
                      setSuggestionsOpen(true);
                      setHistoryOpen(false);
                    } else {
                      setSuggestionsOpen(false);
                      if (searchHistory.length > 0) setHistoryOpen(true);
                    }
                  }}
                  placeholder={selectedEngine.placeholder || '输入关键词，回车搜索...'}
                  className="flex-1 h-full px-2.5 text-xs text-[var(--iiice-title)] bg-transparent border-0 outline-none"
                />

                <VoiceSearchButton
                  onResult={handleVoiceResult}
                  onListeningChange={setIsVoiceListening}
                />

                <button
                  type="submit"
                  className="h-7 px-3 mr-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer shrink-0 shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>搜</span>
                </button>
              </form>
            ) : (
              /* Instant In-site Filter Input */
              <div className="h-9 bg-[var(--search-input-bg)] rounded-lg flex items-center gap-1 border border-emerald-500/50 overflow-hidden relative">
                <div className="px-2.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1 shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                  <span>全站筛选</span>
                </div>

                <input
                  type="text"
                  value={inSiteQuery}
                  onFocus={() => {
                    if (inSiteQuery.trim()) {
                      setSuggestionsOpen(true);
                      setHistoryOpen(false);
                    } else if (searchHistory.length > 0) {
                      setHistoryOpen(true);
                    }
                    setDropdownOpen(false);
                  }}
                  onChange={(e) => {
                    const val = e.target.value;
                    onInSiteQueryChange(val);
                    if (val.trim()) {
                      setSuggestionsOpen(true);
                      setHistoryOpen(false);
                      recordKeywordHit(val.trim(), 1);
                      setHotKeywords(getDynamicHotKeywords());
                    } else {
                      setSuggestionsOpen(false);
                      if (searchHistory.length > 0) setHistoryOpen(true);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && inSiteQuery.trim()) {
                      const updated = addSearchHistory(inSiteQuery.trim());
                      setSearchHistory(updated);
                      setHotKeywords(getDynamicHotKeywords());
                      setHistoryOpen(false);
                      setSuggestionsOpen(false);
                    }
                  }}
                  placeholder={
                    isVoiceListening
                      ? '正在倾听语音中，请说出网站或关键词...'
                      : '即时过滤影视、工具、网站、游戏等名称...'
                  }
                  className="flex-1 h-full px-2 text-xs text-[var(--iiice-title)] bg-transparent border-0 outline-none"
                  autoFocus
                />

                {inSiteQuery && (
                  <button
                    type="button"
                    onClick={handleClearInSite}
                    className="p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                <VoiceSearchButton
                  onResult={handleVoiceResult}
                  onListeningChange={setIsVoiceListening}
                />
              </div>
            )}

            {/* Real-time Search Suggestions Dropdown */}
            <SearchSuggestionsDropdown
              query={currentQuery}
              categories={ALL_CATEGORIES}
              isOpen={suggestionsOpen}
              onSelectSuggestion={handleSelectSuggestion}
              onClose={() => setSuggestionsOpen(false)}
            />

            {/* Recent 5 Search History Dropdown */}
            <SearchHistoryDropdown
              history={searchHistory}
              isOpen={historyOpen && !suggestionsOpen}
              onSelectKeyword={handleSelectHistoryItem}
              onDeleteItem={handleDeleteHistoryItem}
              onClearAll={handleClearAllHistory}
              onClose={() => setHistoryOpen(false)}
            />

            {/* Engine Selection Dropdown */}
            {dropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 z-40 bg-[var(--iiice-white)] border border-[var(--iiice-border)] rounded-xl p-2 shadow-2xl shadow-black/15">
                <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-1 px-1">选择搜索引擎：</div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                  {SEARCH_ENGINES.map((engine) => (
                    <button
                      key={engine.id}
                      type="button"
                      onClick={() => {
                        setSelectedEngine(engine);
                        setDropdownOpen(false);
                      }}
                      className={`h-8 px-2 rounded-lg text-xs flex items-center justify-center font-medium transition-all cursor-pointer ${
                        selectedEngine.id === engine.id
                          ? 'bg-blue-600 text-white font-semibold'
                          : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-700'
                      }`}
                    >
                      {engine.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular Hot Search Tag Cloud */}
            <HotSearchTags
              hotKeywords={hotKeywords}
              onSelectKeyword={handleSelectHotKeyword}
              activeKeyword={inSiteQuery}
            />

            {/* Real-time Google Search Tech Headlines Marquee */}
            <NewsMarquee
              onSelectNews={handleSelectNews}
              onOpenDetail={(news) => setSelectedNewsForDetail(news)}
            />
          </div>
        </div>

        {/* Action buttons (快捷入口 and 交流群 removed, replaced with 数据备份 & 关于我们) */}
        <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-300">
          {onOpenBackup && (
            <button
              type="button"
              onClick={onOpenBackup}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              title="一键备份与恢复个人收藏及配置数据"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-blue-100 dark:group-hover:bg-slate-700 transition-all">
                <HardDriveDownload className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-medium">数据备份</span>
            </button>
          )}

          {onOpenCustomBackground && (
            <button
              type="button"
              onClick={onOpenCustomBackground}
              className="flex flex-col items-center gap-1 group cursor-pointer"
              title="个性化自定义背景设置（壁纸 / 摄像头拍照 / 图片上传）"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-indigo-100 dark:group-hover:bg-slate-700 transition-all">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-[11px]">自定义背景</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenAbout}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title="关于陈淑婷与本站介绍"
          >
            <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 group-hover:bg-amber-100 dark:group-hover:bg-slate-700 transition-all">
              <UserCheck className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-medium">关于我们</span>
          </button>
        </div>
      </div>

      {/* AI Tech News Detail & Deep Search Modal */}
      <NewsDetailModal
        isOpen={Boolean(selectedNewsForDetail)}
        onClose={() => setSelectedNewsForDetail(null)}
        news={selectedNewsForDetail}
        onSearchInSite={(query) => {
          setSearchMode('inSite');
          onInSiteQueryChange(query);
          const updated = addSearchHistory(query);
          setSearchHistory(updated);
          recordKeywordHit(query, 2);
          setHotKeywords(getDynamicHotKeywords());
        }}
        onShowToast={onShowToast}
      />
    </header>
  );
};
