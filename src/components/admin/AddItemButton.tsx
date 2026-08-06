import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus } from 'lucide-react';

interface AddItemButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

/** Admin-only "add a new entry" affordance used by the news and gallery grids. */
export const AddItemButton: React.FC<AddItemButtonProps> = ({ label, onClick, className = '' }) => {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm transition-colors hover:bg-emerald-500 cursor-pointer ${className}`}
    >
      <Plus className="w-4 h-4" />
      {label}
    </button>
  );
};

interface DeleteItemButtonProps {
  onClick: () => void;
  title: string;
  className?: string;
}

/** Admin-only delete affordance; appears on hover over the card it belongs to. */
export const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ onClick, title, className = '' }) => {
  const { isAdmin } = useAdmin();
  if (!isAdmin) return null;

  return (
    <button
      type="button"
      title={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onClick();
      }}
      className={`absolute right-3 top-3 z-40 cursor-pointer rounded-full bg-red-600 p-2 text-white opacity-0 shadow-md transition-opacity duration-200 hover:bg-red-500 group-hover:opacity-100 ${className}`}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
        <path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a1 1 0 01-1 1H7a1 1 0 01-1-1V6" />
      </svg>
    </button>
  );
};
