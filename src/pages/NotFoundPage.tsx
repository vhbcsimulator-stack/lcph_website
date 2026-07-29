import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center container-custom py-16 text-center">
      <div className="max-w-[448px] space-y-4">
        <h1 className="font-headline-xl text-6xl text-primary font-bold">404</h1>
        <h2 className="font-headline-sm text-xl text-on-surface font-bold">Page Not Found</h2>
        <p className="text-body-sm text-body-sm text-on-surface-variant">The page or lot listing you are looking for might have been moved or updated.</p>
        <div className="pt-4 flex justify-center gap-3">
          <Link to="/" className="px-6 py-3 bg-primary text-on-primary font-label-lg text-label-lg rounded flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
