import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-brand-panel backdrop-blur-lg border border-brand-ui-element/20 p-4 sm:p-6 rounded-lg shadow-lg flex flex-col sm:flex-row items-center text-center sm:text-left sm:space-x-4">
      <div className="bg-brand-dark p-3 rounded-full mb-3 sm:mb-0 flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm text-brand-light-gray">{title}</p>
        <p className="text-2xl font-bold text-brand-white">{value}</p>
      </div>
    </div>
  );
};