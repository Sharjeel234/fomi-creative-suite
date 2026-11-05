
"use client";

import {
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from "react";

import {
    ArrowLeftRight,
    Check,
    Columns2,
    GitBranch,
    ImageOff,
    X,
} from "lucide-react";

import {
    getSettingsDifferences,
} from "@/lib/comparison-utils";

// --------------------------------------------------
// Shared Styles
// --------------------------------------------------

const FOCUS_CLASS =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)]";

// --------------------------------------------------
// Comparison Image
// --------------------------------------------------

const ComparisonImage = ({ node }) => {
    const [failedSrc, setFailedSrc] = useState(null);

    const src = node.image || null;

    const hasError =
        Boolean(src && failedSrc === src);

    const title =
        node.title || "Untitled concept";

    return (
        <div className="relative aspect-[4/3] overflow-hidden bg-black/30 sm:aspect-[5/4]">
            {src && !hasError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                    src={src}
                    alt={`Generated concept: ${title}`}
                    loading="lazy"
                    decoding="async"
                    onError={() => setFailedSrc(src)}
                    className="h-full w-full object-cover"
                />
            ) : (
                <div
                    role="img"
                    aria-label={`Image unavailable for ${title}`}
                    className="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--canvas-text-muted)]"
                >
                    <ImageOff
                        size={28}
                        aria-hidden="true"
                    />

                    <span className="text-xs">
                        Preview unavailable
                    </span>
                </div>
            )}
        </div>
    );
};

// --------------------------------------------------
// Comparison Concept Card
// --------------------------------------------------

const ComparisonConceptCard = ({
    node,
    label,
}) => {
    const title =
        node.title || "Untitled concept";

    return (
        <article className="min-w-0 overflow-hidden rounded-2xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)]">
            {/* Concept Preview */}

            <div className="relative">
                <ComparisonImage node={node} />

                <span className="absolute left-3 top-3 rounded-lg border border-white/10 bg-black/70 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                    {label}
                </span>
            </div>

            {/* Concept Details */}

            <div className="space-y-4 p-4">
                <div>
                    <h3 className="break-words text-base font-semibold text-[var(--canvas-text)]">
                        {title}
                    </h3>

                    <p className="mt-1 text-xs text-[var(--canvas-text-muted)]">
                        {node.parentId
                            ? "Generated variation"
                            : "Original concept"}
                    </p>
                </div>

                {/* Generation Prompt */}

                <div>
                    <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--canvas-text-muted)]">
                        Generation prompt
                    </h4>

                    <p className="max-h-40 overflow-y-auto whitespace-pre-wrap break-words rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface)] p-3 text-xs leading-5 text-[var(--canvas-text-secondary)]">
                        {node.prompt?.trim() ||
                            "No prompt available."}
                    </p>
                </div>

                {/* Creative Description */}

                {node.description && (
                    <div>
                        <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-[var(--canvas-text-muted)]">
                            Creative direction
                        </h4>

                        <p className="break-words text-xs leading-5 text-[var(--canvas-text-secondary)]">
                            {node.description}
                        </p>
                    </div>
                )}
            </div>
        </article>
    );
};

// --------------------------------------------------
// Generation Settings Comparison
// --------------------------------------------------

