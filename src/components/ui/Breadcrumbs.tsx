import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { EditableText } from '../admin/EditableText';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="py-3 text-xs font-medium text-slate-500">
      <ol className="flex items-center flex-wrap gap-1.5">
        <li>
          <Link to="/" className="hover:text-lcph-primary flex items-center gap-1 transition-colors">
            <Home className="w-3.5 h-3.5 text-slate-400" />
            <EditableText contentKey="breadcrumb_home" value="Home" tag="span" inline />
          </Link>
        </li>
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-1.5">
            <ChevronRight className="w-3 h-3 text-slate-400" />
            {item.path ? (
              <Link to={item.path} className="hover:text-lcph-primary transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-lcph-primary font-semibold">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};
