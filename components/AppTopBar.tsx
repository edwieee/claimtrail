'use client';

import React, { useEffect, useRef } from 'react';

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
  onOpenSettings?: () => void;
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
  onOpenSettings,
}: AppTopBarProps) {
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleShortcut);
    return () => window.removeEventListener('keydown', handleShortcut);
  }, []);

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3 w-full min-h-14 px-5 py-3 md:px-7 bg-surface border-b border-border z-20 shrink-0">
      {/* Left side: Breadcrumb & Context Switcher */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-secondary min-w-0">
          <span className="md:hidden font-semibold text-on-surface">ClaimTrail</span>
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <span aria-hidden="true" className={`text-secondary/50 text-[11px] ${idx === 0 ? 'hidden' : idx === breadcrumb.length - 1 ? 'md:hidden xl:inline' : 'hidden xl:inline'}`}>/</span>
              <span
                aria-current={idx === breadcrumb.length - 1 ? 'page' : undefined}
                className={
                  idx === breadcrumb.length - 1
                    ? 'text-on-surface font-medium truncate max-w-[200px]'
                    : 'hidden xl:inline text-secondary whitespace-nowrap'
                }
              >
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Assessment Selector Dropdown Pill */}
        <div className="hidden min-[1800px]:flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container-low border border-surface-container-high font-label-md text-label-md text-on-surface shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary-container shrink-0" />
          <span className="font-medium text-xs">AcmeCorp Enterprise Security 2026</span>
          <span aria-hidden="true" className="material-symbols-outlined text-sm text-secondary">unfold_more</span>
        </div>
      </div>

      {/* Right Side: Search, Trailing Actions, User Utilities */}
      <div className="flex items-center gap-2 sm:gap-3 max-w-full">
        {/* Quick Jump Search Input with Monospace Shortcut Chip */}
        <div className="relative flex items-center w-36 sm:w-48 xl:w-60 min-w-0">
          <span aria-hidden="true" className="material-symbols-outlined absolute left-2.5 text-secondary text-[16px] pointer-events-none">
            search
          </span>
          <input
            ref={searchRef}
            aria-label="Search questionnaire claims"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-9 pl-8 pr-3 sm:pr-10 text-body-sm bg-background border border-border rounded-md text-on-surface placeholder:text-secondary focus:border-secondary w-full"
            placeholder="Search questionnaire, rule..."
            type="text"
          />
          <span aria-hidden="true" className="hidden sm:block absolute right-2 px-1 font-mono text-[10px] text-secondary border border-border rounded pointer-events-none">
            ⌘K
          </span>
        </div>

        {/* Primary Call To Action (Burnt Copper) */}
        <button
          onClick={onPrimaryAction || onRunEvidenceCheck}
          disabled={isRunningCheck}
          className="flex items-center justify-center gap-1.5 min-h-9 px-3 rounded-md bg-primary text-on-primary text-xs font-medium hover:bg-accent-hover transition-colors disabled:opacity-60 shrink-0"
        >
          <span aria-hidden="true" className="material-symbols-outlined text-[16px]">
            {primaryActionLabel?.includes('Export') ? 'file_upload' : 'check_circle'}
          </span>
          <span>{isRunningCheck ? 'Checking evidence…' : primaryActionLabel || 'Run Evidence Check'}</span>
        </button>

        <div className="hidden lg:block h-4 w-[1px] bg-surface-container-high mx-0.5" />

        {/* Trailing Utility Icons */}
        <div className="hidden lg:flex items-center gap-1">
          <button
            onClick={onOpenFindings}
            className="p-1.5 text-secondary hover:text-on-surface hover:bg-surface-container-low rounded transition-colors relative"
            title={`${alertCount} Open Exceptions`}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-lg">notifications</span>
            {alertCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-container rounded-full" />
            )}
          </button>
        </div>

        {/* Auditor Profile Avatar */}
        <button
          onClick={onOpenSettings}
          aria-label="Open assessment settings"
          className="w-8 h-8 rounded-full bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center text-[11px] font-medium shrink-0"
          title="Lead Auditor: S. Chen"
        >
          SC
        </button>
      </div>
    </header>
  );
}
