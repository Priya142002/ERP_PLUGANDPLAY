import React from 'react';
import Icon from '../../components/ui/Icon';

interface PageTemplateProps {
  title: string;
  description?: string;
  icon?: string;
  children?: React.ReactNode;
}

export const PageTemplate: React.FC<PageTemplateProps> = ({ title, description, icon = 'layout', children }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
          {description && <p className="text-slate-500 mt-1">{description}</p>}
        </div>
        <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
          <Icon name={icon} className="text-[#002147]" size="md" />
        </div>
      </div>

      {children ? (
        children
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name={icon} size="lg" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mb-2">{title} Management</h2>
            <p className="text-slate-500 max-w-md mx-auto">
              This module is part of the Admin panel. Detailed UI components and functionality for {title.toLowerCase()} will be added here.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                <Icon name="plus" size="sm" className="mr-2" />
                Add New {title}
              </button>
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center">
                <Icon name="link" size="sm" className="mr-2" />
                Export Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
