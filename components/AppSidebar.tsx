'use client';

import React from 'react';
import type { NavItem } from '@/types/claimtrail';

interface AppSidebarProps {
  currentNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  onOpenSettings?: () => void;
  onImportBatch?: () => void;
}

interface SidebarNavItem {
  id: NavItem;
  label: string;
  icon: string;
  badge?: string;
  badgeColor?: 'copper' | 'neutral';
}

const NAV_ITEMS: SidebarNavItem[] = [
  { id: 'overview', label: 'Overview', icon: 'dashboard' },
  { id: 'questionnaire', label: 'Questionnaire', icon: 'quiz', badge: '38', badgeColor: 'neutral' },
  { id: 'sources', label: 'Evidence Sources', icon: 'folder_open', badge: '3', badgeColor: 'neutral' },
  { id: 'findings', label: 'Findings', icon: 'verified_user', badge: '3', badgeColor: 'copper' },
  { id: 'exports', label: 'Exports', icon: 'file_upload' },
];

export function AppSidebar({
  currentNav,
  onNavChange,
  onOpenSettings,
  onImportBatch,
}: AppSidebarProps) {
  // Normalize legacy NavItem states if any
  const activeId =
    currentNav === 'review' || currentNav === 'questions'
      ? 'questionnaire'
      : currentNav === 'evidence'
      ? 'sources'
      : currentNav;

  return (
    <aside className="w-60 shrink-0 h-screen bg-surface-container-lowest border-r border-surface-container-highest flex flex-col justify-between p-4 select-none z-30">
      {/* Top Brand & Main Nav */}
      <div className="flex flex-col gap-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container-high">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-on-surface flex items-center justify-center text-surface-container-lowest font-headline-sm font-bold tracking-tight shadow-sm">
              <span>CT</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-headline-sm font-headline-sm font-bold text-on-surface tracking-tight leading-none">
                  ClaimTrail
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9.5px] font-code-sm text-secondary bg-surface-container-low border border-surface-container-highest">
                  v2.4
                </span>
              </div>
              <span className="text-label-sm font-label-sm text-secondary leading-tight mt-0.5">
                Enterprise Audit Engine
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary hover:text-on-surface cursor-pointer text-base">
            swap_vert
          </span>
        </div>

        {/* Import Batch CTA Button */}
        <button
          onClick={onImportBatch || (() => onNavChange('questionnaire'))}
          className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-surface-container-low hover:bg-surface-container text-on-surface font-label-md text-label-md rounded-lg border border-surface-container-high transition-colors shadow-xs"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            upload_file
          </span>
          <span>Import Batch</span>
        </button>

        {/* Primary Navigation Tabs */}
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                className={`flex items-center justify-between w-full px-3 py-2 font-label-md text-label-md rounded-lg transition-colors text-left ${
                  isActive
                    ? 'text-on-surface bg-surface-container-low font-semibold border border-surface-container-high shadow-xs'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[18px] ${
                      isActive ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-code-sm text-code-sm px-1.5 py-0.2 rounded ${
                      item.badgeColor === 'copper'
                        ? 'bg-primary-container text-on-primary font-semibold'
                        : isActive
                        ? 'bg-surface-container-lowest text-on-surface border border-surface-container-high'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex flex-col gap-1 pt-4 border-t border-surface-container-high">
        {/* Live Engine Status */}
        <div className="px-2.5 py-1.5 flex items-center justify-between bg-surface-container-low rounded border border-surface-container-highest/70 mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-code-sm text-code-sm text-secondary">
              Engine v2.4 Active
            </span>
          </div>
          <span className="text-[10px] text-secondary font-code-sm">99.98%</span>
        </div>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 px-3 py-2 text-secondary hover:bg-surface-container-low hover:text-on-surface font-label-md text-label-md rounded-lg transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px]">settings</span>
          <span>Settings</span>
        </button>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 px-3 py-2 text-secondary hover:bg-surface-container-low hover:text-on-surface font-label-md text-label-md rounded-lg transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[18px]">help_outline</span>
          <span>Help & Documentation</span>
        </button>

        {/* User Account Chip */}
        <div className="mt-2 pt-3 border-t border-surface-container-high flex items-center justify-between px-1">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-label-sm text-label-sm font-semibold shrink-0">
              SC
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-label-md text-label-md font-medium text-on-surface leading-tight truncate">
                Acme Security
              </span>
              <span className="font-code-sm text-code-sm text-secondary truncate max-w-[125px]">
                lead-sec@acme.io
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined text-secondary text-base hover:text-on-surface cursor-pointer shrink-0">
            more_vert
          </span>
        </div>
      </div>
    </aside>
  );
}
