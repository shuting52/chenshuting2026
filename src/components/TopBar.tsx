import React, { useState, useEffect } from 'react';
import { Sun, Moon, Info, PlusCircle, Bookmark, Palette, HardDriveDownload } from 'lucide-react';

interface TopBarProps {
  isDark: boolean;
  onToggleDark: () => void;
  onOpenAbout: () => void;
  onOpenAddCustom: () => void;
  onOpenCustomBackground?: () => void;
  onOpenBackup?: () => void;
  favoritesCount: number;
  onScrollToFavorites: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isDark,
  onToggleDark,
  onOpenAbout,
  onOpenAddCustom,
  onOpenCustomBackground,
  onOpenBackup,
  favoritesCount,
  onScrollToFavorites
}) => {
  const [dateStr, setDateStr] = useState('');
  const [weekdayStr, setWeekdayStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const pad = (n: number) => (n < 10 ? '0' + n : n);
      setDateStr(`${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`);
      const weeks = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
      setWeekdayStr(weeks[now.getDay()]);
    };

    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div id="topbar" className="w-full bg-[#0f3460] text-white text-xs select-none">
      <div className="max-w-[1320px] mx-auto h-9 px-3 flex items-center justify-between gap-2 overflow-x-auto">
        {/* Left Notice with Marquee Animation */}
        <div className="flex items-center gap-2 shrink-0 text-slate-100 font-medium overflow-hidden max-w-[280px] sm:max-w-[420px]">
          <span className="text-amber-300 shrink-0">🌙</span>
          <span className="font-semibold shrink-0 text-blue-200">陈淑婷</span>
          <span className="text-slate-400 shrink-0">·</span>
          <div className="relative overflow-hidden w-48 sm:w-64 h-5 flex items-center">
            <div className="animate-netland-marquee flex items-center gap-6">
              <span className="text-amber-300 font-medium tracking-wide">✨ 白嫖怪的互联网净土 · 站内所有资源免费直达 ✨</span>
              <span className="text-amber-300 font-medium tracking-wide">✨ 白嫖怪的互联网净土 · 站内所有资源免费直达 ✨</span>
            </div>
          </div>
        </div>

        {/* Right Nav & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 text-slate-200">
          <button
            type="button"
            onClick={onOpenAddCustom}
            className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer py-1"
            title="添加您自己的常用网站"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">自定义添加</span>
          </button>

          {favoritesCount > 0 && (
            <>
              <span className="w-px h-3 bg-white/30" />
              <button
                type="button"
                onClick={onScrollToFavorites}
                className="flex items-center gap-1 text-amber-300 hover:text-amber-200 transition-colors cursor-pointer py-1"
                title="查看我的收藏夹"
              >
                <Bookmark className="w-3.5 h-3.5 fill-amber-300" />
                <span>我的收藏({favoritesCount})</span>
              </button>
            </>
          )}

          {/* Data Backup Button */}
          {onOpenBackup && (
            <>
              <span className="w-px h-3 bg-white/30" />
              <button
                type="button"
                onClick={onOpenBackup}
                className="flex items-center gap-1 text-blue-300 hover:text-blue-200 transition-colors cursor-pointer py-1"
                title="备份与恢复个人收藏及配置数据"
              >
                <HardDriveDownload className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">数据备份</span>
              </button>
            </>
          )}

          <span className="w-px h-3 bg-white/30" />
          {onOpenCustomBackground && (
            <>
              <button
                type="button"
                onClick={onOpenCustomBackground}
                className="flex items-center gap-1 text-emerald-300 hover:text-emerald-200 transition-colors cursor-pointer py-1"
                title="设置个性化背景（高清壁纸 / 摄像头拍照 / 图片上传）"
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">自定义背景</span>
              </button>
              <span className="w-px h-3 bg-white/30" />
            </>
          )}
          <button
            type="button"
            onClick={onOpenAbout}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer py-1"
          >
            <Info className="w-3.5 h-3.5" />
            <span>关于本站</span>
          </button>

          <span className="w-px h-3 bg-white/30" />
          <a
            href="#section-game"
            className="hover:text-white transition-colors py-1 hidden md:inline-block"
          >
            游戏中心
          </a>

          <span className="w-px h-3 bg-white/30 hidden md:inline-block" />
          <a
            href="#section-tool"
            className="hover:text-white transition-colors py-1 hidden md:inline-block"
          >
            AI集合站
          </a>

          <span className="w-px h-3 bg-white/30" />
          {/* Dark mode toggle */}
          <button
            type="button"
            id="darkmodeToggle"
            onClick={onToggleDark}
            className="w-6 h-6 flex items-center justify-center rounded hover:bg-white/10 text-white hover:text-amber-300 transition-transform active:scale-95 cursor-pointer"
            title={isDark ? '切换至浅色模式' : '切换至夜间模式'}
            aria-label="切换夜间模式"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4" />
            )}
          </button>

          <span className="w-px h-3 bg-white/30 hidden sm:inline-block" />
          <span className="hidden sm:inline-block font-mono text-[11px] text-slate-300">
            {dateStr}
          </span>
          <span className="w-px h-3 bg-white/30 hidden sm:inline-block" />
          <span className="hidden sm:inline-block text-[11px] text-slate-300">
            {weekdayStr}
          </span>
        </div>
      </div>
    </div>
  );
};
