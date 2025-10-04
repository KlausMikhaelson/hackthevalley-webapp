'use client';

import { useState } from 'react';
import {
  Dashboard as DashboardIcon,
  AttachMoney as AttachMoneyIcon,
  TrackChanges as GoalsIcon,
  Analytics as AnalyticsIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({ activeTab, onTabChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', IconComponent: DashboardIcon },
    { id: 'spending', label: 'Spending', IconComponent: AttachMoneyIcon },
    { id: 'goals', label: 'Goals', IconComponent: GoalsIcon },
    { id: 'analytics', label: 'Analytics', IconComponent: AnalyticsIcon },
    { id: 'settings', label: 'Settings', IconComponent: SettingsIcon },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-[var(--sidebar-bg)] min-h-screen flex flex-col transition-all duration-300 ease-in-out`}>
      {/* Logo */}
      <div className={`${isCollapsed ? 'p-4' : 'p-6'} border-b border-[var(--border-color)] relative`}>
        {!isCollapsed && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-[var(--foreground)]">FINANCE DASH</h1>
                <p className="text-xs text-[var(--text-secondary)] mt-1">Personal Finance Tracker</p>
              </div>
              {/* Toggle Button - expanded state */}
              <button
                onClick={onToggleCollapse}
                className="btn-gradient text-white rounded-lg p-2 shadow-lg"
                aria-label="Collapse sidebar"
              >
                <svg 
                  className="w-4 h-4 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>
          </>
        )}
        
        {isCollapsed && (
          <div className="text-center">
            {/* Toggle Button - collapsed state */}
            <button
              onClick={onToggleCollapse}
              className="btn-gradient text-white rounded-lg p-2 shadow-lg mx-auto"
              aria-label="Expand sidebar"
            >
              <svg 
                className="w-4 h-4 transition-transform duration-200 rotate-180" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'px-4'} py-3 rounded-lg text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-[var(--text-secondary)] hover:text-[var(--foreground)] hover:bg-[var(--card-bg)]'
                }`}
                title={isCollapsed ? item.label : undefined}
              >
                <item.IconComponent sx={{ fontSize: 20 }} className="flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium ml-3 whitespace-nowrap">{item.label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
