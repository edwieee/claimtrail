'use client';

import React from 'react';
import { 
  ClipboardCheck, 
  HelpCircle, 
  Layers, 
  AlertCircle, 
  Download, 
  FileText, 
  GitBranch, 
  ShieldAlert, 
  ChevronLeft, 
  ChevronRight,
  Database,
  Sliders
} from 'lucide-react';
import { NavItem, LayerVisibility } from '@/types/claimtrail';

interface LeftSidebarProps {
  currentNav: NavItem;
  onNavChange: (nav: NavItem) => void;
  layers: LayerVisibility;
  onLayerToggle: (layer: keyof LayerVisibility) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  stats: {
    totalQuestions: number;
    amberCount: number;
    redCount: number;
    greenCount: number;
  };
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentNav,
  onNavChange,
  layers,
  onLayerToggle,
  isCollapsed,
  onToggleCollapse,
  stats,
}) => {
  const navItems: { id: NavItem; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string }[] = [
    { 
      id: 'review', 
      label: 'Review', 
      icon: <ClipboardCheck className="w-3.5 h-3.5" />, 
      badge: 'LIVE', 
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200' 
    },
    { 
      id: 'questions', 
      label: 'Questions', 
      icon: <HelpCircle className="w-3.5 h-3.5" />, 
      badge: stats.totalQuestions, 
      badgeColor: 'bg-console-subtle text-console-muted border-console-border' 
    },
    { 
      id: 'evidence', 
      label: 'Evidence', 
      icon: <Layers className="w-3.5 h-3.5" />, 
      badge: '18 NODES', 
      badgeColor: 'bg-console-subtle text-console-muted border-console-border' 
    },
    { 
      id: 'findings', 
      label: 'Findings', 
      icon: <AlertCircle className="w-3.5 h-3.5" />, 
      badge: stats.redCount + stats.amberCount, 
      badgeColor: 'bg-orange-50 text-orange-800 border-orange-200' 
    },
    { 
      id: 'exports', 
      label: 'Exports', 
      icon: <Download className="w-3.5 h-3.5" />, 
      badge: 'ZIP', 
      badgeColor: 'bg-console-subtle text-console-muted border-console-border' 
    },
  ];

  return (
    <aside
      className={`bg-console-card border-r border-console-border flex flex-col justify-between select-none shrink-0 transition-all duration-150 z-20 ${
        isCollapsed ? 'w-12' : 'w-56 lg:w-60'
      }`}
    >
      {/* Top Section: Navigation */}
      <div className="py-2.5">
        <div className="px-3 mb-1.5 flex items-center justify-between">
          {!isCollapsed && (
            <span className="text-3xs font-mono font-semibold uppercase text-console-faint tracking-wider">
              Navigation
            </span>
          )}
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle ml-auto transition-colors"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          </button>
        </div>

        <nav className="space-y-0.5 px-2">
          {navItems.map((item) => {
            const isActive = currentNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavChange(item.id)}
                title={item.label}
                className={`w-full flex items-center h-8 px-2 rounded text-xs transition-colors ${
                  isActive
                    ? 'bg-console-accentBg text-console-accent font-semibold border border-console-accentBorder'
                    : 'text-console-muted hover:text-console-text hover:bg-console-subtle border border-transparent'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-console-accent' : 'text-console-muted'}`}>
                  {item.icon}
                </span>

                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full ml-2.5 overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-3xs font-mono px-1 py-0.2 rounded border ${
                          item.badgeColor || 'bg-console-subtle text-console-muted border-console-border'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Separator */}
        <div className="my-3 mx-2.5 border-t border-console-border" />

        {/* Sources / Layers Section */}
        <div className="px-2">
          {!isCollapsed && (
            <div className="flex items-center justify-between mb-1.5 px-1">
              <span className="text-3xs font-mono font-semibold uppercase text-console-faint tracking-wider">
                Sources & Layers
              </span>
              <Sliders className="w-2.5 h-2.5 text-console-faint" />
            </div>
          )}

          <div className="space-y-1">
            {/* Policy Evidence */}
            <label
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors border ${
                layers.policy ? 'bg-white border-console-border text-console-text shadow-2xs' : 'bg-transparent border-transparent text-console-faint opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={layers.policy}
                onChange={() => onLayerToggle('policy')}
                className="w-3 h-3 text-console-accent rounded border-console-border accent-orange-600"
              />
              {!isCollapsed && (
                <div className="ml-2 flex items-center justify-between w-full text-xs truncate">
                  <span className="flex items-center space-x-1.5 truncate">
                    <FileText className="w-3 h-3 text-blue-600 shrink-0" />
                    <span className="truncate">Policy Evidence</span>
                  </span>
                  <span className="text-3xs font-mono text-console-faint shrink-0 ml-1">PDF</span>
                </div>
              )}
            </label>

            {/* Repository Evidence */}
            <label
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors border ${
                layers.repository ? 'bg-white border-console-border text-console-text shadow-2xs' : 'bg-transparent border-transparent text-console-faint opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={layers.repository}
                onChange={() => onLayerToggle('repository')}
                className="w-3 h-3 text-console-accent rounded border-console-border accent-orange-600"
              />
              {!isCollapsed && (
                <div className="ml-2 flex items-center justify-between w-full text-xs truncate">
                  <span className="flex items-center space-x-1.5 truncate">
                    <GitBranch className="w-3 h-3 text-purple-600 shrink-0" />
                    <span className="truncate">Repository Evidence</span>
                  </span>
                  <span className="text-3xs font-mono text-console-faint shrink-0 ml-1">GIT</span>
                </div>
              )}
            </label>

            {/* Security Controls */}
            <label
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors border ${
                layers.controls ? 'bg-white border-console-border text-console-text shadow-2xs' : 'bg-transparent border-transparent text-console-faint opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={layers.controls}
                onChange={() => onLayerToggle('controls')}
                className="w-3 h-3 text-console-accent rounded border-console-border accent-orange-600"
              />
              {!isCollapsed && (
                <div className="ml-2 flex items-center justify-between w-full text-xs truncate">
                  <span className="flex items-center space-x-1.5 truncate">
                    <Database className="w-3 h-3 text-emerald-600 shrink-0" />
                    <span className="truncate">Security Controls</span>
                  </span>
                  <span className="text-3xs font-mono text-console-faint shrink-0 ml-1">CIS</span>
                </div>
              )}
            </label>

            {/* Conflicts */}
            <label
              className={`flex items-center px-2 py-1.5 rounded cursor-pointer transition-colors border ${
                layers.conflicts ? 'bg-white border-console-border text-console-text shadow-2xs' : 'bg-transparent border-transparent text-console-faint opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={layers.conflicts}
                onChange={() => onLayerToggle('conflicts')}
                className="w-3 h-3 text-console-accent rounded border-console-border accent-orange-600"
              />
              {!isCollapsed && (
                <div className="ml-2 flex items-center justify-between w-full text-xs truncate">
                  <span className="flex items-center space-x-1.5 truncate">
                    <ShieldAlert className="w-3 h-3 text-red-600 shrink-0" />
                    <span className="truncate">Conflicts</span>
                  </span>
                  <span className="text-3xs font-mono text-red-600 font-semibold shrink-0 ml-1">
                    {stats.amberCount + stats.redCount}
                  </span>
                </div>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Bottom Section: Instrument Console Status */}
      {!isCollapsed ? (
        <div className="p-3 border-t border-console-border bg-console-subtle/40 text-3xs font-mono space-y-1.5">
          <div className="flex justify-between items-center text-console-faint">
            <span>PROVENANCE RATIO</span>
            <span className="text-console-text font-bold">100%</span>
          </div>
          <div className="w-full bg-console-border h-1 rounded overflow-hidden flex">
            <div style={{ width: `${(stats.greenCount / stats.totalQuestions) * 100}%` }} className="bg-emerald-500 h-full" />
            <div style={{ width: `${(stats.amberCount / stats.totalQuestions) * 100}%` }} className="bg-amber-500 h-full" />
            <div style={{ width: `${(stats.redCount / stats.totalQuestions) * 100}%` }} className="bg-red-500 h-full" />
          </div>
          <div className="flex justify-between text-3xs text-console-muted pt-0.5">
            <span className="text-emerald-700">{stats.greenCount} PASS</span>
            <span className="text-amber-700">{stats.amberCount} AMBER</span>
            <span className="text-red-700">{stats.redCount} RED</span>
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-console-border text-center text-2xs font-mono text-console-faint">
          ●
        </div>
      )}
    </aside>
  );
};
