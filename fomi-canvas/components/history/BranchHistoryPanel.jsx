
"use client";

import { useMemo } from "react";
import Image from "next/image";

import {
    ArrowUpRight,
    GitBranch,
    History,
    Layers3,
} from "lucide-react";

import { getNodeById } from "@/lib/canvas-utils";

import {
    getBranchStats,
    getDirectChildren,
    getNodeDescendants,
} from "@/lib/lineage-utils";

// --------------------------------------------------
// History Node Button
// --------------------------------------------------

const HistoryNodeButton = ({
    node,
    label,
    onNavigate,
}) => {
    const title = node.title || "Untitled concept";

    function handleNavigate() {
        onNavigate?.(node.id);
    }

    return (
        <button
            type="button"
            onClick={handleNavigate}
            title={`Navigate to ${title}`}
            className="group flex w-full items-center gap-3 rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] p-2.5 text-left transition-colors hover:border-[var(--canvas-accent)] hover:bg-[var(--canvas-surface-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)]"
        >
            {/* Concept Preview */}

            <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-black/20">
                {node.image ? (
                    <Image
                        src={node.image}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--canvas-surface-hover)]">
                        <Layers3
                            size={18}
                            aria-hidden="true"
                            className="text-[var(--canvas-text-muted)]"
                        />
                    </div>
                )}
            </div>

            {/* Concept Information */}

            <div className="min-w-0 flex-1">
                {label && (
                    <p className="mb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--canvas-text-muted)]">
                        {label}
                    </p>
                )}

                <p className="truncate text-xs font-medium text-[var(--canvas-text)]">
                    {title}
                </p>

                <p className="mt-1 truncate text-[11px] text-[var(--canvas-text-muted)]">
                    {node.settings?.style ??
                        "Creative variation"}
                </p>
            </div>

            {/* Navigation Indicator */}

            <ArrowUpRight
                size={15}
                aria-hidden="true"
                className="shrink-0 text-[var(--canvas-text-muted)] transition-colors group-hover:text-[var(--canvas-accent)]"
            />
        </button>
    );
};

// --------------------------------------------------
// Statistic Card
// --------------------------------------------------

const HistoryStat = ({ value, label }) => {
    return (
        <div className="rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] p-3 text-center">
            <p className="font-mono text-lg font-semibold tabular-nums text-[var(--canvas-accent)]">
                {value}
            </p>

            <p className="mt-1 text-[10px] text-[var(--canvas-text-muted)]">
                {label}
            </p>
        </div>
    );
};

// --------------------------------------------------
// Branch History Panel
// --------------------------------------------------

