
"use client";

import { useEffect, useRef, useState } from "react";

import {
    ArrowLeft,
    ChevronDown,
    GitBranch,
    History,
    Images,
    Layers3,
    LoaderCircle,
    PanelRight,
    Settings2,
    Sparkles,
    X,
} from "lucide-react";

import CanvasBoard from "@/components/canvas/CanvasBoard";
import ComparisonControls from "@/components/comparison/ComparisonControls";
import ComparisonModal from "@/components/comparison/ComparisonModal";
import BranchHistoryPanel from "@/components/history/BranchHistoryPanel";
import BranchGenerationModal from "@/components/generation/BranchGenerationModal";
import LineageBreadcrumbs from "@/components/navigation/LineageBreadcrumbs";
import NodeNavigationControls from "@/components/navigation/NodeNavigationControls";

import { useComparison } from "@/hooks/useComparison";

import {
    initialCanvasState,
    initialNodes,
    initialProject,
} from "@/data/initial-project";

import { createBranchNode } from "@/lib/branch-utils";
import { getNodeById } from "@/lib/canvas-utils";

// --------------------------------------------------
// Navigation Configuration
// --------------------------------------------------

const navigationItems = [
    { label: "Explore", icon: GitBranch, active: true },
    { label: "Assets", icon: Images, active: false },
    { label: "History", icon: History, active: false },
    { label: "Layers", icon: Layers3, active: false },
];

// --------------------------------------------------
// Canvas Shell
// --------------------------------------------------

