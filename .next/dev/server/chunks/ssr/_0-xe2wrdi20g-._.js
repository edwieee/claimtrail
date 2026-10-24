(()=>{"use strict";module.exports = [
"[project]/app/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>DashboardPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppSidebar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppTopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppTopBar.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OverviewDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/OverviewDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EvidenceWorkspace$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/EvidenceWorkspace.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DetailInspectorModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/DetailInspectorModal.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/data/demoData.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
;
function DashboardPage() {
    // ── Navigation
    const [currentView, setCurrentView] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('overview');
    // ── Search
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    // ── Claim selection
    const [selectedClaimId, setSelectedClaimId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('claim-1');
    const [selectedNodeId, setSelectedNodeId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('node-repo-1');
    // ── Layer visibility (for Evidence graph)
    const [layers, setLayers] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        policy: true,
        repository: true,
        controls: true,
        conflicts: true
    });
    // ── Inspector modal
    const [isInspectorOpen, setIsInspectorOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [inspectedNode, setInspectedNode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // ── Evidence check simulation
    const [isRunningCheck, setIsRunningCheck] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // ── Derived
    const filteredClaims = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>{
        if (!searchQuery.trim()) return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CLAIMS"];
        const q = searchQuery.toLowerCase();
        return __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CLAIMS"].filter((c)=>c.code.toLowerCase().includes(q) || c.question.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.primarySourcePath.toLowerCase().includes(q));
    }, [
        searchQuery
    ]);
    const activeClaim = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useMemo"])(()=>__TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CLAIMS"].find((c)=>c.id === selectedClaimId) ?? __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CLAIMS"][0], [
        selectedClaimId
    ]);
    // ── Handlers
    function handleSelectClaim(claim) {
        setSelectedClaimId(claim.id);
        setSelectedNodeId(claim.nodes.length > 1 ? claim.nodes[1].id : claim.nodes[0]?.id ?? null);
        // Navigate to evidence view when a claim is selected from overview
        if (currentView === 'overview') setCurrentView('questions');
    }
    function handleSelectNode(node) {
        setSelectedNodeId(node.id);
        setInspectedNode(node);
        setIsInspectorOpen(true);
    }
    function handleSelectConflict(conflict) {
        const claim = __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CLAIMS"].find((c)=>c.code === conflict.claimCode);
        if (!claim) return;
        setSelectedClaimId(claim.id);
        const conflictNode = claim.nodes.find((n)=>n.type === 'conflict');
        if (conflictNode) {
            setSelectedNodeId(conflictNode.id);
            setInspectedNode(conflictNode);
            setIsInspectorOpen(true);
        }
        // Navigate to evidence when clicking a conflict
        setCurrentView('evidence');
    }
    function handleLayerToggle(layer) {
        setLayers((prev)=>({
                ...prev,
                [layer]: !prev[layer]
            }));
    }
    function handleRunEvidenceCheck() {
        setIsRunningCheck(true);
        setTimeout(()=>setIsRunningCheck(false), 1800);
    }
    // ── Breadcrumb
    const breadcrumb = {
        overview: [
            'Dashboard',
            'Overview'
        ],
        review: [
            'Dashboard',
            'Review'
        ],
        questions: [
            'Dashboard',
            'Questions'
        ],
        evidence: [
            'Dashboard',
            'Evidence'
        ],
        findings: [
            'Dashboard',
            'Findings'
        ],
        exports: [
            'Dashboard',
            'Exports'
        ]
    }[currentView];
    // ── Evidence view needs layer sidebar too. Build a compact layer toggle bar.
    const isEvidenceView = currentView === 'evidence' || currentView === 'review';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full w-full overflow-hidden bg-canvas",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppSidebar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppSidebar"], {
                currentNav: currentView,
                onNavChange: setCurrentView
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 117,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppTopBar$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AppTopBar"], {
                        breadcrumb: breadcrumb,
                        searchQuery: searchQuery,
                        onSearchChange: setSearchQuery,
                        alertCount: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CONFLICTS"].length,
                        isRunningCheck: isRunningCheck,
                        onRunEvidenceCheck: handleRunEvidenceCheck
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 122,
                        columnNumber: 9
                    }, this),
                    currentView === 'overview' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$OverviewDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["OverviewDashboard"], {
                        claims: filteredClaims,
                        conflicts: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CONFLICTS"],
                        selectedClaimId: selectedClaimId,
                        onSelectClaim: handleSelectClaim,
                        onSelectConflict: handleSelectConflict,
                        onViewAllQuestions: ()=>setCurrentView('questions')
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 133,
                        columnNumber: 11
                    }, this),
                    (currentView === 'evidence' || currentView === 'review' || currentView === 'questions') && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 px-5 py-2 bg-surface border-b border-border flex items-center gap-4 text-xs text-text-secondary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "font-medium text-text-primary shrink-0",
                                        children: "Graph Layers:"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 147,
                                        columnNumber: 15
                                    }, this),
                                    [
                                        {
                                            key: 'policy',
                                            label: 'Policy Evidence'
                                        },
                                        {
                                            key: 'repository',
                                            label: 'Repository Evidence'
                                        },
                                        {
                                            key: 'controls',
                                            label: 'Security Controls'
                                        },
                                        {
                                            key: 'conflicts',
                                            label: 'Conflicts'
                                        }
                                    ].map(({ key, label })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "flex items-center gap-1.5 cursor-pointer select-none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "checkbox",
                                                    checked: layers[key],
                                                    onChange: ()=>handleLayerToggle(key),
                                                    className: "w-3 h-3 accent-accent rounded"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 157,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: layers[key] ? 'text-text-primary' : 'text-text-tertiary',
                                                    children: label
                                                }, void 0, false, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 163,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, key, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 156,
                                            columnNumber: 17
                                        }, this)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "ml-auto text-2xs font-mono text-signal-amber font-medium",
                                        children: "DEMO DATA"
                                    }, void 0, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 168,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 146,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "shrink-0 px-5 py-1.5 bg-surface border-b border-border flex items-center gap-2 overflow-x-auto",
                                children: filteredClaims.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>handleSelectClaim(c),
                                        className: `shrink-0 text-xs font-mono px-2.5 py-1 rounded border transition-colors ${c.id === selectedClaimId ? 'border-accent bg-accent-bg text-accent font-semibold' : 'border-border text-text-secondary hover:text-text-primary hover:border-border-strong'}`,
                                        children: c.code
                                    }, c.id, false, {
                                        fileName: "[project]/app/page.tsx",
                                        lineNumber: 176,
                                        columnNumber: 17
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 174,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$EvidenceWorkspace$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["EvidenceWorkspace"], {
                                claim: activeClaim,
                                selectedNodeId: selectedNodeId,
                                onSelectNode: handleSelectNode,
                                layers: layers,
                                onOpenInspector: ()=>{
                                    setInspectedNode(null);
                                    setIsInspectorOpen(true);
                                }
                            }, void 0, false, {
                                fileName: "[project]/app/page.tsx",
                                lineNumber: 190,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 144,
                        columnNumber: 11
                    }, this),
                    currentView === 'findings' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-6 max-w-[1440px] mx-auto space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                            className: "text-xl font-semibold text-text-primary",
                                            children: "Active Findings"
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 207,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-text-secondary mt-0.5",
                                            children: "Detected policy-configuration conflicts and unsafe conditions."
                                        }, void 0, false, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 208,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 206,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-surface border border-border rounded divide-y divide-border",
                                    children: __TURBOPACK__imported__module__$5b$project$5d2f$data$2f$demoData$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DEMO_CONFLICTS"].map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: ()=>handleSelectConflict(c),
                                            className: "px-5 py-4 hover:bg-canvas cursor-pointer transition-colors",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-start gap-3 mb-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-xs font-mono font-semibold text-accent mt-0.5 shrink-0",
                                                            children: c.claimCode
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 220,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                            className: "text-sm font-medium text-text-primary",
                                                            children: c.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 223,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: `pill ml-auto shrink-0 ${c.severity === 'high' ? 'bg-signal-red-bg text-signal-red border-signal-red-border' : c.severity === 'medium' ? 'bg-signal-amber-bg text-signal-amber border-signal-amber-border' : 'bg-canvas text-text-secondary border-border'}`,
                                                            children: c.severity.toUpperCase()
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/page.tsx",
                                                            lineNumber: 224,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-text-tertiary ml-[52px]",
                                                    children: [
                                                        c.sourceA.label,
                                                        " → ",
                                                        c.sourceB.label
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 236,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-2xs text-text-tertiary ml-[52px] font-mono mt-1",
                                                    children: [
                                                        "Detected ",
                                                        c.detectedAt
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/page.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, c.id, true, {
                                            fileName: "[project]/app/page.tsx",
                                            lineNumber: 214,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 212,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 205,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 204,
                        columnNumber: 11
                    }, this),
                    currentView === 'exports' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-6 py-6 max-w-[1440px] mx-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-semibold text-text-primary",
                                    children: "Exports"
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 252,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-text-secondary mt-0.5 mb-6",
                                    children: "Export evidence reports and compliance summaries."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 253,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "bg-surface border border-border rounded p-5 text-sm text-text-secondary",
                                    children: "Export functionality will be available once backend sources are connected."
                                }, void 0, false, {
                                    fileName: "[project]/app/page.tsx",
                                    lineNumber: 256,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/app/page.tsx",
                            lineNumber: 251,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/page.tsx",
                        lineNumber: 250,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 120,
                columnNumber: 7
            }, this),
            isInspectorOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$DetailInspectorModal$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["DetailInspectorModal"], {
                claim: activeClaim,
                node: inspectedNode,
                onClose: ()=>setIsInspectorOpen(false)
            }, void 0, false, {
                fileName: "[project]/app/page.tsx",
                lineNumber: 266,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/page.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/AppSidebar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppSidebar",
    ()=>AppSidebar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layout-dashboard.mjs [app-ssr] (ecmascript) <export default as LayoutDashboard>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clipboard-check.mjs [app-ssr] (ecmascript) <export default as ClipboardCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/layers.mjs [app-ssr] (ecmascript) <export default as Layers>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/download.mjs [app-ssr] (ecmascript) <export default as Download>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.mjs [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chevron-down.mjs [app-ssr] (ecmascript) <export default as ChevronDown>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
'use client';
;
;
const NAV_ITEMS = [
    {
        id: 'overview',
        label: 'Overview',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layout$2d$dashboard$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LayoutDashboard$3e$__["LayoutDashboard"]
    },
    {
        id: 'review',
        label: 'Review',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clipboard$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ClipboardCheck$3e$__["ClipboardCheck"]
    },
    {
        id: 'questions',
        label: 'Questions',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"]
    },
    {
        id: 'evidence',
        label: 'Evidence',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$layers$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Layers$3e$__["Layers"]
    },
    {
        id: 'findings',
        label: 'Findings',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"]
    },
    {
        id: 'exports',
        label: 'Exports',
        icon: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$download$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Download$3e$__["Download"]
    }
];
function AppSidebar({ currentNav, onNavChange }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: "w-[195px] shrink-0 bg-surface border-r border-border flex flex-col h-full select-none overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-[52px] flex items-center px-5 border-b border-border shrink-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center gap-2.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-7 h-7 rounded bg-text-primary flex items-center justify-center",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                                className: "w-4 h-4 text-accent"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 39,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/AppSidebar.tsx",
                            lineNumber: 38,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-sm text-text-primary tracking-tight",
                            children: "ClaimTrail"
                        }, void 0, false, {
                            fileName: "[project]/components/AppSidebar.tsx",
                            lineNumber: 41,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AppSidebar.tsx",
                    lineNumber: 37,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AppSidebar.tsx",
                lineNumber: 36,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "flex-1 overflow-y-auto py-3 px-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "space-y-0.5",
                        children: NAV_ITEMS.map(({ id, label, icon: Icon })=>{
                            const isActive = currentNav === id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>onNavChange(id),
                                    className: `w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors text-left ${isActive ? 'bg-nav-active-bg text-nav-active-text font-medium' : 'text-nav-text hover:bg-canvas hover:text-text-primary'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                            className: `w-4 h-4 shrink-0 ${isActive ? 'text-accent' : 'text-text-tertiary'}`
                                        }, void 0, false, {
                                            fileName: "[project]/components/AppSidebar.tsx",
                                            lineNumber: 60,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "truncate",
                                            children: label
                                        }, void 0, false, {
                                            fileName: "[project]/components/AppSidebar.tsx",
                                            lineNumber: 65,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/AppSidebar.tsx",
                                    lineNumber: 52,
                                    columnNumber: 17
                                }, this)
                            }, id, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 51,
                                columnNumber: 15
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/components/AppSidebar.tsx",
                        lineNumber: 47,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-6 mb-1 px-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-2xs font-semibold uppercase tracking-wider text-text-tertiary",
                            children: "Workspace"
                        }, void 0, false, {
                            fileName: "[project]/components/AppSidebar.tsx",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/AppSidebar.tsx",
                        lineNumber: 73,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "px-3 py-2 rounded border border-border bg-canvas",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs font-medium text-text-primary truncate",
                                children: "Acme Corp"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 77,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xs text-text-tertiary mt-0.5 truncate",
                                children: "SOC 2 Type II — 2026"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 78,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppSidebar.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppSidebar.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "shrink-0 border-t border-border py-2 px-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-nav-text hover:bg-canvas hover:text-text-primary transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                className: "w-4 h-4 shrink-0 text-text-tertiary"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 85,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Settings"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 86,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "w-3 h-3 ml-auto text-text-tertiary"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 87,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppSidebar.tsx",
                        lineNumber: 84,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        className: "w-full flex items-center gap-2.5 px-3 py-2 rounded text-sm text-nav-text hover:bg-canvas hover:text-text-primary transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                className: "w-4 h-4 shrink-0 text-text-tertiary"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 90,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Help Center"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 91,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chevron$2d$down$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronDown$3e$__["ChevronDown"], {
                                className: "w-3 h-3 ml-auto text-text-tertiary"
                            }, void 0, false, {
                                fileName: "[project]/components/AppSidebar.tsx",
                                lineNumber: 92,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/AppSidebar.tsx",
                        lineNumber: 89,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppSidebar.tsx",
                lineNumber: 83,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppSidebar.tsx",
        lineNumber: 34,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/AppTopBar.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AppTopBar",
    ()=>AppTopBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/search.mjs [app-ssr] (ecmascript) <export default as Search>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/bell.mjs [app-ssr] (ecmascript) <export default as Bell>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/play.mjs [app-ssr] (ecmascript) <export default as Play>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-cw.mjs [app-ssr] (ecmascript) <export default as RotateCw>");
'use client';
;
;
;
function AppTopBar({ breadcrumb, searchQuery, onSearchChange, alertCount, isRunningCheck, onRunEvidenceCheck, showRunButton = true }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
        className: "h-[52px] shrink-0 bg-surface border-b border-border flex items-center px-5 gap-4 select-none z-20",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1.5 text-sm text-text-secondary min-w-0",
                children: breadcrumb.map((crumb, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].Fragment, {
                        children: [
                            i > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-text-tertiary",
                                children: "›"
                            }, void 0, false, {
                                fileName: "[project]/components/AppTopBar.tsx",
                                lineNumber: 31,
                                columnNumber: 23
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: i === breadcrumb.length - 1 ? 'text-text-primary font-medium' : 'text-text-secondary hover:text-text-primary cursor-pointer transition-colors',
                                children: crumb
                            }, void 0, false, {
                                fileName: "[project]/components/AppTopBar.tsx",
                                lineNumber: 32,
                                columnNumber: 13
                            }, this)
                        ]
                    }, i, true, {
                        fileName: "[project]/components/AppTopBar.tsx",
                        lineNumber: 30,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/AppTopBar.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1"
            }, void 0, false, {
                fileName: "[project]/components/AppTopBar.tsx",
                lineNumber: 46,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative w-48 lg:w-60",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$search$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Search$3e$__["Search"], {
                        className: "absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-tertiary pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/components/AppTopBar.tsx",
                        lineNumber: 50,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        placeholder: "Search...",
                        value: searchQuery,
                        onChange: (e)=>onSearchChange(e.target.value),
                        className: "w-full h-8 pl-8 pr-3 text-sm bg-canvas border border-border rounded placeholder:text-text-tertiary text-text-primary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/20 transition-all"
                    }, void 0, false, {
                        fileName: "[project]/components/AppTopBar.tsx",
                        lineNumber: 51,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppTopBar.tsx",
                lineNumber: 49,
                columnNumber: 7
            }, this),
            alertCount > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                className: "relative w-8 h-8 flex items-center justify-center rounded border border-border bg-surface hover:bg-canvas transition-colors",
                title: `${alertCount} active conflicts`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$bell$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Bell$3e$__["Bell"], {
                        className: "w-4 h-4 text-text-secondary"
                    }, void 0, false, {
                        fileName: "[project]/components/AppTopBar.tsx",
                        lineNumber: 66,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-white text-2xs font-bold leading-none",
                        children: alertCount
                    }, void 0, false, {
                        fileName: "[project]/components/AppTopBar.tsx",
                        lineNumber: 67,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/AppTopBar.tsx",
                lineNumber: 62,
                columnNumber: 9
            }, this),
            showRunButton && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: onRunEvidenceCheck,
                disabled: isRunningCheck,
                className: "h-8 px-4 rounded bg-accent hover:bg-accent-hover text-white text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shrink-0",
                children: isRunningCheck ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$cw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCw$3e$__["RotateCw"], {
                            className: "w-3.5 h-3.5 animate-spin"
                        }, void 0, false, {
                            fileName: "[project]/components/AppTopBar.tsx",
                            lineNumber: 82,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "hidden sm:inline",
                            children: "Checking…"
                        }, void 0, false, {
                            fileName: "[project]/components/AppTopBar.tsx",
                            lineNumber: 83,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AppTopBar.tsx",
                    lineNumber: 81,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$play$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Play$3e$__["Play"], {
                            className: "w-3.5 h-3.5 fill-white"
                        }, void 0, false, {
                            fileName: "[project]/components/AppTopBar.tsx",
                            lineNumber: 87,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Run Evidence Check"
                        }, void 0, false, {
                            fileName: "[project]/components/AppTopBar.tsx",
                            lineNumber: 88,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/AppTopBar.tsx",
                    lineNumber: 86,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/AppTopBar.tsx",
                lineNumber: 75,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/AppTopBar.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/DetailInspectorModal.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DetailInspectorModal",
    ()=>DetailInspectorModal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/copy.mjs [app-ssr] (ecmascript) <export default as Copy>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.mjs [app-ssr] (ecmascript) <export default as Check>");
'use client';
;
;
;
const DetailInspectorModal = ({ claim, node, onClose })=>{
    const [copied, setCopied] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    const handleCopy = (text)=>{
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(()=>setCopied(false), 1800);
    };
    const title = node ? node.title : `${claim.code}: Security Claim Dossier`;
    const sourceLabel = node ? node.sourceLabel : 'SECURITY QUESTIONNAIRE';
    const pathRef = node ? node.pathOrReference : claim.primarySourcePath;
    const linePageRef = node ? node.lineOrPageRef : claim.linePageRef;
    const status = node ? node.status : claim.status;
    const statusCfg = {
        green: {
            label: 'SUPPORTING',
            cls: 'text-signal-green bg-signal-green-bg border-signal-green-border'
        },
        amber: {
            label: 'AMBIGUOUS',
            cls: 'text-signal-amber bg-signal-amber-bg border-signal-amber-border'
        },
        red: {
            label: 'UNSAFE',
            cls: 'text-signal-red bg-signal-red-bg border-signal-red-border'
        }
    }[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4",
        onClick: onClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-xl bg-surface border border-border rounded shadow-card flex flex-col max-h-[84vh] overflow-hidden text-sm",
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-3.5 border-b border-border shrink-0 bg-canvas",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2.5 min-w-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-mono text-text-tertiary uppercase tracking-wider shrink-0",
                                    children: "Evidence Inspector"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 50,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-text-tertiary",
                                    children: "·"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 53,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-xs font-mono font-semibold text-accent truncate",
                                    children: claim.code
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 54,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `pill ml-1 ${statusCfg.cls}`,
                                    children: statusCfg.label
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 55,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 49,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-2xs font-mono text-signal-amber font-semibold",
                                    children: "DEMO AUDIT TRAIL"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 58,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onClose,
                                    className: "p-1 rounded text-text-tertiary hover:text-text-primary hover:bg-border transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        className: "w-4 h-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/DetailInspectorModal.tsx",
                                        lineNumber: 63,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 59,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 57,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DetailInspectorModal.tsx",
                    lineNumber: 48,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "p-5 overflow-y-auto space-y-5 flex-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pb-4 border-b border-border",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs font-mono text-text-tertiary uppercase mb-1",
                                    children: sourceLabel
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 72,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "text-base font-semibold text-text-primary leading-snug",
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 73,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-xs text-text-tertiary mt-1 font-mono",
                                    children: [
                                        "Last synced: ",
                                        claim.verifiedTimestamp
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 74,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 71,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono",
                                    children: "1. Question in Scope"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 81,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded border border-border bg-canvas text-sm text-text-primary leading-relaxed",
                                    children: claim.question
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 84,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 80,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono",
                                    children: "2. Provenance Source & Coordinates"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 91,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded border border-border bg-surface space-y-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-2xs text-text-tertiary uppercase font-mono",
                                                    children: "Source path"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                                    lineNumber: 96,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>handleCopy(pathRef),
                                                    className: "flex items-center gap-1 text-2xs text-text-secondary hover:text-text-primary transition-colors",
                                                    children: [
                                                        copied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                                            className: "w-3 h-3 text-signal-green"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/DetailInspectorModal.tsx",
                                                            lineNumber: 102,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$copy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Copy$3e$__["Copy"], {
                                                            className: "w-3 h-3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/DetailInspectorModal.tsx",
                                                            lineNumber: 104,
                                                            columnNumber: 21
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        copied ? 'Copied' : 'Copy'
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                                    lineNumber: 97,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/DetailInspectorModal.tsx",
                                            lineNumber: 95,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "bg-canvas rounded border border-border px-3 py-2 font-mono text-xs text-text-primary break-all",
                                            children: pathRef
                                        }, void 0, false, {
                                            fileName: "[project]/components/DetailInspectorModal.tsx",
                                            lineNumber: 109,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between text-xs",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-text-tertiary font-mono text-2xs uppercase",
                                                    children: "Line / page ref"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                                    lineNumber: 113,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-accent font-semibold font-mono",
                                                    children: linePageRef
                                                }, void 0, false, {
                                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                                    lineNumber: 114,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/DetailInspectorModal.tsx",
                                            lineNumber: 112,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 94,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 90,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        node?.snippet && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono",
                                    children: "3. Raw Evidence Citation"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 122,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("pre", {
                                    className: "p-3 rounded border border-border bg-[#1a1a1a] text-[#e5e5e5] font-mono text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap",
                                    children: node.snippet
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 125,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 121,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xs font-semibold uppercase tracking-wider text-text-tertiary font-mono",
                                    children: [
                                        node?.snippet ? '4' : '3',
                                        ". Draft Questionnaire Answer"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 133,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded border border-border bg-canvas text-sm text-text-primary leading-relaxed",
                                    children: claim.vendorDraftAnswer
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 136,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 132,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-1.5",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-2xs font-semibold uppercase tracking-wider text-signal-amber font-mono",
                                    children: [
                                        node?.snippet ? '5' : '4',
                                        ". Scope Limitations & Divergence"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 143,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "p-3 rounded border border-signal-amber-border bg-signal-amber-bg text-sm text-text-primary leading-relaxed",
                                    children: claim.limitations
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 142,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DetailInspectorModal.tsx",
                    lineNumber: 69,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between px-5 py-3 bg-canvas border-t border-border shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 text-xs font-mono text-text-tertiary",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "STATUS:"
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 155,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: `font-semibold ${statusCfg.cls.split(' ')[0]}`,
                                    children: statusCfg.label
                                }, void 0, false, {
                                    fileName: "[project]/components/DetailInspectorModal.tsx",
                                    lineNumber: 156,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: onClose,
                            className: "px-4 py-1.5 rounded bg-text-primary hover:bg-black text-white text-sm font-medium transition-colors",
                            children: "Close"
                        }, void 0, false, {
                            fileName: "[project]/components/DetailInspectorModal.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/DetailInspectorModal.tsx",
                    lineNumber: 153,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, void 0, true, {
            fileName: "[project]/components/DetailInspectorModal.tsx",
            lineNumber: 43,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/DetailInspectorModal.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/components/EvidenceWorkspace.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EvidenceWorkspace",
    ()=>EvidenceWorkspace
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.mjs [app-ssr] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield-check.mjs [app-ssr] (ecmascript) <export default as ShieldCheck>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-in.mjs [app-ssr] (ecmascript) <export default as ZoomIn>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zoom-out.mjs [app-ssr] (ecmascript) <export default as ZoomOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/rotate-ccw.mjs [app-ssr] (ecmascript) <export default as RotateCcw>");
'use client';
;
;
;
const EvidenceWorkspace = ({ claim, selectedNodeId, onSelectNode, layers, onOpenInspector })=>{
    const [zoomLevel, setZoomLevel] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(1);
    const [filterMode, setFilterMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('all');
    const [nodePositions, setNodePositions] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const nodeRefs = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])({});
    // Filter visible nodes based on layer visibility and filterMode
    const visibleNodes = claim.nodes.filter((node)=>{
        if (node.type === 'policy' && !layers.policy) return false;
        if (node.type === 'repository' && !layers.repository) return false;
        if (node.type === 'control' && !layers.controls) return false;
        if (node.type === 'conflict' && !layers.conflicts) return false;
        if (filterMode === 'supporting' && node.status !== 'green') return false;
        if (filterMode === 'conflicts' && node.status === 'green') return false;
        return true;
    });
    const visibleNodeIds = new Set(visibleNodes.map((n)=>n.id));
    // Filter visible links
    const visibleLinks = claim.links.filter((link)=>visibleNodeIds.has(link.sourceId) && visibleNodeIds.has(link.targetId));
    // Group nodes into the 4 columns
    const claimNode = visibleNodes.find((n)=>n.type === 'claim');
    const sourceNodes = visibleNodes.filter((n)=>n.type === 'policy' || n.type === 'repository');
    const controlNode = visibleNodes.find((n)=>n.type === 'control');
    const conflictNode = visibleNodes.find((n)=>n.type === 'conflict');
    // Measure actual node positions inside the container for SVG connectors
    const updatePositions = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        if (!containerRef.current) return;
        const containerRect = containerRef.current.getBoundingClientRect();
        const newPositions = {};
        Object.entries(nodeRefs.current).forEach(([id, el])=>{
            if (el && containerRef.current) {
                const elRect = el.getBoundingClientRect();
                newPositions[id] = {
                    x: elRect.left - containerRect.left,
                    y: elRect.top - containerRect.top,
                    width: elRect.width,
                    height: elRect.height
                };
            }
        });
        setNodePositions(newPositions);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        updatePositions();
        const timer = setTimeout(updatePositions, 50);
        const observer = new ResizeObserver(()=>{
            updatePositions();
        });
        if (containerRef.current) {
            observer.observe(containerRef.current);
        }
        window.addEventListener('resize', updatePositions);
        return ()=>{
            clearTimeout(timer);
            observer.disconnect();
            window.removeEventListener('resize', updatePositions);
        };
    }, [
        claim.id,
        visibleNodes.length,
        zoomLevel,
        updatePositions
    ]);
    // Status badge helper
    const getStatusBadge = (status, text)=>{
        switch(status){
            case 'green':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-mono font-medium shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                            className: "w-2.5 h-2.5 text-emerald-600"
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 128,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: text
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 129,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 127,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'amber':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 text-3xs font-mono font-medium shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                            className: "w-2.5 h-2.5 text-amber-600"
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 135,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: text
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 136,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 134,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
            case 'red':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center space-x-1 px-1.5 py-0.2 rounded bg-red-50 text-red-800 border border-red-200 text-3xs font-mono font-medium shrink-0",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                            className: "w-2.5 h-2.5 text-red-600"
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 142,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: text
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 143,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 141,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    const getNodeIcon = (type)=>{
        switch(type){
            case 'claim':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                    className: "w-3.5 h-3.5 text-console-accent shrink-0"
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 152,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'policy':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                    className: "w-3.5 h-3.5 text-blue-600 shrink-0"
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 154,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'repository':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                    className: "w-3.5 h-3.5 text-purple-600 shrink-0"
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 156,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'control':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShieldCheck$3e$__["ShieldCheck"], {
                    className: "w-3.5 h-3.5 text-emerald-600 shrink-0"
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 158,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
            case 'conflict':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                    className: "w-3.5 h-3.5 text-amber-600 shrink-0"
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 160,
                    columnNumber: 16
                }, ("TURBOPACK compile-time value", void 0));
        }
    };
    // Render individual compact node card
    const renderNodeCard = (node)=>{
        const isSelected = selectedNodeId === node.id;
        const isClaim = node.type === 'claim';
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            ref: (el)=>{
                nodeRefs.current[node.id] = el;
            },
            onClick: ()=>onSelectNode(node),
            className: `bg-white rounded border cursor-pointer transition-all duration-150 relative z-10 flex flex-col justify-between p-2.5 text-left w-full ${isSelected ? 'border-orange-500 ring-2 ring-orange-200 shadow-xs' : 'border-console-border hover:border-console-faint hover:shadow-2xs'} ${isClaim ? 'bg-orange-50/15' : ''}`,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between gap-1 mb-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center space-x-1.5 min-w-0",
                            children: [
                                getNodeIcon(node.type),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-3xs font-mono font-bold uppercase tracking-wider text-console-faint truncate",
                                    children: node.sourceLabel
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 186,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 184,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        getStatusBadge(node.status, node.statusText)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 183,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xs font-semibold text-console-text line-clamp-1 leading-snug",
                    children: node.title
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 194,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "text-3xs font-mono text-console-faint mt-0.5 truncate",
                    children: node.lineOrPageRef
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 199,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0)),
                node.snippet && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-1.5 p-1.5 bg-console-subtle/50 rounded border border-console-border/60 text-3xs font-mono text-console-muted line-clamp-2 leading-relaxed",
                    children: node.snippet
                }, void 0, false, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 205,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0)),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-2 pt-1 border-t border-console-border/70 flex items-center justify-between text-3xs font-mono text-console-faint",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "CLICK TO INSPECT"
                        }, void 0, false, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 212,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-semibold text-console-muted",
                            children: [
                                "CONF: ",
                                node.confidence,
                                "%"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 213,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            ]
        }, node.id, true, {
            fileName: "[project]/components/EvidenceWorkspace.tsx",
            lineNumber: 170,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 flex flex-col bg-console-bg min-w-0 min-h-0 relative select-none overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "h-9 border-b border-console-border bg-console-card px-4 flex items-center justify-between shrink-0 z-20",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-3 truncate",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs font-bold text-console-text uppercase tracking-wider font-mono",
                                        children: "Evidence Workspace"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 226,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-console-faint font-mono text-2xs",
                                        children: "/"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 229,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-2xs font-mono font-bold text-console-accent bg-orange-50 border border-orange-200 px-1.5 py-0.2 rounded",
                                        children: claim.code
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 230,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                lineNumber: 225,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "h-3 w-px bg-console-border hidden md:block"
                            }, void 0, false, {
                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                lineNumber: 235,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "hidden lg:flex items-center space-x-3 text-3xs font-mono text-console-muted",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-console-faint font-semibold uppercase",
                                        children: "LEGEND:"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 239,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-1.5 h-1.5 rounded-full bg-emerald-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 241,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Supporting"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 242,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 240,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-1.5 h-1.5 rounded-full bg-amber-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 245,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Ambiguous / Incomplete"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 246,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 244,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center space-x-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "w-1.5 h-1.5 rounded-full bg-red-500"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 249,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Unsafe Condition"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 250,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 248,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                lineNumber: 238,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center space-x-2 shrink-0",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center bg-console-subtle p-0.5 rounded border border-console-border text-3xs font-mono",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterMode('all'),
                                        className: `px-1.5 py-0.5 rounded transition-colors ${filterMode === 'all' ? 'bg-white text-console-text font-bold shadow-2xs border border-console-border' : 'text-console-muted hover:text-console-text'}`,
                                        children: [
                                            "ALL (",
                                            claim.nodes.length,
                                            ")"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 259,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterMode('supporting'),
                                        className: `px-1.5 py-0.5 rounded transition-colors ${filterMode === 'supporting' ? 'bg-white text-emerald-800 font-bold shadow-2xs border border-console-border' : 'text-console-muted hover:text-console-text'}`,
                                        children: "SUPPORTING"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 269,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setFilterMode('conflicts'),
                                        className: `px-1.5 py-0.5 rounded transition-colors ${filterMode === 'conflicts' ? 'bg-white text-amber-800 font-bold shadow-2xs border border-console-border' : 'text-console-muted hover:text-console-text'}`,
                                        children: "DIVERGENT"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 279,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                lineNumber: 258,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center space-x-0.5 border-l border-console-border pl-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setZoomLevel((z)=>Math.max(0.85, z - 0.05)),
                                        className: "p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle",
                                        title: "Zoom Out",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$out$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomOut$3e$__["ZoomOut"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                                            lineNumber: 298,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 293,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-3xs font-mono text-console-muted w-8 text-center",
                                        children: [
                                            Math.round(zoomLevel * 100),
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 300,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setZoomLevel((z)=>Math.min(1.2, z + 0.05)),
                                        className: "p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle",
                                        title: "Zoom In",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zoom$2d$in$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ZoomIn$3e$__["ZoomIn"], {
                                            className: "w-3 h-3"
                                        }, void 0, false, {
                                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                                            lineNumber: 308,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 303,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setZoomLevel(1),
                                        className: "p-1 rounded text-console-muted hover:text-console-text hover:bg-console-subtle",
                                        title: "Reset Zoom",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$rotate$2d$ccw$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RotateCcw$3e$__["RotateCcw"], {
                                            className: "w-2.5 h-2.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                                            lineNumber: 315,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 310,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                lineNumber: 292,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                        lineNumber: 256,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/EvidenceWorkspace.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 relative overflow-auto map-grid-bg p-4 xl:p-6 flex items-center justify-center min-h-0 min-w-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    ref: containerRef,
                    style: {
                        transform: `scale(${zoomLevel})`
                    },
                    className: "w-full max-w-6xl relative transition-transform duration-150 origin-center my-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                            className: "absolute inset-0 w-full h-full pointer-events-none z-0",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("defs", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                            id: "marker-green",
                                            viewBox: "0 0 8 8",
                                            refX: "6",
                                            refY: "4",
                                            markerWidth: "4",
                                            markerHeight: "4",
                                            orient: "auto-start-reverse",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 0 1 L 7 4 L 0 7 z",
                                                fill: "#15803D"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 340,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                                            lineNumber: 331,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                            id: "marker-amber",
                                            viewBox: "0 0 8 8",
                                            refX: "6",
                                            refY: "4",
                                            markerWidth: "4",
                                            markerHeight: "4",
                                            orient: "auto-start-reverse",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 0 1 L 7 4 L 0 7 z",
                                                fill: "#B45309"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 351,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                                            lineNumber: 342,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("marker", {
                                            id: "marker-red",
                                            viewBox: "0 0 8 8",
                                            refX: "6",
                                            refY: "4",
                                            markerWidth: "4",
                                            markerHeight: "4",
                                            orient: "auto-start-reverse",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: "M 0 1 L 7 4 L 0 7 z",
                                                fill: "#B91C1C"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 330,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                visibleLinks.map((link)=>{
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
                                    const isLinkActive = selectedNodeId === link.sourceId || selectedNodeId === link.targetId;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                        children: [
                                            isLinkActive && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: pathD,
                                                fill: "none",
                                                stroke: "#ea580c",
                                                strokeWidth: "3.5",
                                                strokeOpacity: "0.2"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 400,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                d: pathD,
                                                fill: "none",
                                                stroke: isLinkActive ? '#ea580c' : strokeColor,
                                                strokeWidth: isLinkActive ? '1.8' : '1.2',
                                                strokeDasharray: link.dashed ? '4,4' : undefined,
                                                markerEnd: `url(#${isLinkActive ? 'marker-amber' : markerId})`
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 408,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            link.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("g", {
                                                transform: `translate(${(x1 + x2) / 2}, ${(y1 + y2) / 2 - 8})`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("rect", {
                                                        x: "-30",
                                                        y: "-7",
                                                        width: "60",
                                                        height: "14",
                                                        rx: "2",
                                                        fill: "#ffffff",
                                                        stroke: "#e2e4e8",
                                                        strokeWidth: "1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("text", {
                                                        textAnchor: "middle",
                                                        y: "3",
                                                        fill: "#5b6471",
                                                        fontSize: "7.5",
                                                        fontFamily: "ui-monospace, monospace",
                                                        fontWeight: "600",
                                                        children: link.label.toUpperCase()
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                        lineNumber: 428,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 417,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, link.id, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 398,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0));
                                })
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 329,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-4 gap-4 xl:gap-6 mb-2.5 px-1 relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xs font-mono font-bold uppercase tracking-wider text-console-faint",
                                    children: "01 · Question / Claim"
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xs font-mono font-bold uppercase tracking-wider text-console-faint",
                                    children: "02 · Source Evidence"
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 450,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xs font-mono font-bold uppercase tracking-wider text-console-faint",
                                    children: "03 · Control Check"
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 453,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "text-3xs font-mono font-bold uppercase tracking-wider text-console-faint",
                                    children: "04 · Finding / Decision"
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 456,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 446,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-4 gap-4 xl:gap-6 items-center relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col justify-center",
                                    children: claimNode ? renderNodeCard(claimNode) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 border border-dashed border-console-border rounded text-3xs font-mono text-console-faint text-center",
                                        children: "No claim in scope"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 468,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 464,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col gap-3 justify-center",
                                    children: sourceNodes.length > 0 ? sourceNodes.map((node)=>renderNodeCard(node)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 border border-dashed border-console-border rounded text-3xs font-mono text-console-faint text-center",
                                        children: "Source layers disabled"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 479,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 475,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col justify-center",
                                    children: controlNode ? renderNodeCard(controlNode) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-3 border border-dashed border-console-border rounded text-3xs font-mono text-console-faint text-center",
                                        children: "Controls layer disabled"
                                    }, void 0, false, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 490,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 486,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col justify-center",
                                    children: conflictNode ? renderNodeCard(conflictNode) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded border border-console-border p-3 flex flex-col justify-between text-left",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center justify-between mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-3xs font-mono font-bold uppercase tracking-wider text-emerald-700",
                                                        children: "VERDICT"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                        lineNumber: 503,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "px-1.5 py-0.2 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-3xs font-mono font-medium",
                                                        children: "CLEAN"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                        lineNumber: 506,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 502,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-xs font-semibold text-console-text",
                                                children: "No Direct Divergence"
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 510,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-3xs font-mono text-console-muted mt-1 leading-relaxed",
                                                children: "Source evidence signals match questionnaire scope without active policy contradictions."
                                            }, void 0, false, {
                                                fileName: "[project]/components/EvidenceWorkspace.tsx",
                                                lineNumber: 513,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/EvidenceWorkspace.tsx",
                                        lineNumber: 501,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                                    lineNumber: 497,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/EvidenceWorkspace.tsx",
                            lineNumber: 462,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/EvidenceWorkspace.tsx",
                    lineNumber: 323,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/components/EvidenceWorkspace.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/EvidenceWorkspace.tsx",
        lineNumber: 220,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/components/OverviewDashboard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "OverviewDashboard",
    ()=>OverviewDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-ssr] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-alert.mjs [app-ssr] (ecmascript) <export default as AlertCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-x.mjs [app-ssr] (ecmascript) <export default as XCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-question-mark.mjs [app-ssr] (ecmascript) <export default as HelpCircle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-spreadsheet.mjs [app-ssr] (ecmascript) <export default as FileSpreadsheet>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-text.mjs [app-ssr] (ecmascript) <export default as FileText>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/git-branch.mjs [app-ssr] (ecmascript) <export default as GitBranch>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/triangle-alert.mjs [app-ssr] (ecmascript) <export default as AlertTriangle>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-ssr] (ecmascript) <export default as ArrowRight>");
'use client';
;
;
// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────
function StatusPill({ status }) {
    const cfg = {
        green: {
            cls: 'bg-signal-green-bg text-signal-green border-signal-green-border',
            label: 'SUPPORTING'
        },
        amber: {
            cls: 'bg-signal-amber-bg text-signal-amber border-signal-amber-border',
            label: 'REVIEW'
        },
        red: {
            cls: 'bg-signal-red-bg text-signal-red border-signal-red-border',
            label: 'UNSAFE'
        }
    }[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `pill ${cfg.cls}`,
        children: cfg.label
    }, void 0, false, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 39,
        columnNumber: 5
    }, this);
}
function SeverityBadge({ severity }) {
    const cfg = {
        high: 'bg-signal-red-bg text-signal-red border-signal-red-border',
        medium: 'bg-signal-amber-bg text-signal-amber border-signal-amber-border',
        low: 'bg-canvas text-text-secondary border-border'
    }[severity];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `pill ${cfg}`,
        children: severity.toUpperCase()
    }, void 0, false, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 51,
        columnNumber: 5
    }, this);
}
function MetricCard({ label, value, caption, accent = 'default', icon }) {
    const accentStyles = {
        default: 'text-text-primary',
        green: 'text-signal-green',
        amber: 'text-signal-amber',
        red: 'text-signal-red'
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface border border-border rounded p-5 flex flex-col gap-3 min-w-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-text-secondary font-medium tracking-wide",
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 78,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-text-tertiary",
                        children: icon
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 77,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: `text-3xl font-semibold tracking-tight ${accentStyles[accent]}`,
                        children: value.toLocaleString()
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 82,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-text-tertiary mt-1 leading-snug",
                        children: caption
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 85,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 81,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 76,
        columnNumber: 5
    }, this);
}
function EvidenceCoveragePanel({ green, amber, red, total }) {
    const pGreen = Math.round(green / total * 100);
    const pAmber = Math.round(amber / total * 100);
    const pRed = Math.round(red / total * 100);
    const rows = [
        {
            label: 'Evidence Supported',
            count: green,
            pct: pGreen,
            barCls: 'bg-signal-green',
            dotCls: 'bg-signal-green'
        },
        {
            label: 'Needs Review',
            count: amber,
            pct: pAmber,
            barCls: 'bg-signal-amber',
            dotCls: 'bg-signal-amber'
        },
        {
            label: 'Unsafe / Non-compliant',
            count: red,
            pct: pRed,
            barCls: 'bg-signal-red',
            dotCls: 'bg-signal-red'
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface border border-border rounded flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-5 py-4 border-b border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-sm font-semibold text-text-primary",
                            children: "Evidence Coverage"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 136,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-text-tertiary mt-0.5",
                            children: [
                                "Questionnaire scope — ",
                                total,
                                " questions"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 137,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 135,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 134,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pt-5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex h-3 rounded overflow-hidden gap-0.5",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-signal-green rounded-l transition-all",
                            style: {
                                width: `${pGreen}%`
                            },
                            title: `Supporting: ${green}`
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 144,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-signal-amber transition-all",
                            style: {
                                width: `${pAmber}%`
                            },
                            title: `Needs review: ${amber}`
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 149,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "bg-signal-red rounded-r transition-all",
                            style: {
                                width: `${pRed}%`
                            },
                            title: `Unsafe: ${red}`
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 154,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 143,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 142,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 py-4 flex flex-col gap-4 flex-1",
                children: rows.map((row)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: `w-2 h-2 rounded-full shrink-0 ${row.dotCls}`
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 166,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm text-text-secondary flex-1 min-w-0 truncate",
                                children: row.label
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 167,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-sm font-medium text-text-primary tabular-nums",
                                children: row.count
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 170,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "w-20 bg-canvas rounded-full h-1.5 shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: `h-1.5 rounded-full ${row.barCls}`,
                                    style: {
                                        width: `${row.pct}%`
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 172,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 171,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-xs text-text-tertiary w-8 text-right tabular-nums",
                                children: [
                                    row.pct,
                                    "%"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 177,
                                columnNumber: 13
                            }, this)
                        ]
                    }, row.label, true, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 165,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 163,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-text-tertiary border-t border-border pt-3 leading-relaxed",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-signal-amber",
                            children: "DEMO DATA"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 187,
                            columnNumber: 11
                        }, this),
                        " — Evidence mapping from SIG Lite questionnaire against policy PDF and GitHub repository. Connect real sources to see live analysis."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 186,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 132,
        columnNumber: 5
    }, this);
}
function SourceRow({ icon, name, detail, status, badge }) {
    const statusDot = {
        active: 'bg-signal-green',
        pending: 'bg-signal-amber',
        error: 'bg-signal-red'
    }[status];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex items-center gap-3 py-3 border-b border-border last:border-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-7 h-7 rounded border border-border flex items-center justify-center shrink-0 bg-canvas",
                children: icon
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 215,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "min-w-0 flex-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm font-medium text-text-primary truncate",
                        children: name
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 219,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-xs text-text-tertiary truncate",
                        children: detail
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 220,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: `w-1.5 h-1.5 rounded-full ${statusDot}`
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 223,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-text-secondary",
                        children: badge
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 224,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 222,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 214,
        columnNumber: 5
    }, this);
}
function ReviewSourcesPanel() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface border border-border rounded flex flex-col h-full",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-5 py-4 border-b border-border",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-sm font-semibold text-text-primary",
                            children: "Review Sources"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-text-tertiary mt-0.5",
                            children: "Connected evidence channels"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 236,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 234,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 flex-1 overflow-y-auto",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceRow, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$spreadsheet$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileSpreadsheet$3e$__["FileSpreadsheet"], {
                            className: "w-3.5 h-3.5 text-emerald-600"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 242,
                            columnNumber: 17
                        }, this),
                        name: "SIG Lite Questionnaire",
                        detail: "SIG_Lite_2026_Vendor_Assessment.xlsx",
                        status: "active",
                        badge: "Loaded"
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 241,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceRow, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$text$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__FileText$3e$__["FileText"], {
                            className: "w-3.5 h-3.5 text-blue-600"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 249,
                            columnNumber: 17
                        }, this),
                        name: "Information Security Policy",
                        detail: "Acme_Information_Security_Policy_v3.4.pdf",
                        status: "active",
                        badge: "Parsed"
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SourceRow, {
                        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$git$2d$branch$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__GitBranch$3e$__["GitBranch"], {
                            className: "w-3.5 h-3.5 text-purple-600"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 256,
                            columnNumber: 17
                        }, this),
                        name: "cloud-core (main)",
                        detail: "acme-corp/cloud-core — last synced 12 min ago",
                        status: "active",
                        badge: "Synced"
                    }, void 0, false, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 255,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "px-5 pb-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-xs text-text-tertiary border-t border-border pt-3",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: "font-medium text-signal-amber",
                            children: "DEMO DATA"
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 266,
                            columnNumber: 11
                        }, this),
                        " — Source connections are simulated. Real integrations require backend configuration."
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 265,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 232,
        columnNumber: 5
    }, this);
}
function RecentQuestionsPanel({ claims, selectedClaimId, onSelectClaim, onViewAll }) {
    const preview = claims.slice(0, 5);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface border border-border rounded flex flex-col min-h-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-5 py-4 border-b border-border shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold text-text-primary",
                                children: "Recent Questions"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 297,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-text-tertiary mt-0.5",
                                children: [
                                    claims.length,
                                    " questions in scope"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 298,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 296,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onViewAll,
                        className: "text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1 transition-colors",
                        children: [
                            "View all",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 305,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 300,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 295,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "overflow-y-auto flex-1 min-h-0",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                    className: "w-full border-collapse",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                            className: "sticky top-0 bg-surface z-10",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                className: "border-b border-border",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "text-left px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-text-tertiary",
                                        children: "ID"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 314,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "text-left px-3 py-2.5 text-2xs font-semibold uppercase tracking-wider text-text-tertiary",
                                        children: "Question"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "text-left px-3 py-2.5 text-2xs font-semibold uppercase tracking-wider text-text-tertiary hidden md:table-cell",
                                        children: "Category"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 316,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "text-left px-3 py-2.5 text-2xs font-semibold uppercase tracking-wider text-text-tertiary hidden lg:table-cell",
                                        children: "Evidence"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 317,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                        className: "text-right px-5 py-2.5 text-2xs font-semibold uppercase tracking-wider text-text-tertiary",
                                        children: "Status"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 312,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                            children: preview.map((claim)=>{
                                const isSelected = claim.id === selectedClaimId;
                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    onClick: ()=>onSelectClaim(claim),
                                    className: `border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-accent-bg' : 'hover:bg-canvas'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-5 py-3",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `text-xs font-mono font-semibold ${isSelected ? 'text-accent' : 'text-text-primary'}`,
                                                children: claim.code
                                            }, void 0, false, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 335,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 334,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-3 max-w-[260px]",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-text-primary truncate leading-snug",
                                                children: claim.question
                                            }, void 0, false, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 344,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 343,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-3 hidden md:table-cell",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs text-text-tertiary truncate block max-w-[140px]",
                                                children: claim.category
                                            }, void 0, false, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 347,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 346,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-3 py-3 hidden lg:table-cell",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-mono text-text-secondary",
                                                children: [
                                                    claim.signalsCount.supporting,
                                                    "✓",
                                                    ' ',
                                                    claim.signalsCount.conflicting > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-signal-red",
                                                        children: [
                                                            claim.signalsCount.conflicting,
                                                            "!"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                                        lineNumber: 355,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 352,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 351,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                            className: "px-5 py-3 text-right",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusPill, {
                                                status: claim.status
                                            }, void 0, false, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 360,
                                                columnNumber: 21
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 359,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, claim.id, true, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 325,
                                    columnNumber: 17
                                }, this);
                            })
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 321,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 311,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 310,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 293,
        columnNumber: 5
    }, this);
}
function ActiveFindingsPanel({ conflicts, onSelectConflict, onViewAll }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "bg-surface border border-border rounded flex flex-col min-h-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between px-5 py-4 border-b border-border shrink-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                className: "text-sm font-semibold text-text-primary",
                                children: "Active Findings"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-text-tertiary mt-0.5",
                                children: [
                                    conflicts.length,
                                    " findings detected (distinct entities)"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 388,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, this),
                    onViewAll && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: onViewAll,
                        className: "text-xs text-accent hover:text-accent-hover font-medium flex items-center gap-1 transition-colors",
                        children: [
                            "View all",
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                className: "w-3 h-3"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 396,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 391,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 385,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-y-auto min-h-0",
                children: conflicts.map((conflict, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        onClick: ()=>onSelectConflict(conflict),
                        className: `px-5 py-3.5 cursor-pointer hover:bg-canvas transition-colors ${idx < conflicts.length - 1 ? 'border-b border-border' : ''}`,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-start justify-between gap-3 mb-1.5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2 min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-mono font-semibold text-accent shrink-0",
                                                children: conflict.claimCode
                                            }, void 0, false, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 412,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: "text-sm font-medium text-text-primary truncate",
                                                children: conflict.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/OverviewDashboard.tsx",
                                                lineNumber: 415,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 411,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(SeverityBadge, {
                                        severity: conflict.severity
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 419,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 410,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2 text-xs text-text-tertiary",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: conflict.sourceA.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 423,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                        className: "w-3 h-3 shrink-0"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 424,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "truncate",
                                        children: conflict.sourceB.label
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 425,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 422,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-2xs text-text-tertiary mt-1 font-mono",
                                children: conflict.detectedAt
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 428,
                                columnNumber: 13
                            }, this)
                        ]
                    }, conflict.id, true, {
                        fileName: "[project]/components/OverviewDashboard.tsx",
                        lineNumber: 403,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/OverviewDashboard.tsx",
                lineNumber: 401,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 384,
        columnNumber: 5
    }, this);
}
function OverviewDashboard({ claims, conflicts, selectedClaimId, onSelectClaim, onSelectConflict, onViewAllQuestions, onViewAllFindings, onNavigateToReview, onNavigateToExports }) {
    // Aggregate from authoritative source
    const total = claims.length;
    const greenCount = claims.filter((c)=>c.status === 'green').length;
    const amberCount = claims.filter((c)=>c.status === 'amber').length;
    const redCount = claims.filter((c)=>c.status === 'red').length;
    const activeFindingsCount = conflicts.length;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex-1 overflow-y-auto min-h-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "px-6 py-6 max-w-[1440px] mx-auto space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    className: "text-xl font-semibold text-text-primary",
                                    children: "Review Overview"
                                }, void 0, false, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 477,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-text-secondary mt-0.5",
                                    children: "Evidence-grounded security questionnaire verification across policies and GitHub repositories."
                                }, void 0, false, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 478,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 476,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "text-2xs font-mono font-medium text-signal-amber bg-signal-amber-bg border border-signal-amber-border px-2.5 py-1 rounded",
                                children: "WORKSPACE: ACME CORP · SOC 2 2026"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 483,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 482,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 475,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-surface border border-border rounded p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-start sm:items-center gap-3",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 rounded bg-accent-bg border border-accent-border flex items-center justify-center shrink-0 mt-0.5 sm:mt-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$triangle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertTriangle$3e$__["AlertTriangle"], {
                                        className: "w-4 h-4 text-accent"
                                    }, void 0, false, {
                                        fileName: "[project]/components/OverviewDashboard.tsx",
                                        lineNumber: 493,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 492,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-xs font-semibold text-text-primary",
                                            children: "Unresolved Findings Detected: 1 Unsafe Condition & 2 Ambiguous Questions"
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 496,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-2xs text-text-secondary mt-0.5",
                                            children: "Suggested next step: Investigate the WAF ingress discrepancy in Findings before workbook export."
                                        }, void 0, false, {
                                            fileName: "[project]/components/OverviewDashboard.tsx",
                                            lineNumber: 499,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 495,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 491,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex items-center gap-2 shrink-0",
                            children: [
                                onViewAllFindings && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onViewAllFindings,
                                    className: "px-3 py-1.5 text-xs font-medium text-white bg-accent hover:bg-accent-hover rounded transition-colors shadow-xs",
                                    children: [
                                        "Review Findings (",
                                        activeFindingsCount,
                                        ")"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 507,
                                    columnNumber: 15
                                }, this),
                                onNavigateToReview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: onNavigateToReview,
                                    className: "px-3 py-1.5 text-xs font-medium text-text-primary border border-border rounded hover:bg-canvas transition-colors",
                                    children: "Inspect Pipeline"
                                }, void 0, false, {
                                    fileName: "[project]/components/OverviewDashboard.tsx",
                                    lineNumber: 515,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 505,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 490,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-2 xl:grid-cols-4 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                            label: "Total Questions",
                            value: total,
                            caption: "Questionnaire controls in scope",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$question$2d$mark$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__HelpCircle$3e$__["HelpCircle"], {
                                className: "w-4 h-4"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 531,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 527,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                            label: "Evidence Supported",
                            value: greenCount,
                            caption: "Questions with supporting signals found",
                            accent: "green",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                className: "w-4 h-4 text-signal-green"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 538,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 533,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                            label: "Needs Review",
                            value: amberCount,
                            caption: "Incomplete or ambiguous evidence",
                            accent: "amber",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$alert$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__AlertCircle$3e$__["AlertCircle"], {
                                className: "w-4 h-4 text-signal-amber"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 545,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 540,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricCard, {
                            label: "Active Findings",
                            value: activeFindingsCount,
                            caption: "Policy/code discrepancies detected",
                            accent: "red",
                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$x$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__XCircle$3e$__["XCircle"], {
                                className: "w-4 h-4 text-signal-red"
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 552,
                                columnNumber: 19
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 547,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 526,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-5 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(EvidenceCoveragePanel, {
                                green: greenCount,
                                amber: amberCount,
                                red: redCount,
                                total: total
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 559,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 558,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ReviewSourcesPanel, {}, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 567,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 566,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 557,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 lg:grid-cols-5 gap-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-3",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RecentQuestionsPanel, {
                                claims: claims,
                                selectedClaimId: selectedClaimId,
                                onSelectClaim: onSelectClaim,
                                onViewAll: onViewAllQuestions
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 574,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 573,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(ActiveFindingsPanel, {
                                conflicts: conflicts,
                                onSelectConflict: onSelectConflict,
                                onViewAll: onViewAllFindings
                            }, void 0, false, {
                                fileName: "[project]/components/OverviewDashboard.tsx",
                                lineNumber: 582,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/OverviewDashboard.tsx",
                            lineNumber: 581,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 572,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-4"
                }, void 0, false, {
                    fileName: "[project]/components/OverviewDashboard.tsx",
                    lineNumber: 591,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/OverviewDashboard.tsx",
            lineNumber: 472,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/OverviewDashboard.tsx",
        lineNumber: 471,
        columnNumber: 5
    }, this);
}
}),
"[project]/data/demoData.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEMO_CLAIMS",
    ()=>DEMO_CLAIMS,
    "DEMO_CONFLICTS",
    ()=>DEMO_CONFLICTS,
    "deriveMetrics",
    ()=>deriveMetrics
]);
function deriveMetrics(claims, conflicts) {
    const total = claims.length;
    const supported = claims.filter((c)=>c.status === 'green').length;
    const needsReview = claims.filter((c)=>c.status === 'amber').length;
    const unsafe = claims.filter((c)=>c.status === 'red').length;
    const activeFindings = conflicts.length;
    return {
        total,
        supported,
        needsReview,
        unsafe,
        activeFindings
    };
}
const DEMO_CLAIMS = [
    {
        id: 'claim-1',
        code: 'SEC-104',
        category: 'Data Protection & Encryption',
        question: 'Are production database backups and storage volumes encrypted at rest with customer-managed keys (CMK)?',
        vendorDraftAnswer: 'Yes. All production RDS clusters, Aurora replicas, and EBS volumes enforce AES-256 KMS envelope encryption using dedicated Customer Managed Keys with automatic rotation.',
        status: 'amber',
        statusDetail: 'Incomplete evidence: storage encrypted, but default AWS managed key found instead of CMK',
        limitations: 'Inspected GitHub terraform manifests confirm storage_encrypted=true, but kms_key_id references aws_kms_alias.rds default key rather than customer-managed key required by SecOps Policy §7.4.2.',
        primarySourcePath: 'infra/terraform/modules/rds/main.tf',
        linePageRef: 'Lines 64–88',
        verifiedTimestamp: '2026-10-23 20:14:02 UTC',
        signalsCount: {
            supporting: 2,
            conflicting: 1,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-1',
                type: 'claim',
                title: 'SEC-104: Production Encryption at Rest',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 104, Sheet "Cryptographic Controls"',
                snippet: 'Are all production data stores encrypted at rest using dedicated CMK keys?',
                status: 'amber',
                statusText: 'Under Review',
                confidence: 84,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-1',
                type: 'policy',
                title: 'SecOps Policy: Data Storage Standards',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 28, Section 7.4.2 ("KMS Envelope Encryption")',
                snippet: '§7.4.2: All database instances, Aurora clusters and snapshots must enforce KMS envelope encryption with annual customer-managed key (CMK) rotation enabled.',
                status: 'green',
                statusText: 'Policy Verified',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-1',
                type: 'repository',
                title: 'Terraform RDS Module Config',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/rds/main.tf',
                lineOrPageRef: 'Lines 64–88 (commit 8f9b4c2)',
                snippet: 'storage_encrypted = true\nkms_key_id = data.aws_kms_alias.rds_default.arn # WARN: using default aws/rds',
                status: 'amber',
                statusText: 'Default Key Divergence',
                confidence: 76,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-1',
                type: 'control',
                title: 'AWS CIS Benchmark 2.3.1 (RDS CMK Check)',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'SecurityHub / CIS AWS Foundations v1.4.0',
                lineOrPageRef: 'Rule CIS-2.3.1 (Finding ID: arn:aws:securityhub:.../finding-982)',
                snippet: 'EVALUATION: PASS (Encrypted at rest: YES) | RECOMMENDATION: Replace default AWS managed KMS key with dedicated customer CMK key.',
                status: 'green',
                statusText: 'Control Pass (Warning)',
                confidence: 91,
                x: 0,
                y: 0
            },
            {
                id: 'node-conflict-1',
                type: 'conflict',
                title: 'Discrepancy: CMK vs Default AWS KMS',
                sourceLabel: 'PROVENANCE CONFLICT',
                pathOrReference: 'Divergence: Policy §7.4.2 vs main.tf:L71',
                lineOrPageRef: 'SecOps PDF p.28 vs rds/main.tf:71',
                snippet: 'Vendor questionnaire states dedicated CMK is used, but Terraform provisioner specifies default alias/aws/rds managed key.',
                status: 'amber',
                statusText: 'Active Conflict',
                confidence: 94,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l1',
                sourceId: 'node-claim-1',
                targetId: 'node-policy-1',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l2',
                sourceId: 'node-claim-1',
                targetId: 'node-repo-1',
                status: 'amber',
                label: 'Implementation'
            },
            {
                id: 'l3',
                sourceId: 'node-claim-1',
                targetId: 'node-control-1',
                status: 'green',
                label: 'Control Check'
            },
            {
                id: 'l4',
                sourceId: 'node-repo-1',
                targetId: 'node-conflict-1',
                status: 'amber',
                label: 'Divergence',
                dashed: true
            }
        ]
    },
    {
        id: 'claim-2',
        code: 'IAM-201',
        category: 'Identity & Access Management',
        question: 'Is multi-factor authentication (MFA) strictly enforced for all administrative and console access?',
        vendorDraftAnswer: 'Yes. All administrative access to the AWS Management Console and CLI requires FIDO2 WebAuthn or TOTP hardware keys enforced via strict IAM deny policies.',
        status: 'green',
        statusDetail: 'Supporting signals found across policy, IAM repository manifests, and CIS benchmarks',
        limitations: 'Audit confirmed for production AWS accounts; break-glass emergency role uses sealed credential safe.',
        primarySourcePath: 'infra/terraform/modules/iam/mfa_enforcement.tf',
        linePageRef: 'Lines 12–54',
        verifiedTimestamp: '2026-10-23 19:48:15 UTC',
        signalsCount: {
            supporting: 3,
            conflicting: 0,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-2',
                type: 'claim',
                title: 'IAM-201: Mandatory MFA Policy',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 48, Sheet "IAM Controls"',
                snippet: 'Are administrative console and API sessions protected by MFA unconditionally?',
                status: 'green',
                statusText: 'Verified',
                confidence: 99,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-2',
                type: 'policy',
                title: 'Access Control & Authentication Policy',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 14, Section 3.1.2 ("Privileged MFA")',
                snippet: '§3.1.2: Multi-Factor Authentication is required for all administrative roles. Sessions lacking MFA are denied all STS AssumeRole calls.',
                status: 'green',
                statusText: 'Policy Requirement',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-2',
                type: 'repository',
                title: 'IAM MFA Deny Policy Manifest',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/iam/mfa_enforcement.tf',
                lineOrPageRef: 'Lines 12–54 (commit e4a710b)',
                snippet: 'Condition = { BoolIfExists = { "aws:MultiFactorAuthPresent": "false" } }, Effect = "Deny"',
                status: 'green',
                statusText: 'Code Implemented',
                confidence: 97,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-2',
                type: 'control',
                title: 'SOC 2 CC6.1 / AWS CIS Benchmark 1.5',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'AWS IAM Credential Report & SecurityHub',
                lineOrPageRef: 'Account: 948102948120 (100% MFA compliance)',
                snippet: 'Root MFA: ACTIVE (Virtual TOTP) | IAM Users: 0 active without MFA | Session duration: 3600s',
                status: 'green',
                statusText: 'Verified Compliant',
                confidence: 99,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l2-1',
                sourceId: 'node-claim-2',
                targetId: 'node-policy-2',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l2-2',
                sourceId: 'node-claim-2',
                targetId: 'node-repo-2',
                status: 'green',
                label: 'Implementation'
            },
            {
                id: 'l2-3',
                sourceId: 'node-claim-2',
                targetId: 'node-control-2',
                status: 'green',
                label: 'Control Check'
            }
        ]
    },
    {
        id: 'claim-3',
        code: 'NET-310',
        category: 'Network & Perimeter Security',
        question: 'Are public ingress routes to internal microservices restricted through a certified WAF and zero-trust gateway?',
        vendorDraftAnswer: 'Yes. All external HTTP/S endpoints terminate at Cloudflare Enterprise with rate limiting, OWASP ModSecurity rule sets, and AWS WAF token inspection.',
        status: 'red',
        statusDetail: 'Unsafe condition: Ingress manifest exposes public port 8080 without WAF association or TLS termination',
        limitations: 'Checkov and Kubeval scans flagged Kubernetes manifest k8s/ingress/public-ingress.yaml missing waf-acl-arn annotation and exposing raw TCP.',
        primarySourcePath: 'k8s/ingress/public-ingress.yaml',
        linePageRef: 'Lines 15–32',
        verifiedTimestamp: '2026-10-23 18:22:10 UTC',
        signalsCount: {
            supporting: 1,
            conflicting: 2,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-3',
                type: 'claim',
                title: 'NET-310: Web Application Firewall Ingress',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 76, Sheet "Network Defense"',
                snippet: 'Are all external endpoints shielded behind WAF protection with rate limiting enabled?',
                status: 'red',
                statusText: 'Violated',
                confidence: 92,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-3',
                type: 'policy',
                title: 'Perimeter Security Standard',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 44, Section 11.1 ("WAF Ingress Rule")',
                snippet: '§11.1: No public load balancer or ingress controller may be provisioned without attached AWS WAF v2 WebACL enforcing OWASP Top 10 rulesets.',
                status: 'green',
                statusText: 'Policy Mandate',
                confidence: 96,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-3',
                type: 'repository',
                title: 'Kubernetes Ingress Definition',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:k8s/ingress/public-ingress.yaml',
                lineOrPageRef: 'Lines 15–32 (commit c3781aa)',
                snippet: 'apiVersion: networking.k8s.io/v1\nkind: Ingress\nmetadata:\n  annotations:\n    # MISSING: alb.ingress.kubernetes.io/waf-acl-arn',
                status: 'red',
                statusText: 'Unsafe Ingress Config',
                confidence: 95,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-3',
                type: 'control',
                title: 'Static Security Analysis (Checkov CKV_AWS_150)',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'Bridgecrew / Checkov Policy Run #4910',
                lineOrPageRef: 'Check ID: CKV_AWS_150 (ALB WAF association)',
                snippet: 'FAILED: Target Load Balancer k8s-public-alb does not have an active WAF WebACL attachment.',
                status: 'red',
                statusText: 'Automated Test Failure',
                confidence: 99,
                x: 0,
                y: 0
            },
            {
                id: 'node-conflict-3',
                type: 'conflict',
                title: 'Direct Exposure Violation',
                sourceLabel: 'PROVENANCE CONFLICT',
                pathOrReference: 'Policy §11.1 vs public-ingress.yaml',
                lineOrPageRef: 'WAF Annotation absent in repo config',
                snippet: 'Vendor claimed all services have WAF, but production ingress controller is operating without WebACL filter.',
                status: 'red',
                statusText: 'Critical Exposure',
                confidence: 98,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l3-1',
                sourceId: 'node-claim-3',
                targetId: 'node-policy-3',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l3-2',
                sourceId: 'node-claim-3',
                targetId: 'node-repo-3',
                status: 'red',
                label: 'Non-Compliant'
            },
            {
                id: 'l3-3',
                sourceId: 'node-claim-3',
                targetId: 'node-control-3',
                status: 'red',
                label: 'Check Failed'
            },
            {
                id: 'l3-4',
                sourceId: 'node-repo-3',
                targetId: 'node-conflict-3',
                status: 'red',
                label: 'Bypass Alert',
                dashed: true
            }
        ]
    },
    {
        id: 'claim-4',
        code: 'LOG-405',
        category: 'Logging & Audit Trails',
        question: 'Are immutable audit logs preserved for a minimum retention duration of 365 days in a tamper-evident bucket?',
        vendorDraftAnswer: 'Yes. AWS CloudTrail and VPC flow logs are forwarded to a dedicated isolated security log bucket with S3 Object Lock enabled in Compliance Mode for 365 days.',
        status: 'green',
        statusDetail: 'Full provenance verified across S3 Object Lock configuration, retention policies, and AWS Config',
        limitations: 'Lifecycle rule transitions objects to Glacier Instant Retrieval after 90 days.',
        primarySourcePath: 'infra/terraform/modules/security_bucket/main.tf',
        linePageRef: 'Lines 30–55',
        verifiedTimestamp: '2026-10-23 17:05:40 UTC',
        signalsCount: {
            supporting: 3,
            conflicting: 0,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-4',
                type: 'claim',
                title: 'LOG-405: Immutable 365-Day Log Retention',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 120, Sheet "Logging & Monitoring"',
                snippet: 'Are central security logs protected against tampering and retained for 365 days?',
                status: 'green',
                statusText: 'Verified',
                confidence: 96,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-4',
                type: 'policy',
                title: 'Audit Logging & Retention Policy',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 36, Section 9.2 ("Log Immutability")',
                snippet: '§9.2: Production audit logs must be retained for 365 days in WORM compliant storage with deletion prevention.',
                status: 'green',
                statusText: 'Policy Confirmed',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-4',
                type: 'repository',
                title: 'Terraform S3 Object Lock Config',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:infra/terraform/modules/security_bucket/main.tf',
                lineOrPageRef: 'Lines 30–55 (commit 6d82ea1)',
                snippet: 'object_lock_configuration {\n  rule {\n    default_retention {\n      mode = "COMPLIANCE"\n      days = 365\n    }\n  }\n}',
                status: 'green',
                statusText: 'Compliant HCL',
                confidence: 97,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-4',
                type: 'control',
                title: 'AWS Config Rule: s3-bucket-object-lock-enabled',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'AWS Config Compliance Dashboard',
                lineOrPageRef: 'Compliance Rule ID: AWS_CONFIG_RULE_S3_LOCK',
                snippet: 'Status: COMPLIANT for bucket acme-secops-audit-logs-production-us-east-1.',
                status: 'green',
                statusText: 'Passing Audit',
                confidence: 99,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l4-1',
                sourceId: 'node-claim-4',
                targetId: 'node-policy-4',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l4-2',
                sourceId: 'node-claim-4',
                targetId: 'node-repo-4',
                status: 'green',
                label: 'Implementation'
            },
            {
                id: 'l4-3',
                sourceId: 'node-claim-4',
                targetId: 'node-control-4',
                status: 'green',
                label: 'Control Check'
            }
        ]
    },
    {
        id: 'claim-5',
        code: 'CICD-512',
        category: 'Application Security & SDLC',
        question: 'Are production releases gated by mandatory peer reviews from at least two codeowners and signed commits?',
        vendorDraftAnswer: 'Yes. GitHub branch protection rules require two senior engineering approvals, mandatory CI passing checks, and verified GPG commit signatures before merging.',
        status: 'amber',
        statusDetail: 'Ambiguous: branch protection ruleset requires 1 approval instead of 2 specified in policy',
        limitations: 'Branch ruleset for `main` requires 1 review; CODEOWNERS file is configured but approval count is set to 1.',
        primarySourcePath: '.github/branch-protections.json',
        linePageRef: 'Lines 8–24',
        verifiedTimestamp: '2026-10-23 16:30:00 UTC',
        signalsCount: {
            supporting: 2,
            conflicting: 1,
            pending: 0
        },
        nodes: [
            {
                id: 'node-claim-5',
                type: 'claim',
                title: 'CICD-512: Branch Protections & 2 Reviews',
                sourceLabel: 'QUESTIONNAIRE (XLSX)',
                pathOrReference: 'SIG_Lite_2026_Vendor_Assessment.xlsx',
                lineOrPageRef: 'Row 142, Sheet "SDLC Security"',
                snippet: 'Are production branch merges protected by minimum 2 independent code reviews?',
                status: 'amber',
                statusText: 'Threshold Divergence',
                confidence: 88,
                x: 0,
                y: 0
            },
            {
                id: 'node-policy-5',
                type: 'policy',
                title: 'Secure Software Development Lifecycle Policy',
                sourceLabel: 'POLICY DOCUMENT (PDF)',
                pathOrReference: 'Acme_Information_Security_Policy_v3.4.pdf',
                lineOrPageRef: 'Page 18, Section 5.2 ("Peer Code Review")',
                snippet: '§5.2: Any change targeting production branches requires minimum two (2) authorized peer reviews and verified commit signatures.',
                status: 'green',
                statusText: 'Policy Standard',
                confidence: 98,
                x: 0,
                y: 0
            },
            {
                id: 'node-repo-5',
                type: 'repository',
                title: 'GitHub Branch Protection JSON',
                sourceLabel: 'GITHUB REPOSITORY',
                pathOrReference: 'acme-corp/cloud-core:.github/branch-protections.json',
                lineOrPageRef: 'Lines 8–24 (commit 7a19ef4)',
                snippet: '"required_pull_request_reviews": {\n  "dismiss_stale_reviews": true,\n  "required_approving_review_count": 1 // EXPECTED 2\n}',
                status: 'amber',
                statusText: 'Threshold Mismatch (1 vs 2)',
                confidence: 85,
                x: 0,
                y: 0
            },
            {
                id: 'node-control-5',
                type: 'control',
                title: 'GitHub Organization Ruleset Verification',
                sourceLabel: 'AUTOMATED CONTROL AUDIT',
                pathOrReference: 'GitHub REST API /repos/rules/branches/main',
                lineOrPageRef: 'Ruleset ID: 88129 (Signed Commits: True, Reviews: 1)',
                snippet: 'Signed commits: ENFORCED | Dismiss stale reviews: TRUE | Required reviews: 1 of 2 required by policy.',
                status: 'amber',
                statusText: 'Partial Compliance',
                confidence: 90,
                x: 0,
                y: 0
            },
            {
                id: 'node-conflict-5',
                type: 'conflict',
                title: 'Approval Count Discrepancy',
                sourceLabel: 'PROVENANCE CONFLICT',
                pathOrReference: 'SDLC Policy §5.2 vs branch-protections.json',
                lineOrPageRef: 'Policy mandates 2 reviews; repo config enforces 1',
                snippet: 'Questionnaire claims 2 peer reviews are enforced, but repo branch protection allows single-reviewer approval merge.',
                status: 'amber',
                statusText: 'Review Threshold Gap',
                confidence: 92,
                x: 0,
                y: 0
            }
        ],
        links: [
            {
                id: 'l5-1',
                sourceId: 'node-claim-5',
                targetId: 'node-policy-5',
                status: 'green',
                label: 'Policy Mandate'
            },
            {
                id: 'l5-2',
                sourceId: 'node-claim-5',
                targetId: 'node-repo-5',
                status: 'amber',
                label: '1 Review Only'
            },
            {
                id: 'l5-3',
                sourceId: 'node-claim-5',
                targetId: 'node-control-5',
                status: 'amber',
                label: 'Ruleset Output'
            },
            {
                id: 'l5-4',
                sourceId: 'node-repo-5',
                targetId: 'node-conflict-5',
                status: 'amber',
                label: 'Gap Detected',
                dashed: true
            }
        ]
    }
];
const DEMO_CONFLICTS = [
    {
        id: 'conf-1',
        claimCode: 'SEC-104',
        title: 'Customer Managed Key (CMK) vs Default aws/rds KMS Key',
        severity: 'medium',
        sourceA: {
            type: 'policy',
            label: 'SecOps Policy v3.4',
            ref: 'Page 28, §7.4.2',
            statement: 'Mandatory dedicated customer-managed key (CMK) with annual rotation for all RDS clusters.'
        },
        sourceB: {
            type: 'repo',
            label: 'infra/rds/main.tf',
            ref: 'Line 71 (commit 8f9b4c2)',
            statement: 'kms_key_id references default data.aws_kms_alias.rds_default.arn instead of custom CMK.'
        },
        detectedAt: '12m ago'
    },
    {
        id: 'conf-2',
        claimCode: 'NET-310',
        title: 'Public K8s Ingress Lacks AWS WAF Association',
        severity: 'high',
        sourceA: {
            type: 'questionnaire',
            label: 'SIG Lite Row 76',
            ref: 'Network Defense §11',
            statement: 'Vendor certified 100% of ingress points pass through OWASP-compliant WAF filters.'
        },
        sourceB: {
            type: 'repo',
            label: 'k8s/public-ingress.yaml',
            ref: 'Lines 15–32 (commit c3781aa)',
            statement: 'Ingress annotation alb.ingress.kubernetes.io/waf-acl-arn is omitted; traffic uninspected.'
        },
        detectedAt: '28m ago'
    },
    {
        id: 'conf-3',
        claimCode: 'CICD-512',
        title: 'Branch Review Threshold (1 Required vs 2 Mandated)',
        severity: 'low',
        sourceA: {
            type: 'policy',
            label: 'SDLC Policy §5.2',
            ref: 'Page 18, Section 5.2',
            statement: 'Two independent codeowner approvals mandatory for all production merges.'
        },
        sourceB: {
            type: 'control',
            label: 'GitHub Ruleset 88129',
            ref: 'branch-protections.json:L12',
            statement: 'Active branch protection enforces required_approving_review_count = 1.'
        },
        detectedAt: '1h 14m ago'
    }
];
}),
];})()

//# sourceMappingURL=_0-xe2wrdi20g-._.js.map