"use client";

import { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

export function Tabs({ tabs }: TabsProps) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="w-full">
      <div className="px-6 pt-4">
        <nav className="flex space-x-2" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-2.5 px-4 rounded-xl font-medium text-sm transition-all
                ${
                  activeTab === tab.id
                    ? 'bg-purple-500 text-white shadow-sm'
                    : 'text-gray-400 hover:bg-gray-700/50'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-6 text-gray-300">
        {tabs.find(tab => tab.id === activeTab)?.content}
      </div>
    </div>
  );
}
