'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Play, 
  FileSpreadsheet, 
  FileText, 
  GitBranch, 
  AlertTriangle,
  RotateCw,
  Info
} from 'lucide-react';

interface TopUtilityBarProps {
  onRunEvidenceCheck: () => void;
  isRunningCheck: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  alertCount: number;
}

export const TopUtilityBar: React.FC<TopUtilityBarProps> = ({
  onRunEvidenceCheck,
  isRunningCheck,
  searchQuery,
  onSearchChange,
  alertCount,
}) => {
  const [showSourcesPopover, setShowSourcesPopover] = useState(false);

  return (
    <header className="h-11 bg-console-card border-b border-console-border px-4 flex items-center justify-between select-none shrink-0 z-30 text-xs">
      {/* Left: Branding & Workspace Context */}
      <div className="flex items-center space-x-3 min-w-0">
        {/* Brand */}
        <div className="flex items-center space-x-2 shrink-0">
          <div className="w-5 h-5 bg-console-text rounded flex items-center justify-center text-white">
            <ShieldCheck className="w-3.5 h-3.5 text-console-accent" />
          </div>
          <span className="font-bold tracking-tight text-console-text text-sm">ClaimTrail</span>
          <span className="text-2xs text-console-muted font-mono hidden xl:inline border-l border-console-border pl-2">
            From security claims to source evidence
          </span>
        </div>

        <div className="h-3.5 w-px bg-console-border hidden sm:block shrink-0" />

        {/* Workspace Breadcrumbs */}
        <div className="hidden sm:flex items-center space-x-1.5 text-console-muted font-mono text-2xs truncate">
          <span className="text-console-text font-medium">Acme Corp</span>
          <span className="text-console-faint">/</span>
          <span className="text-console-accent bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200 truncate">
            SIG_Lite_2026.xlsx
          </span>
        </div>

        {/* Sources Popover Trigger */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowSourcesPopover(!showSourcesPopover)}
            className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-console-subtle hover:bg-console-border/40 text-2xs font-mono text-console-muted border border-console-border transition-colors"
            title="Inspect active evidence source connections"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>3 Sources Synced</span>
            <Info className="w-2.5 h-2.5 text-console-faint" />
          </button>

          {showSourcesPopover && (
            <div 
              className="absolute left-0 mt-1 w-64 bg-white border border-console-border rounded shadow-md p-2.5 z-50 text-2xs font-mono space-y-2"
              onMouseLeave={() => setShowSourcesPopover(false)}
            >
              <div className="text-3xs uppercase tracking-wider text-console-faint font-semibold border-b border-console-border pb-1">
                Connected Data Channels
              </div>
              <div className="flex items-center justify-between text-console-text">
                <span className="flex items-center space-x-1.5">
                  <FileSpreadsheet className="w-3 h-3 text-emerald-600" />
                  <span>Questionnaire</span>
                </span>
                <span className="text-console-faint">SIG_Lite_2026.xlsx</span>
              </div>
              <div className="flex items-center justify-between text-console-text">
                <span className="flex items-center space-x-1.5">
                  <FileText className="w-3 h-3 text-blue-600" />
                  <span>Security Policy</span>
                </span>
                <span className="text-console-faint">SecOps_Policy_v3.4.pdf</span>
              </div>
              <div className="flex items-center justify-between text-console-text">
                <span className="flex items-center space-x-1.5">
                  <GitBranch className="w-3 h-3 text-purple-600" />
                  <span>GitHub Repository</span>
                </span>
                <span className="text-console-faint">acme/cloud-core (main)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Live Status & Demo Badge */}
      <div className="flex items-center space-x-2 shrink-0 px-2">
        <span className="px-1.5 py-0.2 rounded bg-amber-50 border border-amber-200 text-amber-900 font-mono text-3xs font-semibold uppercase tracking-wider">
          DEMO DATA
        </span>
        <div className="hidden lg:flex items-center space-x-1 px-1.5 py-0.2 rounded bg-console-subtle text-3xs font-mono text-console-muted border border-console-border">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot" />
          <span className="text-console-text font-medium">ENGINE ONLINE</span>
        </div>
      </div>

      {/* Right: Search, Alert Count & Primary Action */}
      <div className="flex items-center space-x-2 shrink-0">
        {/* Compact Search */}
        <div className="relative w-36 sm:w-44 lg:w-52">
          <Search className="w-3 h-3 text-console-faint absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-7 pl-6 pr-6 text-xs bg-console-subtle border border-console-border rounded focus:outline-none focus:border-console-accent focus:bg-white transition-colors placeholder:text-console-faint font-sans"
          />
          <kbd className="absolute right-1.5 top-1/2 -translate-y-1/2 text-3xs font-mono bg-white px-1 rounded border border-console-border text-console-faint pointer-events-none hidden sm:inline">
            /
          </kbd>
        </div>

        {/* Alert Counter */}
        <div 
          className="flex items-center space-x-1 px-2 h-7 rounded border border-console-border bg-console-subtle text-2xs font-mono text-console-text shrink-0"
          title="Active conflicts requiring review"
        >
          <AlertTriangle className="w-3 h-3 text-console-accent" />
          <span className="font-semibold text-console-accent">{alertCount}</span>
          <span className="text-console-muted hidden md:inline">ALERTS</span>
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onRunEvidenceCheck}
          disabled={isRunningCheck}
          className="h-7 px-3 rounded bg-console-accent hover:bg-console-accentHover text-white font-medium text-xs flex items-center space-x-1.5 transition-colors shadow-2xs shrink-0 disabled:opacity-75"
        >
          {isRunningCheck ? (
            <>
              <RotateCw className="w-3 h-3 animate-spin" />
              <span className="hidden sm:inline">Checking...</span>
            </>
          ) : (
            <>
              <Play className="w-3 h-3 fill-white" />
              <span>Run Evidence Check</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
};
