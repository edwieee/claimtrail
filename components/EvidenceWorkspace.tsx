'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  SecurityClaim, 
  EvidenceNode, 
  LayerVisibility, 
  EvidenceStatus 
} from '@/types/claimtrail';
import { 
  FileText, 
  GitBranch, 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Scale
} from 'lucide-react';

interface EvidenceWorkspaceProps {
  claim: SecurityClaim;
  selectedNodeId: string | null;
  onSelectNode: (node: EvidenceNode) => void;
  layers: LayerVisibility;
  onOpenInspector: () => void;
}

interface NodeRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const EvidenceWorkspace: React.FC<EvidenceWorkspaceProps> = ({
  claim,
  selectedNodeId,
  onSelectNode,
  layers,
  onOpenInspector,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterMode, setFilterMode] = useState<'all' | 'supporting' | 'conflicts'>('all');
  const [nodePositions, setNodePositions] = useState<Record<string, NodeRect>>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filter visible nodes based on layer visibility and filterMode
  const visibleNodes = claim.nodes.filter((node) => {
    if (node.type === 'policy' && !layers.policy) return false;
    if (node.type === 'repository' && !layers.repository) return false;
    if (node.type === 'control' && !layers.controls) return false;
    if (node.type === 'conflict' && !layers.conflicts) return false;

    if (filterMode === 'supporting' && node.status !== 'green') return false;
    if (filterMode === 'conflicts' && node.status === 'green') return false;

    return true;
  });

  const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));

  // Filter visible links
  const visibleLinks = claim.links.filter(
    (link) => visibleNodeIds.has(link.sourceId) && visibleNodeIds.has(link.targetId)
  );

  // Group nodes into the 4 columns
  const claimNode = visibleNodes.find((n) => n.type === 'claim');
  const sourceNodes = visibleNodes.filter((n) => n.type === 'policy' || n.type === 'repository');
  const controlNode = visibleNodes.find((n) => n.type === 'control');
  const conflictNode = visibleNodes.find((n) => n.type === 'conflict');

  // Measure actual node positions inside the container for SVG connectors
  const updatePositions = useCallback(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPositions: Record<string, NodeRect> = {};

    Object.entries(nodeRefs.current).forEach(([id, el]) => {
      if (el && containerRef.current) {
        const elRect = el.getBoundingClientRect();
        newPositions[id] = {
          x: elRect.left - containerRect.left,
          y: elRect.top - containerRect.top,
          width: elRect.width,
          height: elRect.height,
        };
      }
    });

    setNodePositions(newPositions);
  }, []);

  useEffect(() => {
    updatePositions();
    const timer = setTimeout(updatePositions, 50);

    const observer = new ResizeObserver(() => {
      updatePositions();
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    window.addEventListener('resize', updatePositions);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
      window.removeEventListener('resize', updatePositions);
    };
  }, [claim.id, visibleNodes.length, zoomLevel, updatePositions]);

  // Status badge helper
  const getStatusBadge = (status: EvidenceStatus, text: string) => {
    switch (status) {
      case 'green':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-mono font-medium shrink-0">
            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
            <span>{text}</span>
          </span>
        );
      case 'amber':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-3xs font-mono font-medium shrink-0">
            <AlertCircle className="w-2.5 h-2.5 text-amber-600" />
            <span>{text}</span>
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-red-50 text-red-800 border border-red-200 text-3xs font-mono font-medium shrink-0">
            <XCircle className="w-2.5 h-2.5 text-red-600" />
            <span>{text}</span>
          </span>
        );
    }
  };

  const getNodeIcon = (type: EvidenceNode['type']) => {
    switch (type) {
      case 'claim':
        return <HelpCircle className="w-3.5 h-3.5 text-console-accent shrink-0" />;
      case 'policy':
        return <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />;
      case 'repository':
        return <GitBranch className="w-3.5 h-3.5 text-purple-600 shrink-0" />;
      case 'control':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />;
      case 'conflict':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />;
    }
  };

  // Render individual compact node card
  const renderNodeCard = (node: EvidenceNode) => {
    const isSelected = selectedNodeId === node.id;
    const isClaim = node.type === 'claim';

    return (
      <div
        key={node.id}
        ref={(el) => {
          nodeRefs.current[node.id] = el;
        }}
        onClick={() => onSelectNode(node)}
        className={`bg-white rounded border cursor-pointer transition-all duration-150 relative z-10 flex flex-col justify-between p-2.5 text-left w-full ${
          isSelected
            ? 'border-orange-500 ring-2 ring-orange-200 shadow-xs'
            : 'border-console-border hover:border-console-faint hover:shadow-2xs'
        } ${isClaim ? 'bg-orange-50/15' : ''}`}
      >
        {/* Header row */}
        <div className="flex items-center justify-between gap-1 mb-1">
          <div className="flex items-center space-x-1.5 min-w-0">
            {getNodeIcon(node.type)}
            <span className="text-3xs font-mono font-bold uppercase tracking-wider text-console-faint truncate">
              {node.sourceLabel}
            </span>
          </div>
          {getStatusBadge(node.status, node.statusText)}
        </div>

        {/* Title */}
        <h3 className="text-xs font-semibold text-console-text line-clamp-1 leading-snug">
          {node.title}
        </h3>

        {/* Reference coordinate */}
        <div className="text-3xs font-mono text-console-faint mt-0.5 truncate">
          {node.lineOrPageRef}
        </div>

        {/* Excerpt */}
        {node.snippet && (
          <div className="mt-1.5 p-1.5 bg-console-subtle/50 rounded border border-console-border/60 text-3xs font-mono text-console-muted line-clamp-2 leading-relaxed">
            {node.snippet}
          </div>
        )}

        {/* Footer */}
        <div className="mt-2 pt-1 border-t border-console-border/70 flex items-center justify-between text-3xs font-mono text-console-faint">
          <span>CLICK TO INSPECT</span>
          <span className="font-semibold text-console-muted">CONF: {node.confidence}%</span>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-console-bg min-w-0 min-h-0 relative select-none overflow-hidden">
      {/* 1. Compact Toolbar immediately above canvas */}
      <div className="h-9 border-b border-console-border bg-console-card px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Title + Claim Code + Legend */}
        <div className="flex items-center space-x-3 truncate">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-console-text uppercase tracking-wider font-mono">
              Evidence Workspace
            </span>
            <span className="text-console-faint font-mono text-2xs">/</span>
            <span className="text-2xs font-mono font-bold text-console-accent bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded">
              {claim.code}
            </span>
          </div>

          <div className="h-3 w-px bg-console-border hidden md:block" />

          {/* Compact Status Legend */}
          <div className="hidden lg:flex items-center space-x-3 text-3xs font-mono text-console-muted">
            <span className="text-console-faint font-semibold uppercase">LEGEND:</span>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>Supporting</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Ambiguous / Incomplete</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span>Unsafe Condition</span>
            </div>
          </div>
        </div>

        {/* Right: Filters & Zoom */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Status Filter */}
          <div className="flex items-center bg-console-subtle p-0.5 rounded border border-console-border text-3xs font-mono">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                filterMode === 'all'
                  ? 'bg-white text-console-text font-bold shadow-2xs border border-console-border'
                  : 'text-console-muted hover:text-console-text'
              }`}
            >
              ALL ({claim.nodes.length})
            </button>
            <button
              onClick={() => setFilterMode('supporting')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                filterMode === 'supporting'
                  ? 'bg-white text-emerald-800 font-bold shadow-2xs border border-console-border'
                  : 'text-console-muted hover:text-console-text'
              }`}
            >
              SUPPORTING
            </button>
            <button
              onClick={() => setFilterMode('conflicts')}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                filterMode === 'conflicts'
                  ? 'bg-white text-amber-800 font-bold shadow-2xs border border-console-border'
                  : 'text-console-muted hover:text-console-text'
              }`}
            >
              DIVERGENT
            </button>
          </div>

          {/* Zoom controls */}
          <div className="flex items-center space-x-0.5 border-l border-console-border pl-1.5">
            <button
              onClick={() => setZoomLevel((z) => Math.max(0.85, z - 0.05))}
              className="p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle"
              title="Zoom Out"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="text-3xs font-mono text-console-muted w-8 text-center">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={() => setZoomLevel((z) => Math.min(1.2, z + 0.05))}
              className="p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle"
              title="Zoom In"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle"
              title="Reset Zoom"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Structured 4-Column Evidence Provenance Canvas */}
      <div className="flex-1 relative overflow-auto map-grid-bg p-4 xl:p-6 flex items-center justify-center min-h-0 min-w-0">
        <div
          ref={containerRef}
          style={{ transform: `scale(${zoomLevel})` }}
          className="w-full max-w-6xl relative transition-transform duration-150 origin-center my-auto"
        >
          {/* SVG Connector Layer - Drawn strictly behind nodes */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="marker-green"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 7 4 L 0 7 z" fill="#15803D" />
              </marker>
              <marker
                id="marker-amber"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 7 4 L 0 7 z" fill="#B45309" />
              </marker>
              <marker
                id="marker-red"
                viewBox="0 0 8 8"
                refX="6"
                refY="4"
                markerWidth="4"
                markerHeight="4"
                orient="auto-start-reverse"
              >
                <path d="M 0 1 L 7 4 L 0 7 z" fill="#B91C1C" />
              </marker>
            </defs>

            {visibleLinks.map((link) => {
              const srcPos = nodePositions[link.sourceId];
              const tgtPos = nodePositions[link.targetId];

              if (!srcPos || !tgtPos) return null;

              // Calculate start at right center of source, end at left center of target
              const x1 = srcPos.x + srcPos.width;
              const y1 = srcPos.y + srcPos.height / 2;
              const x2 = tgtPos.x;
              const y2 = tgtPos.y + tgtPos.height / 2;

              const dx = Math.max(30, (x2 - x1) * 0.45);
              const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              let strokeColor = '#94a3b8';
              let markerId = 'marker-green';
              if (link.status === 'green') {
                strokeColor = '#15803d';
                markerId = 'marker-green';
              } else if (link.status === 'amber') {
                strokeColor = '#f59e0b';
                markerId = 'marker-amber';
              } else if (link.status === 'red') {
                strokeColor = '#ef4444';
                markerId = 'marker-red';
              }

              const isLinkActive =
                selectedNodeId === link.sourceId || selectedNodeId === link.targetId;

              return (
                <g key={link.id}>
                  {isLinkActive && (
                    <path
                      d={pathD}
                      fill="none"
                      stroke="#ea580c"
                      strokeWidth="3.5"
                      strokeOpacity="0.2"
                    />
                  )}
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isLinkActive ? '#ea580c' : strokeColor}
                    strokeWidth={isLinkActive ? '1.8' : '1.2'}
                    strokeDasharray={link.dashed ? '4,4' : undefined}
                    markerEnd={`url(#${isLinkActive ? 'marker-amber' : markerId})`}
                  />
                  {link.label && (
                    <g transform={`translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 8})`}>
                      <rect
                        x="-30"
                        y="-7"
                        width="60"
                        height="14"
                        rx="2"
                        fill="#ffffff"
                        stroke="#e2e4e8"
                        strokeWidth="1"
                      />
                      <text
                        textAnchor="middle"
                        y="3"
                        fill="#5b6471"
                        fontSize="7.5"
                        fontFamily="ui-monospace, monospace"
                        fontWeight="600"
                      >
                        {link.label.toUpperCase()}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>

          {/* 4-Column Header Labels */}
          <div className="grid grid-cols-4 gap-4 xl:gap-6 mb-2.5 px-1 relative z-10">
            <div className="text-3xs font-mono font-bold uppercase tracking-wider text-console-faint">
              01 · Question / Claim
            </div>
            <div className="text-3xs font-mono font-bold uppercase tracking-wider text-console-faint">
              02 · Source Evidence
            </div>
            <div className="text-3xs font-mono font-bold uppercase tracking-wider text-console-faint">
              03 · Control Check
            </div>
            <div className="text-3xs font-mono font-bold uppercase tracking-wider text-console-faint">
              04 · Finding / Decision
            </div>
          </div>

          {/* 4-Column Grid Content Cards */}
          <div className="grid grid-cols-4 gap-4 xl:gap-6 items-center relative z-10">
            {/* Column A: Question / Claim */}
            <div className="flex flex-col justify-center">
              {claimNode ? (
                renderNodeCard(claimNode)
              ) : (
                <div className="p-3 border border-dashed border-console-border rounded text-3xs font-mono text-console-faint text-center">
                  No claim in scope
                </div>
              )}
            </div>

            {/* Column B: Source Evidence (Policy & Repository stacked) */}
            <div className="flex flex-col gap-3 justify-center">
              {sourceNodes.length > 0 ? (
                sourceNodes.map((node) => renderNodeCard(node))
              ) : (
                <div className="p-3 border border-dashed border-console-border rounded text-3xs font-mono text-console-faint text-center">
                  Source layers disabled
                </div>
              )}
            </div>

            {/* Column C: Control Check */}
            <div className="flex flex-col justify-center">
              {controlNode ? (
                renderNodeCard(controlNode)
              ) : (
                <div className="p-3 border border-dashed border-console-border rounded text-3xs font-mono text-console-faint text-center">
                  Controls layer disabled
                </div>
              )}
            </div>

            {/* Column D: Finding / Decision */}
            <div className="flex flex-col justify-center">
              {conflictNode ? (
                renderNodeCard(conflictNode)
              ) : (
                <div className="bg-white rounded border border-console-border p-3 flex flex-col justify-between text-left">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-3xs font-mono font-bold uppercase tracking-wider text-emerald-700">
                      VERDICT
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-mono font-medium">
                      CLEAN
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-console-text">
                    No Direct Divergence
                  </h4>
                  <p className="text-3xs font-mono text-console-muted mt-1 leading-relaxed">
                    Source evidence signals match questionnaire scope without active policy contradictions.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
