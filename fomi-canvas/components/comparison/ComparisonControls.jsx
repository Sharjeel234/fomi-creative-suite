
"use client";

import {
    Check,
    Columns2,
    GitCompareArrows,
    Plus,
    Trash2,
} from "lucide-react";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const MAX_COMPARISON_NODES = 2;

// --------------------------------------------------
// Comparison Controls
// --------------------------------------------------

const ComparisonControls = ({
    selectedNode,
    comparisonNodes = [],
    isReady = false,
    isNodeSelected,
    onToggleNode,
    onOpenComparison,
    onClearComparison,
}) => {
    // --------------------------------------------------
    // Empty State
    // --------------------------------------------------

    if (!selectedNode) {
        return null;
    }

    // --------------------------------------------------
    // Selection State
    // --------------------------------------------------

    const selectedForComparison =
        isNodeSelected?.(selectedNode.id) ?? false;

    const comparisonCount = comparisonNodes.length;

    const isSelectionFull =
        comparisonCount >= MAX_COMPARISON_NODES;

    const canToggleSelection =
        selectedForComparison || !isSelectionFull;

    // --------------------------------------------------
    // Event Handlers
    // --------------------------------------------------

    function handleToggleNode() {
        if (!canToggleSelection) return;

        onToggleNode?.(selectedNode.id);
    }

    function handleOpenComparison() {
        if (!isReady) return;

        onOpenComparison?.();
    }

    function handleClearComparison() {
        if (!comparisonCount) return;

        onClearComparison?.();
    }

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <section
            aria-label="Concept comparison controls"
            className="space-y-4"
        >
            {/* Heading */}

            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Columns2
                        size={16}
                        aria-hidden="true"
                        className="text-[var(--canvas-accent)]"
                    />

                    <h2 className="text-sm font-semibold text-[var(--canvas-text)]">
                        Concept Comparison
                    </h2>
                </div>

                <span className="rounded-lg border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] px-2 py-1 font-mono text-[10px] tabular-nums text-[var(--canvas-text-secondary)]">
                    {comparisonCount} / {MAX_COMPARISON_NODES}
                </span>
            </div>

            {/* Selection Action */}

            <button
                type="button"
                onClick={handleToggleNode}
                disabled={!canToggleSelection}
                aria-pressed={selectedForComparison}
                title={
                    !canToggleSelection
                        ? "Remove a selected concept before adding another"
                        : undefined
                }
                className={`flex w-full items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-40 ${selectedForComparison
                        ? "border-[var(--canvas-accent)] bg-[var(--canvas-accent-soft)] text-[var(--canvas-accent)]"
                        : "border-[var(--canvas-border-strong)] bg-[var(--canvas-surface-raised)] text-[var(--canvas-text)] hover:bg-[var(--canvas-surface-hover)]"
                    }`}
            >
                {selectedForComparison ? (
                    <>
                        <Check
                            size={15}
                            aria-hidden="true"
                        />

                        Remove from Comparison
                    </>
                ) : (
                    <>
                        <Plus
                            size={15}
                            aria-hidden="true"
                        />

                        Add to Comparison
                    </>
                )}
            </button>

            {/* Selection Limit Message */}

            {isSelectionFull && !selectedForComparison && (
                <p className="text-[11px] leading-5 text-[var(--canvas-text-muted)]">
                    Two concepts are already selected.
                    Remove one before adding another.
                </p>
            )}

            {/* Selected Concepts */}

            <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--canvas-text-muted)]">
                    Selected concepts
                </p>

                <div
                    role="status"
                    aria-live="polite"
                    aria-atomic="true"
                    className="sr-only"
                >
                    {comparisonCount} of {MAX_COMPARISON_NODES}
                    concepts selected for comparison.
                </div>

                {comparisonCount > 0 ? (
                    <div className="space-y-2">
                        {comparisonNodes.map(
                            (node, index) => (
                                <div
                                    key={node.id}
                                    className="flex min-w-0 items-center gap-2 rounded-lg border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] px-3 py-2.5"
                                >
                                    {/* Comparison Slot */}

                                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-[var(--canvas-accent-soft)] font-mono text-[10px] font-semibold text-[var(--canvas-accent)]">
                                        {index === 0
                                            ? "A"
                                            : "B"}
                                    </span>

                                    {/* Concept Title */}

                                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-[var(--canvas-text)]">
                                        {node.title ||
                                            "Untitled concept"}
                                    </span>

                                    {/* Selected Indicator */}

                                    <Check
                                        size={13}
                                        aria-hidden="true"
                                        className="shrink-0 text-[var(--canvas-accent)]"
                                    />
                                </div>
                            )
                        )}
                    </div>
                ) : (
                    <p className="rounded-lg border border-dashed border-[var(--canvas-border)] p-3 text-xs leading-5 text-[var(--canvas-text-muted)]">
                        No concepts selected yet.
                    </p>
                )}
            </div>

            {/* Primary Action */}

            <button
                type="button"
                onClick={handleOpenComparison}
                disabled={!isReady}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--canvas-accent)] px-3 py-3 text-xs font-semibold text-[#17131f] transition-colors hover:bg-[var(--canvas-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-40"
            >
                <GitCompareArrows
                    size={15}
                    aria-hidden="true"
                />

                Compare Selected
            </button>

            {/* Clear Action */}

            {comparisonCount > 0 && (
                <button
                    type="button"
                    onClick={handleClearComparison}
                    className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--canvas-text-muted)] transition-colors hover:bg-[var(--canvas-surface-hover)] hover:text-[var(--canvas-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)]"
                >
                    <Trash2
                        size={13}
                        aria-hidden="true"
                    />

                    Clear Selection
                </button>
            )}

            {/* Helper Text */}

            <p className="text-[11px] leading-5 text-[var(--canvas-text-muted)]">
                Select two concepts to compare their
                images, prompts, and generation settings.
            </p>
        </section>
    );
};

export default ComparisonControls;