const ComparisonSettings = ({
    firstNode,
    secondNode,
}) => {
    const headingId = useId();

    const differences = useMemo(() => {
        return getSettingsDifferences(
            firstNode,
            secondNode
        );
    }, [firstNode, secondNode]);

    const differentCount = differences.filter(
        (item) => item.isDifferent
    ).length;

    return (
        <section
            aria-labelledby={headingId}
            className="rounded-2xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] p-4"
        >
            {/* Heading */}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h3
                    id={headingId}
                    className="text-sm font-semibold text-[var(--canvas-text)]"
                >
                    Generation settings
                </h3>

                <span className="rounded-lg bg-[var(--canvas-accent-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--canvas-accent)]">
                    {differentCount}{" "}
                    {differentCount === 1
                        ? "difference"
                        : "differences"}
                </span>
            </div>

            {/* Settings Table */}

            <div className="overflow-x-auto">
                <table className="w-full min-w-[340px] border-collapse text-left text-xs">
                    <thead>
                        <tr className="border-b border-[var(--canvas-border)] text-[var(--canvas-text-muted)]">
                            <th
                                scope="col"
                                className="pb-3 pr-3 font-medium"
                            >
                                Setting
                            </th>

                            <th
                                scope="col"
                                className="pb-3 pr-3 font-medium"
                            >
                                Concept A
                            </th>

                            <th
                                scope="col"
                                className="pb-3 font-medium"
                            >
                                Concept B
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {differences.map((item) => (
                            <tr
                                key={item.key}
                                className="border-b border-[var(--canvas-border)] last:border-0"
                            >
                                <th
                                    scope="row"
                                    className="py-3 pr-3 font-medium text-[var(--canvas-text-secondary)]"
                                >
                                    {item.label}
                                </th>

                                <td className="py-3 pr-3 text-[var(--canvas-text)]">
                                    {item.firstValue}
                                </td>

                                <td
                                    className={`py-3 ${item.isDifferent
                                            ? "font-semibold text-[var(--canvas-accent)]"
                                            : "text-[var(--canvas-text)]"
                                        }`}
                                >
                                    <span className="inline-flex items-center gap-1.5">
                                        {item.secondValue}

                                        {item.isDifferent ? (
                                            <>
                                                <ArrowLeftRight
                                                    size={12}
                                                    aria-hidden="true"
                                                    className="text-[var(--canvas-accent)]"
                                                />

                                                <span className="sr-only">
                                                    Different value
                                                </span>
                                            </>
                                        ) : (
                                            <>
                                                <Check
                                                    size={12}
                                                    aria-hidden="true"
                                                    className="text-[var(--canvas-text-muted)]"
                                                />

                                                <span className="sr-only">
                                                    Matching value
                                                </span>
                                            </>
                                        )}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

// --------------------------------------------------
// Comparison Modal
// --------------------------------------------------

const ComparisonModal = ({
    isOpen,
    nodes = [],
    onClose,
}) => {
    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);
    const onCloseRef = useRef(onClose);

    const headingId = useId();
    const descriptionId = useId();

    const hasTwoNodes = nodes.length === 2;

    const shouldOpen =
        Boolean(isOpen && hasTwoNodes);

    // Keep the latest callback available to
    // the native dialog close handler.
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // --------------------------------------------------
    // Dialog Lifecycle
    // --------------------------------------------------

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (shouldOpen) {
            if (!dialog.open) {
                previousFocusRef.current =
                    document.activeElement;

                dialog.showModal();

                closeButtonRef.current?.focus();
            }
        } else if (dialog.open) {
            dialog.close();
        }
    }, [shouldOpen]);

    // --------------------------------------------------
    // Restore Focus
    // --------------------------------------------------

    function restorePreviousFocus() {
        const previousElement =
            previousFocusRef.current;

        if (
            previousElement instanceof HTMLElement &&
            previousElement.isConnected
        ) {
            previousElement.focus();
        }

        previousFocusRef.current = null;
    }

    // --------------------------------------------------
    // Close Handlers
    // --------------------------------------------------

    function handleRequestClose() {
        onCloseRef.current?.();
    }

    function handleCancel(event) {
        event.preventDefault();

        handleRequestClose();
    }

    function handleDialogClose() {
        // Only synchronize parent state when
        // the dialog closed independently.
        if (shouldOpen) {
            handleRequestClose();
        }

        restorePreviousFocus();
    }

    // --------------------------------------------------
    // Compared Concepts
    // --------------------------------------------------

    const firstNode = hasTwoNodes
        ? nodes[0]
        : null;

    const secondNode = hasTwoNodes
        ? nodes[1]
        : null;

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onClose={handleDialogClose}
            aria-labelledby={headingId}
            aria-describedby={descriptionId}
            className="fixed inset-0 m-auto max-h-[94dvh] w-[min(1100px,calc(100vw-20px))] max-w-none overflow-hidden rounded-2xl border border-[var(--canvas-border)] bg-[var(--canvas-surface)] p-0 text-[var(--canvas-text)] shadow-2xl backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        >
            <div className="flex max-h-[94dvh] flex-col">
                {/* Header */}

                <header className="flex shrink-0 items-start justify-between gap-3 border-b border-[var(--canvas-border)] px-4 py-4 sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--canvas-accent-soft)] text-[var(--canvas-accent)]">
                            <Columns2
                                size={19}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id={headingId}
                                className="text-base font-semibold"
                            >
                                Compare Concepts
                            </h2>

                            <p
                                id={descriptionId}
                                className="mt-1 text-xs leading-5 text-[var(--canvas-text-secondary)]"
                            >
                                Evaluate two creative directions
                                side by side.
                            </p>
                        </div>
                    </div>

                    <button
                        ref={closeButtonRef}
                        type="button"
                        onClick={handleRequestClose}
                        aria-label="Close comparison"
                        className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--canvas-border)] text-[var(--canvas-text-secondary)] transition-colors hover:bg-[var(--canvas-surface-hover)] hover:text-[var(--canvas-text)] ${FOCUS_CLASS}`}
                    >
                        <X
                            size={17}
                            aria-hidden="true"
                        />
                    </button>
                </header>

                {/* Comparison Content */}

                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain p-4 sm:p-6">
                    <div className="flex items-center gap-2 text-xs text-[var(--canvas-text-muted)]">
                        <GitBranch
                            size={14}
                            aria-hidden="true"
                        />

                        <span>
                            Comparing two concepts from
                            your creative workspace
                        </span>
                    </div>

                    {hasTwoNodes && (
                        <>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <ComparisonConceptCard
                                    key={firstNode.id}
                                    node={firstNode}
                                    label="Concept A"
                                />

                                <ComparisonConceptCard
                                    key={secondNode.id}
                                    node={secondNode}
                                    label="Concept B"
                                />
                            </div>

                            <ComparisonSettings
                                firstNode={firstNode}
                                secondNode={secondNode}
                            />
                        </>
                    )}
                </div>

                {/* Footer */}

                <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-[var(--canvas-border)] px-4 py-3 sm:px-6">
                    <p className="hidden text-xs text-[var(--canvas-text-muted)] sm:block">
                        Press Esc to return to the canvas
                    </p>

                    <button
                        type="button"
                        onClick={handleRequestClose}
                        className={`ml-auto rounded-lg bg-[var(--canvas-accent)] px-4 py-2.5 text-xs font-semibold text-[#17131f] transition-colors hover:bg-[var(--canvas-accent-hover)] ${FOCUS_CLASS}`}
                    >
                        Done Comparing
                    </button>
                </footer>
            </div>
        </dialog>
    );
};

export default ComparisonModal;
