'use client';

import React from 'react';
import Link from 'next/link';
import type { NavItem } from '@/types/claimtrail';

interface AppSidebarProps {
  currentNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  onOpenSettings?: () => void;
  onImportBatch?: () => void;
  counts?: { questions: number; sources: number; findings: number };
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
  { id: 'questionnaire', label: 'Questionnaire', icon: 'quiz', badgeColor: 'neutral' },
  { id: 'sources', label: 'Evidence Sources', icon: 'folder_open', badgeColor: 'neutral' },
  { id: 'findings', label: 'Findings', icon: 'verified_user', badgeColor: 'copper' },
  { id: 'exports', label: 'Exports', icon: 'file_upload' },
];

export function AppSidebar({
  currentNav,
  onNavChange,
  onOpenSettings,
  onImportBatch,
  counts = { questions: 0, sources: 0, findings: 0 },
}: AppSidebarProps) {
  // Normalize legacy NavItem states if any
  const activeId =
    currentNav === 'review' || currentNav === 'questions'
      ? 'questionnaire'
      : currentNav === 'evidence'
      ? 'sources'
      : currentNav;

  return (
    <aside id="app-navigation" aria-label="Workspace sidebar" className="hidden md:flex w-56 shrink-0 h-full bg-surface border-r border-border flex-col justify-between px-3 py-5 select-none z-30 overflow-y-auto">
      {/* Top Brand & Main Nav */}
      <div className="flex flex-col gap-5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2 pb-5 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-on-surface flex items-center justify-center text-surface-container-lowest text-xs font-semibold tracking-tight">
              <span>CT</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-headline-sm font-headline-sm font-bold text-on-surface tracking-tight leading-none">
                  ClaimTrail
                </span>
                <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[11px] font-code-sm text-secondary bg-surface-container-low border border-surface-container-highest">
                  v2.4
                </span>
              </div>
              <span className="text-label-sm font-label-sm text-secondary leading-tight mt-0.5">
                Enterprise Audit Engine
              </span>
            </div>
          </div>
        </div>

        {/* Import Batch CTA Button */}
        <button
          onClick={onImportBatch || (() => onNavChange('questionnaire'))}
          className="w-full flex items-center justify-center gap-2 min-h-9 px-3 bg-surface hover:bg-background text-on-surface text-label-md font-medium rounded-md border border-border transition-colors"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px] text-primary">
            upload_file
          </span>
          <span>Import Batch</span>
        </button>

        {/* Primary Navigation Tabs */}
        <nav aria-label="Main navigation" className="flex flex-col gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            const badge = item.id === 'questionnaire' ? counts.questions : item.id === 'sources' ? counts.sources : item.id === 'findings' ? counts.findings : undefined;
            return (
              <button
                key={item.id}
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onNavChange(item.id)}
                className={`flex items-center justify-between w-full min-h-10 px-3 py-2 font-label-md text-label-md rounded-md transition-colors text-left ${
                  isActive
                    ? 'text-primary bg-accent-bg font-medium border border-transparent'
                    : 'text-secondary hover:bg-surface-container-low hover:text-on-surface border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span aria-hidden="true"
                    className={`material-symbols-outlined text-[18px] ${
                      isActive ? 'text-primary' : 'text-secondary'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>
                {badge !== undefined && (
                  <span
                    className={`font-code-sm text-code-sm px-1.5 py-0.2 rounded ${
                      item.badgeColor === 'copper'
                        ? 'bg-accent-bg text-primary font-medium'
                        : isActive
                        ? 'bg-surface-container-lowest text-on-surface border border-surface-container-high'
                        : 'bg-surface-container text-secondary'
                    }`}
                  >
                    {badge}
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
        <div className="px-3 py-1.5 flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span className="font-code-sm text-code-sm text-secondary">
              Engine v2.4 Active
            </span>
          </div>
          <span className="text-[11px] text-secondary font-code-sm">Ready</span>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 px-3 py-2 text-secondary hover:bg-surface-container-low hover:text-on-surface font-label-md text-label-md rounded-lg transition-colors text-left"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span>Back to website</span>
        </Link>

        <button
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 px-3 py-2 text-secondary hover:bg-surface-container-low hover:text-on-surface font-label-md text-label-md rounded-lg transition-colors text-left"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[18px]">settings</span>
          <span>Settings</span>
        </button>

      </div>
    </aside>
  );
}
