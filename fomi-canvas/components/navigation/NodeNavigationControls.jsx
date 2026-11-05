
"use client";

import { useMemo } from "react";

import {
    ArrowLeft,
    ArrowRight,
    House,
} from "lucide-react";

import {
    getDirectChildren,
    getNodeLineage,
} from "@/lib/lineage-utils";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const CONTROL_CLASS =
    "inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] px-3 text-xs font-medium text-[var(--canvas-text-secondary)] transition-colors hover:border-[var(--canvas-border-strong)] hover:bg-[var(--canvas-surface-hover)] hover:text-[var(--canvas-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[var(--canvas-border)] disabled:hover:bg-[var(--canvas-surface-raised)]";

// --------------------------------------------------
// Node Navigation Controls
// --------------------------------------------------

const NodeNavigationControls = ({
    nodes,
    selectedNodeId,
    onNavigate,
}) => {
    // --------------------------------------------------
    // Selected Node Lineage
    // --------------------------------------------------

    const lineage = useMemo(() => {
        if (!selectedNodeId) {
            return [];
        }

        return getNodeLineage(nodes, selectedNodeId);
    }, [nodes, selectedNodeId]);

    const selectedNode =
        lineage[lineage.length - 1] ?? null;

    const rootNode = lineage[0] ?? null;

    const parentNode =
        lineage.length > 1
            ? lineage[lineage.length - 2]
            : null;

    // --------------------------------------------------
    // Direct Children
    // --------------------------------------------------

    const children = useMemo(() => {
        if (!selectedNodeId) {
            return [];
        }

        return getDirectChildren(nodes, selectedNodeId);
    }, [nodes, selectedNodeId]);

    const firstChild = children[0] ?? null;

    // --------------------------------------------------
    // Navigation Handler
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

    if (!selectedNode || !rootNode) {
        return null;
    }

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <nav
            aria-label="Concept navigation"
            className="flex flex-wrap items-center gap-2"
        >
            {/* Root Concept */}

            <button
                type="button"
                onClick={() =>
                    handleNavigate(rootNode.id)
                }
                disabled={
                    selectedNode.id === rootNode.id
                }
                title="Navigate to original concept"
                className={CONTROL_CLASS}
            >
                <House
                    size={14}
                    aria-hidden="true"
                />

                <span>Root</span>
            </button>

            {/* Parent Concept */}

            <button
                type="button"
                onClick={() =>
                    handleNavigate(parentNode?.id)
                }
                disabled={!parentNode}
                title={
                    parentNode
                        ? `Navigate to parent: ${parentNode.title}`
                        : "No parent concept"
                }
                className={CONTROL_CLASS}
            >
                <ArrowLeft
                    size={14}
                    aria-hidden="true"
                />

                <span>Parent</span>
            </button>

            {/* First Child Variation */}

            <button
                type="button"
                onClick={() =>
                    handleNavigate(firstChild?.id)
                }
                disabled={!firstChild}
                title={
                    firstChild
                        ? `Navigate to first variation: ${firstChild.title}`
                        : "No child variations"
                }
                className={CONTROL_CLASS}
            >
                <span>First child</span>

                <ArrowRight
                    size={14}
                    aria-hidden="true"
                />
            </button>
        </nav>
    );
};

export default NodeNavigationControls;
