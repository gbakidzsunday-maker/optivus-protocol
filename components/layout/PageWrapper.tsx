
import React from 'react';
import { Link } from 'react-router-dom';

interface PageWrapperProps {
  title: string;
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ title, children }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="text-brand-secondary hover:text-brand-primary mb-4 inline-block">&larr; Back to Home</Link>
        <h1 className="text-4xl font-extrabold text-brand-white mb-8">{title}</h1>
        <div className="space-y-6 prose prose-invert prose-lg max-w-none prose-h2:text-brand-white prose-h2:border-b prose-h2:border-brand-ui-element prose-h2:pb-2 prose-a:text-brand-secondary hover:prose-a:text-brand-primary prose-ul:list-disc prose-ul:ml-6">
            {children}
        </div>
      </div>
    </div>
  );
};