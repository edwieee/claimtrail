'use client';

import React from 'react';

interface AppTopBarProps {
  breadcrumb: string[];
  searchQuery: string;
  onSearchChange: (q: string) => void;
  alertCount: number;
  isRunningCheck: boolean;
  onRunEvidenceCheck: () => void;
  onOpenFindings: () => void;
  primaryActionLabel?: string;
  onPrimaryAction?: () => void;
}

export function AppTopBar({
  breadcrumb,
  searchQuery,
  onSearchChange,
  alertCount,
  isRunningCheck,
  onRunEvidenceCheck,
  onOpenFindings,
  primaryActionLabel,
  onPrimaryAction,
}: AppTopBarProps) {
  return (
    <header className="flex items-center justify-between w-full h-14 px-6 bg-surface-container-lowest border-b border-surface-container-highest z-20 shrink-0 select-none">
      {/* Left side: Breadcrumb & Context Switcher */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 font-label-md text-label-md text-secondary shrink-0">
          <span>ClaimTrail</span>
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span className="text-secondary/50 text-[11px]">/</span>
              <span
                className={
                  idx === breadcrumb.length - 1
                    ? 'text-on-surface font-semibold truncate max-w-[200px]'
                    : 'text-secondary'
                }
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>

        <div className="hidden sm:block h-4 w-[1px] bg-surface-container-high mx-1" />

        {/* Assessment Selector Dropdown Pill */}
        <div className="hidden 2xl:flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-low border border-surface-container-high font-label-md text-label-md text-on-surface shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
          <span className="font-medium text-xs">AcmeCorp Enterprise Security 2026</span>
          <span className="material-symbols-outlined text-sm text-secondary">unfold_more</span>
        </div>
      </div>

      {/* Right Side: Search, Trailing Actions, User Utilities */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Quick Jump Search Input with Monospace Shortcut Chip */}
        <div className="relative flex items-center w-52 lg:w-64">
          <span className="material-symbols-outlined absolute left-2.5 text-secondary text-[16px] pointer-events-none">
            search
          </span>
          <input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-8 pl-8 pr-12 text-body-sm font-body-sm bg-surface-container-lowest border border-surface-container-highest rounded text-on-surface placeholder:text-secondary focus:outline-none focus:border-on-surface focus:ring-1 focus:ring-on-surface transition-all w-full"
            placeholder="Search questionnaire, rule..."
            type="text"
          />
          <span className="absolute right-2 px-1.5 py-0.2 font-code-sm text-code-sm bg-surface-container-low text-secondary border border-surface-container-highest rounded pointer-events-none">
            ⌘K
          </span>
        </div>

        {/* Primary Call To Action (Burnt Copper) */}
        <button
          onClick={onPrimaryAction || onRunEvidenceCheck}
          disabled={isRunningCheck}
          className="flex items-center gap-1.5 h-8 px-3.5 rounded bg-primary-container text-on-primary font-label-md text-label-md border border-[#9A3412] hover:bg-[#ea580c] shadow-xs transition-colors disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[16px]">
            {primaryActionLabel?.includes('Export') ? 'file_upload' : 'check_circle'}
          </span>
          <span>{primaryActionLabel || 'Run Evidence Check'}</span>
        </button>

        <div className="hidden lg:block h-4 w-[1px] bg-surface-container-high mx-0.5" />

        {/* Trailing Utility Icons */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={onOpenFindings}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container-low rounded transition-colors relative"
            title={`${alertCount} Open Exceptions`}
          >
            <span className="material-symbols-outlined text-lg">notifications</span>
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-container rounded-full" />
            )}
          </button>
        </div>

        {/* Auditor Profile Avatar */}
        <div
          className="w-7 h-7 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-label-sm text-xs font-semibold border border-surface-container-highest shrink-0 cursor-pointer"
          title="Lead Auditor: S. Chen"
        >
          SC
        </div>
      </div>
    </header>
  );
}
