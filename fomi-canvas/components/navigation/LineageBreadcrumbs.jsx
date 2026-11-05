
"use client";

import { useMemo } from "react";

import {
    ChevronRight,
    GitBranch,
    Home,
} from "lucide-react";

import { getNodeLineage } from "@/lib/lineage-utils";

// --------------------------------------------------
// Lineage Breadcrumbs
// --------------------------------------------------

const LineageBreadcrumbs = ({
    nodes,
    selectedNodeId,
    onNavigate,
}) => {
    // --------------------------------------------------
    // Derive Selected Node Lineage
    // --------------------------------------------------

    const lineage = useMemo(() => {
        if (!selectedNodeId) {
            return [];
        }

        return getNodeLineage(nodes, selectedNodeId);
    }, [nodes, selectedNodeId]);

    // --------------------------------------------------
    // Navigate to Concept
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

    if (!lineage.length) {
        return null;
    }

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <nav
            aria-label="Creative concept lineage"
            className="min-w-0"
        >
            <ol className="flex min-w-0 items-center gap-1 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {lineage.map((node, index) => {
                    const isCurrent =
                        node.id === selectedNodeId;

                    const isRoot = index === 0;

                    const title =
                        node.title || "Untitled concept";

                    return (
                        <li
                            key={node.id}
                            className="flex shrink-0 items-center gap-1"
                        >
                            {/* Separator */}

                            {index > 0 && (
                                <ChevronRight
                                    size={13}
                                    aria-hidden="true"
                                    className="shrink-0 text-[var(--canvas-text-muted)]"
                                />
                            )}

                            {/* Breadcrumb */}

                            <button
                                type="button"
                                onClick={() =>
                                    handleNavigate(node.id)
                                }
                                disabled={isCurrent}
                                aria-current={
                                    isCurrent
                                        ? "location"
                                        : undefined
                                }
                                title={title}
                                className={`inline-flex max-w-[170px] items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)] ${isCurrent
                                        ? "bg-[var(--canvas-accent-soft)] text-[var(--canvas-accent)] disabled:cursor-default"
                                        : "text-[var(--canvas-text-secondary)] hover:bg-[var(--canvas-surface-hover)] hover:text-[var(--canvas-text)]"
                                    }`}
                            >
                                {/* Concept Icon */}

                                {isRoot ? (
                                    <Home
                                        size={13}
                                        aria-hidden="true"
                                        className="shrink-0"
                                    />
                                ) : (
                                    <GitBranch
                                        size={13}
                                        aria-hidden="true"
                                        className="shrink-0"
                                    />
                                )}

                                {/* Concept Title */}

                                <span className="truncate">
                                    {title}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default LineageBreadcrumbs;
