import React from 'react';
import { Folder } from 'lucide-react';
import { CategoryDto } from '../types/api';

interface CategoryBadgeProps {
  category: CategoryDto;
  onClick?: () => void;
  selected?: boolean;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, onClick, selected }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
        selected
          ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
          : 'bg-slate-800/80 hover:bg-slate-700/80 text-brand-300 border border-slate-700/60'
      }`}
    >
      <Folder className="w-3.5 h-3.5" />
      <span>{category.name}</span>
      {category.postCount !== undefined && (
        <span className="ml-1 px-1.5 py-0.2 rounded-full bg-slate-900/60 text-[10px] text-slate-400 font-semibold">
          {category.postCount}
        </span>
      )}
    </button>
  );
};
