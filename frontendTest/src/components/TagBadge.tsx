import React from 'react';
import { Tag } from 'lucide-react';
import { TagDto } from '../types/api';

interface TagBadgeProps {
  tag: TagDto;
  onClick?: () => void;
  selected?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, onClick, selected }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium transition-all ${
        selected
          ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
          : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
      }`}
    >
      <Tag className="w-3 h-3 text-indigo-400" />
      <span>#{tag.name}</span>
    </button>
  );
};
