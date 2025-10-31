/**
 * TabbedPanel - Reusable tabbed interface component
 * Following design principles: Single responsibility, reusable, Apple-grade polish
 * 
 * Responsibility: Provide tabbed navigation pattern for right sidebar
 * Reusable for any multi-panel interface needs
 */
import { ReactNode, useState } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: string;
  content: ReactNode;
}

interface TabbedPanelProps {
  tabs: Tab[];
  defaultTab?: string;
}

export function TabbedPanel({ tabs, defaultTab }: TabbedPanelProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 bg-gray-800/50">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              role="tab"
              aria-selected={isActive}
              aria-controls={`${tab.id}-panel`}
              className={`
                flex-1 px-4 py-3 text-sm font-medium transition-all duration-150
                ${
                  isActive
                    ? 'text-blue-400 border-b-2 border-blue-500 bg-gray-800'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                }
              `}
            >
              {tab.icon && <span className="mr-2">{tab.icon}</span>}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div 
        role="tabpanel" 
        id={`${activeTab}-panel`}
        aria-labelledby={activeTab}
        className="flex-1 overflow-y-auto"
      >
        {activeContent}
      </div>
    </div>
  );
}

