import React from 'react';
import { Category } from '../types';
import { CheckSquare } from 'lucide-react';

interface CategoryNavProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory: (id: string) => void;
  isEditMode?: boolean;
  onToggleEditMode?: () => void;
  selectedCount?: number;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  categories,
  activeCategoryId,
  onSelectCategory,
  isEditMode = false,
  onToggleEditMode,
  selectedCount = 0
}) => {
  const scrollToSection = (id: string) => {
    onSelectCategory(id);
    const el = document.getElementById(`section-${id}`);
    if (el) {
      const topOffset = el.getBoundingClientRect().top + window.pageYOffset - 12;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-[var(--section-bg)] border border-slate-200/80 dark:border-slate-800 rounded-xl p-2 mb-3 shadow-xs flex items-center justify-between gap-2">
      <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap text-xs flex-1 min-w-0 py-0.5">
        <span className="text-slate-400 font-medium px-2 shrink-0">快速直达：</span>
        {categories.map((cat) => {
          const isActive = activeCategoryId === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => scrollToSection(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700 hover:text-blue-600'
              }`}
            >
              {cat.name}
              <span className="ml-1 text-[10px] opacity-70">({cat.cards.length})</span>
            </button>
          );
        })}
      </div>

      {/* Edit Mode Toggle Switch */}
      {onToggleEditMode && (
        <button
          type="button"
          onClick={onToggleEditMode}
          className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
            isEditMode
              ? 'bg-blue-600 text-white border-blue-600 shadow-xs ring-2 ring-blue-400/30'
              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-blue-600'
          }`}
          title={isEditMode ? '退出批量管理编辑模式' : '开启卡片批量编辑模式（勾选卡片并批量收藏或删除）'}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>{isEditMode ? '退出编辑' : '编辑模式'}</span>
          {isEditMode && selectedCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-bold">
              {selectedCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
};