const BranchHistoryPanel = ({
    nodes,
    selectedNodeId,
    onNavigate,
}) => {
    // --------------------------------------------------
    // Selected Concept
    // --------------------------------------------------

    const selectedNode = useMemo(() => {
        if (!selectedNodeId) return null;

        return getNodeById(nodes, selectedNodeId);
    }, [nodes, selectedNodeId]);

    // --------------------------------------------------
    // Parent Concept
    // --------------------------------------------------

    const parentNode = useMemo(() => {
        if (!selectedNode?.parentId) {
            return null;
        }

        return getNodeById(
            nodes,
            selectedNode.parentId
        );
    }, [nodes, selectedNode]);

    // --------------------------------------------------
    // Direct Variations
    // --------------------------------------------------

    const children = useMemo(() => {
        if (!selectedNode) return [];

        return getDirectChildren(
            nodes,
            selectedNode.id
        );
    }, [nodes, selectedNode]);

    // --------------------------------------------------
    // Descendant History
    // --------------------------------------------------

    const descendants = useMemo(() => {
        if (!selectedNode) return [];

        return getNodeDescendants(
            nodes,
            selectedNode.id
        );
    }, [nodes, selectedNode]);

    // Exclude direct children from the deeper history.
    const deeperDescendants = useMemo(() => {
        const directChildIds = new Set(
            children.map((child) => child.id)
        );

        return descendants.filter(
            (node) => !directChildIds.has(node.id)
        );
    }, [children, descendants]);

    // --------------------------------------------------
    // Branch Statistics
    // --------------------------------------------------

    const stats = useMemo(() => {
        if (!selectedNode) return null;

        return getBranchStats(
            nodes,
            selectedNode.id
        );
    }, [nodes, selectedNode]);

    // --------------------------------------------------
    // Navigation
    // --------------------------------------------------

    function handleNavigate(nodeId) {
        if (
            !nodeId ||
            nodeId === selectedNodeId
        ) {
            return;
        }

        onNavigate?.(nodeId);
    }

    // --------------------------------------------------
    // Empty State
    // --------------------------------------------------

    if (!selectedNode || !stats) {
        return (
            <div className="flex h-full items-center justify-center p-6 text-center">
                <div>
                    <History
                        size={24}
                        aria-hidden="true"
                        className="mx-auto text-[var(--canvas-text-muted)]"
                    />

                    <p className="mt-3 text-sm font-medium text-[var(--canvas-text)]">
                        No concept selected
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[var(--canvas-text-muted)]">
                        Select a concept to explore
                        its creative history.
                    </p>
                </div>
            </div>
        );
    }

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <section
            aria-label="Branch history"
            className="space-y-5"
        >
            {/* Header */}

            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <History
                        size={16}
                        aria-hidden="true"
                        className="text-[var(--canvas-accent)]"
                    />

                    <h2 className="text-sm font-semibold text-[var(--canvas-text)]">
                        Branch History
                    </h2>
                </div>

                <span className="rounded-lg border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] px-2 py-1 font-mono text-[10px] text-[var(--canvas-text-secondary)]">
                    Gen {stats.depth}
                </span>
            </div>

            {/* Selected Concept */}

            <div className="rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] p-3">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--canvas-text-muted)]">
                    Selected concept
                </p>

                <p className="mt-1 truncate text-sm font-medium text-[var(--canvas-text)]">
                    {selectedNode.title ||
                        "Untitled concept"}
                </p>

                <p className="mt-1 text-xs text-[var(--canvas-text-secondary)]">
                    {stats.directChildren} direct variations
                    {" · "}
                    {stats.totalDescendants} descendants
                </p>
            </div>

            {/* Statistics */}

            <div className="grid grid-cols-3 gap-2">
                <HistoryStat
                    value={stats.depth}
                    label="Generation"
                />

                <HistoryStat
                    value={stats.directChildren}
                    label="Children"
                />

                <HistoryStat
                    value={stats.totalDescendants}
                    label="Descendants"
                />
            </div>

            {/* Parent Concept */}

            <div className="space-y-2.5">
                <h3 className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--canvas-text-muted)]">
                    Parent concept
                </h3>

                {parentNode ? (
                    <HistoryNodeButton
                        node={parentNode}
                        label="Previous direction"
                        onNavigate={handleNavigate}
                    />
                ) : (
                    <p className="rounded-xl border border-dashed border-[var(--canvas-border)] p-3 text-xs text-[var(--canvas-text-muted)]">
                        This is an original concept.
                    </p>
                )}
            </div>

            {/* Direct Variations */}

            <div className="space-y-2.5">
                <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--canvas-text-muted)]">
                    <GitBranch
                        size={13}
                        aria-hidden="true"
                    />

                    Direct variations ({children.length})
                </h3>

                {children.length ? (
                    <div className="space-y-2">
                        {children.map((child) => (
                            <HistoryNodeButton
                                key={child.id}
                                node={child}
                                onNavigate={handleNavigate}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="rounded-xl border border-dashed border-[var(--canvas-border)] p-3 text-xs leading-5 text-[var(--canvas-text-muted)]">
                        No variations yet. Create a
                        branch to explore a new direction.
                    </p>
                )}
            </div>

            {/* Deeper Descendants */}

            <div className="space-y-2.5">
                <h3 className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--canvas-text-muted)]">
                    <Layers3
                        size={13}
                        aria-hidden="true"
                    />

                    Deeper descendants ({deeperDescendants.length})
                </h3>

                {deeperDescendants.length ? (
                    <div className="space-y-2">
                        {deeperDescendants.map((node) => (
                            <HistoryNodeButton
                                key={node.id}
                                node={node}
                                label="Creative descendant"
                                onNavigate={handleNavigate}
                            />
                        ))}
                    </div>
                ) : (
                    <p className="text-xs leading-5 text-[var(--canvas-text-muted)]">
                        No deeper generations yet.
                    </p>
                )}
            </div>

            {/* Footer */}

            <div className="border-t border-[var(--canvas-border)] pt-3">
                <p className="text-[11px] leading-5 text-[var(--canvas-text-muted)]">
                    Select any concept in the history to
                    navigate to it on the canvas.
                </p>
            </div>
        </section>
    );
};

export default BranchHistoryPanel;