const CanvasShell = () => {
    // Graph state
    const [nodes, setNodes] = useState(initialNodes);
    const nodesRef = useRef(initialNodes);

    // Selection state
    const [selectedNodeId, setSelectedNodeId] = useState(
        initialCanvasState.selectedNodeId
    );

    // Canvas focus
    const [focusNodeRequest, setFocusNodeRequest] = useState(null);

    // Responsive Inspector
    const [isInspectorOpen, setIsInspectorOpen] = useState(false);
    const inspectorCloseButtonRef = useRef(null);
    const inspectorToggleButtonRef = useRef(null);

    // Generation state
    const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
    const [branchParentId, setBranchParentId] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationError, setGenerationError] = useState("");

    const generationLockRef = useRef(false);
    const mountedRef = useRef(false);
    const generationTimerRef = useRef(null);

    // Comparison state
    const comparison = useComparison(nodes);

    // Derived nodes
    const selectedNode = getNodeById(nodes, selectedNodeId);
    const branchParentNode = getNodeById(nodes, branchParentId);

    // --------------------------------------------------
    // Lifecycle
    // --------------------------------------------------

    useEffect(() => {
        mountedRef.current = true;

        return () => {
            mountedRef.current = false;

            if (generationTimerRef.current !== null) {
                clearTimeout(generationTimerRef.current);
                generationTimerRef.current = null;
            }
        };
    }, []);

    // --------------------------------------------------
    // Node Navigation
    // --------------------------------------------------

    function handleNavigateToNode(nodeId) {
        const targetNode = getNodeById(nodesRef.current, nodeId);

        if (!targetNode) return;

        setSelectedNodeId(targetNode.id);

        setFocusNodeRequest({
            nodeId: targetNode.id,
            requestId: crypto.randomUUID(),
        });
    }

    // --------------------------------------------------
    // Inspector
    // --------------------------------------------------

    function handleOpenInspector() {
        setIsInspectorOpen(true);

        requestAnimationFrame(() => {
            inspectorCloseButtonRef.current?.focus();
        });
    }

    function handleCloseInspector() {
        setIsInspectorOpen(false);
        inspectorToggleButtonRef.current?.focus();
    }

    // --------------------------------------------------
    // Branch Modal
    // --------------------------------------------------

    function handleOpenBranchModal() {
        if (!selectedNode || generationLockRef.current) {
            return;
        }

        setBranchParentId(selectedNode.id);
        setGenerationError("");
        setIsBranchModalOpen(true);
    }

    function handleCloseBranchModal() {
        if (generationLockRef.current) {
            return;
        }

        setIsBranchModalOpen(false);
        setBranchParentId(null);
        setGenerationError("");
    }

    // --------------------------------------------------
    // Branch Generation
    // --------------------------------------------------

    async function handleGenerateBranch(payload) {
        if (generationLockRef.current) return;

        const parentId = branchParentId;
        const parentNode = getNodeById(nodesRef.current, parentId);

        if (!parentNode) {
            setGenerationError(
                "The parent concept is no longer available."
            );
            return;
        }

        if (
            !payload ||
            typeof payload !== "object" ||
            Array.isArray(payload)
        ) {
            setGenerationError(
                "Invalid generation settings. Please try again."
            );
            return;
        }

        generationLockRef.current = true;
        setIsGenerating(true);
        setGenerationError("");

        try {
            // Temporary mock generation delay.
            await new Promise((resolve) => {
                generationTimerRef.current = setTimeout(() => {
                    generationTimerRef.current = null;
                    resolve();
                }, 1100);
            });

            if (!mountedRef.current) return;

            const currentNodes = nodesRef.current;

            // Revalidate parent after the async operation.
            if (!getNodeById(currentNodes, parentId)) {
                throw new Error(
                    "The parent concept is no longer available."
                );
            }

            // The modal's parent selection is authoritative.
            const newNode = createBranchNode({
                nodes: currentNodes,
                ...payload,
                parentId,
            });

            if (!newNode || !newNode.id) {
                throw new Error(
                    "Unable to create the new concept."
                );
            }

            if (
                currentNodes.some((node) => node.id === newNode.id)
            ) {
                throw new Error(
                    "A concept with this ID already exists."
                );
            }

            const updatedNodes = [...currentNodes, newNode];

            nodesRef.current = updatedNodes;
            setNodes(updatedNodes);

            // Select and focus the new concept.
            setSelectedNodeId(newNode.id);

            setFocusNodeRequest({
                nodeId: newNode.id,
                requestId: crypto.randomUUID(),
            });

            setIsBranchModalOpen(false);
            setBranchParentId(null);
            setGenerationError("");
        } catch (error) {
            if (!mountedRef.current) return;

            setGenerationError(
                error instanceof Error
                    ? error.message
                    : "Unable to generate the variation. Please try again."
            );
        } finally {
            generationLockRef.current = false;

            if (mountedRef.current) {
                setIsGenerating(false);
            }
        }
    }

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <div className="canvas-shell">
            {/* ==========================================
                TOPBAR
            ========================================== */}

            <header className="canvas-topbar">
                <div className="flex min-w-0 items-center gap-4">
                    {/* Brand */}
                    <div className="flex shrink-0 items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--canvas-accent)] text-[#0a0c11]">
                            <Sparkles
                                size={19}
                                strokeWidth={2.5}
                                aria-hidden="true"
                            />
                        </div>

                        <span className="hidden text-sm font-semibold tracking-tight sm:block">
                            Fomi Canvas
                        </span>
                    </div>

                    <div className="h-6 w-px shrink-0 bg-[var(--canvas-border)]" />

                    {/* Project information */}
                    <div className="flex min-w-0 items-center gap-2">
                        <ArrowLeft
                            size={15}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--canvas-text-muted)]"
                        />

                        <span className="truncate text-sm font-medium">
                            {initialProject?.name ?? "Untitled Project"}
                        </span>

                        <ChevronDown
                            size={14}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--canvas-text-muted)]"
                        />
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden text-xs text-[var(--canvas-text-muted)] md:block">
                        Creative workspace
                    </span>

                    {/* Mobile Inspector Toggle */}
                    <button
                        ref={inspectorToggleButtonRef}
                        type="button"
                        onClick={handleOpenInspector}
                        aria-label="Open inspector"
                        aria-controls="canvas-inspector"
                        aria-expanded={isInspectorOpen}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--canvas-border)] text-[var(--canvas-text-secondary)] transition-colors hover:bg-[var(--canvas-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--canvas-focus)] min-[901px]:hidden"
                    >
                        <PanelRight size={18} aria-hidden="true" />
                    </button>

                    <div
                        aria-label="Fomi Creative"
                        role="img"
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--canvas-border-strong)] bg-[var(--canvas-surface-hover)] text-xs font-medium"
                    >
                        FC
                    </div>
                </div>
            </header>

            {/* ==========================================
                MAIN WORKSPACE
            ========================================== */}

            <div className="canvas-main">
                {/* Sidebar */}
                <aside
                    className="canvas-sidebar"
                    aria-label="Workspace navigation"
                >
                    {navigationItems.map(
                        ({ label, icon: Icon, active }) => (
                            <div
                                key={label}
                                className="canvas-icon-button"
                                data-active={active ? "true" : undefined}
                                aria-label={
                                    active
                                        ? `${label} workspace`
                                        : `${label} — coming soon`
                                }
                                title={
                                    active
                                        ? label
                                        : `${label} — coming soon`
                                }
                                role="img"
                            >
                                <Icon
                                    size={19}
                                    aria-hidden="true"
                                />
                            </div>
                        )
                    )}

                    <div className="mt-auto">
                        <div
                            className="canvas-icon-button"
                            role="img"
                            aria-label="Settings — coming soon"
                            title="Settings — coming soon"
                        >
                            <Settings2
                                size={19}
                                aria-hidden="true"
                            />
                        </div>
                    </div>
                </aside>

                {/* ======================================
                    CANVAS AREA
                ====================================== */}

                <main className="flex min-h-0 min-w-0 flex-col overflow-hidden">
                    {/* Breadcrumb Navigation */}
                    <div className="shrink-0 border-b border-[var(--canvas-border)] bg-[var(--canvas-surface)] px-4 py-3 sm:px-5">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                                <LineageBreadcrumbs
                                    nodes={nodes}
                                    selectedNodeId={selectedNodeId}
                                    onNavigate={handleNavigateToNode}
                                />
                            </div>

                            <NodeNavigationControls
                                nodes={nodes}
                                selectedNodeId={selectedNodeId}
                                onNavigate={handleNavigateToNode}
                            />
                        </div>
                    </div>

                    {/* Interactive Canvas */}
                    <div className="relative min-h-0 flex-1 overflow-hidden">
                        <CanvasBoard
                            nodes={nodes}
                            selectedNodeId={selectedNodeId}
                            onSelectNode={setSelectedNodeId}
                            focusNodeRequest={focusNodeRequest}
                        />
                    </div>
                </main>

                {/* ======================================
                    INSPECTOR
                ====================================== */}

                <aside
                    id="canvas-inspector"
                    className="canvas-inspector flex min-h-0 flex-col overflow-hidden"
                    data-open={isInspectorOpen ? "true" : "false"}
                    aria-label="Creative inspector"
                >
                    {/* Inspector Header */}
                    <div className="flex shrink-0 items-center justify-between border-b border-[var(--canvas-border)] px-5 py-5">
                        <h2 className="text-sm font-semibold">
                            Inspector
                        </h2>

                        <div className="flex items-center gap-2">
                            <PanelRight
                                size={17}
                                aria-hidden="true"
                                className="text-[var(--canvas-text-muted)]"
                            />

                            <button
                                ref={inspectorCloseButtonRef}
                                type="button"
                                onClick={handleCloseInspector}
                                aria-label="Close inspector"
                                className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--canvas-text-secondary)] hover:bg-[var(--canvas-surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--canvas-focus)] min-[901px]:hidden"
                            >
                                <X size={18} aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    {/* Scrollable Inspector Content */}
                    <div
                        className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
                        role="region"
                        aria-label="Inspector content"
                        tabIndex={0}
                    >
                        <div className="space-y-6 p-5">
                            {/* Selected Concept */}
                            <section aria-labelledby="selected-concept-title">
                                <div
                                    id="selected-concept-title"
                                    className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--canvas-text-muted)]"
                                >
                                    <Layers3
                                        size={14}
                                        aria-hidden="true"
                                    />
                                    Selected concept
                                </div>

                                <div className="rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] p-4">
                                    <p className="text-sm font-medium text-[var(--canvas-text)]">
                                        {selectedNode?.title ??
                                            "No concept selected"}
                                    </p>

                                    <p className="mt-2 text-xs leading-5 text-[var(--canvas-text-secondary)]">
                                        {selectedNode?.description ??
                                            "Select a concept to inspect it."}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleOpenBranchModal}
                                    disabled={!selectedNode || isGenerating}
                                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--canvas-accent)] px-4 py-3 text-xs font-semibold text-[#17131f] transition-colors hover:bg-[var(--canvas-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--canvas-focus)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isGenerating ? (
                                        <>
                                            <LoaderCircle
                                                size={16}
                                                aria-hidden="true"
                                                className="animate-spin"
                                            />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <GitBranch
                                                size={16}
                                                aria-hidden="true"
                                            />
                                            Create Variation
                                        </>
                                    )}
                                </button>
                            </section>

                            {/* Generation Settings */}
                            <section aria-labelledby="generation-settings-title">
                                <div
                                    id="generation-settings-title"
                                    className="mb-3 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-[var(--canvas-text-muted)]"
                                >
                                    <Settings2
                                        size={14}
                                        aria-hidden="true"
                                    />
                                    Generation settings
                                </div>

                                <div className="space-y-3">
                                    {[
                                        [
                                            "Style",
                                            selectedNode?.settings?.style ?? "—",
                                        ],
                                        [
                                            "Aspect ratio",
                                            selectedNode?.settings?.aspectRatio ?? "—",
                                        ],
                                        [
                                            "Quality",
                                            selectedNode?.settings?.quality ?? "—",
                                        ],
                                    ].map(([label, value]) => (
                                        <div
                                            key={label}
                                            className="flex items-center justify-between gap-3 rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] px-4 py-3"
                                        >
                                            <span className="text-xs text-[var(--canvas-text-secondary)]">
                                                {label}
                                            </span>

                                            <span className="break-words text-right text-xs font-medium text-[var(--canvas-text)]">
                                                {value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Inspector Help */}
                            <p className="text-xs leading-5 text-[var(--canvas-text-muted)]">
                                Select a concept to inspect its prompt,
                                settings, lineage, and creative variations.
                            </p>

                            {/* Comparison */}
                            <section
                                className="border-t border-[var(--canvas-border)] pt-6"
                                aria-label="Concept comparison"
                            >
                                <ComparisonControls
                                    selectedNode={selectedNode}
                                    comparisonNodes={comparison.comparisonNodes}
                                    isReady={comparison.isReady}
                                    isNodeSelected={comparison.isNodeSelected}
                                    onToggleNode={comparison.toggleNode}
                                    onOpenComparison={comparison.openComparison}
                                    onClearComparison={comparison.clearComparison}
                                />
                            </section>

                            {/* Branch History */}
                            <section
                                className="border-t border-[var(--canvas-border)] pt-6"
                                aria-label="Branch history"
                            >
                                <BranchHistoryPanel
                                    nodes={nodes}
                                    selectedNodeId={selectedNodeId}
                                    onNavigate={handleNavigateToNode}
                                />
                            </section>
                        </div>
                    </div>
                </aside>
            </div>

            {/* ==========================================
                BRANCH GENERATION MODAL
            ========================================== */}

            <BranchGenerationModal
                isOpen={isBranchModalOpen}
                parentNode={branchParentNode}
                isGenerating={isGenerating}
                error={generationError}
                onClose={handleCloseBranchModal}
                onGenerate={handleGenerateBranch}
            />

            {/* ==========================================
                COMPARISON MODAL
            ========================================== */}

            <ComparisonModal
                isOpen={comparison.isComparisonOpen}
                nodes={comparison.comparisonNodes}
                onClose={comparison.closeComparison}
            />
        </div>
    );
};

export default CanvasShell;
