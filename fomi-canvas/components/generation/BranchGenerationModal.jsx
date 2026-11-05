
"use client";

import {
    useEffect,
    useId,
    useRef,
    useState,
} from "react";

import Image from "next/image";

import {
    ArrowRight,
    GitBranch,
    LoaderCircle,
    Sparkles,
    X,
} from "lucide-react";

import {
    GENERATION_STYLES,
    GENERATION_ASPECT_RATIOS,
} from "@/lib/branch-utils";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const MAX_PROMPT_LENGTH = 1000;

const DEFAULT_STYLE = "Editorial";
const DEFAULT_ASPECT_RATIO = "1:1";

const OPTION_BASE_CLASS =
    "flex cursor-pointer items-center justify-center rounded-xl border px-3 py-3 text-xs font-medium transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[var(--fomi-focus)] has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-[var(--canvas-surface)]";

const OPTION_SELECTED_CLASS =
    "border-[var(--canvas-accent)] bg-[var(--canvas-accent-soft)] text-[var(--canvas-accent)]";

const OPTION_DEFAULT_CLASS =
    "border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] text-[var(--canvas-text-secondary)] hover:border-[var(--canvas-accent-border)]";

// --------------------------------------------------
// Form Defaults
// --------------------------------------------------

function getInitialFormValues(parentNode) {
    const parentStyle = parentNode?.settings?.style;
    const parentAspectRatio =
        parentNode?.settings?.aspectRatio;

    return {
        prompt: String(parentNode?.prompt ?? "").slice(
            0,
            MAX_PROMPT_LENGTH
        ),

        style: GENERATION_STYLES.includes(parentStyle)
            ? parentStyle
            : DEFAULT_STYLE,

        aspectRatio: GENERATION_ASPECT_RATIOS.includes(
            parentAspectRatio
        )
            ? parentAspectRatio
            : DEFAULT_ASPECT_RATIO,
    };
}

// --------------------------------------------------
// Branch Generation Modal
// --------------------------------------------------

const BranchGenerationModal = ({
    isOpen,
    parentNode,
    isGenerating = false,
    error = "",
    onClose,
    onGenerate,
}) => {
    const [formValues, setFormValues] = useState(() =>
        getInitialFormValues(parentNode)
    );

    const dialogRef = useRef(null);
    const promptRef = useRef(null);
    const previousFocusRef = useRef(null);
    const wasOpenRef = useRef(false);

    const titleId = useId();
    const descriptionId = useId();
    const promptId = useId();
    const promptHelpId = useId();
    const styleName = useId();
    const aspectRatioName = useId();

    const { prompt, style, aspectRatio } = formValues;

    const cleanPrompt = prompt.trim();

    const canGenerate =
        Boolean(parentNode) &&
        Boolean(cleanPrompt) &&
        !isGenerating;

    // --------------------------------------------------
    // Initialize Form When Dialog Opens
    // --------------------------------------------------

    useEffect(() => {
        if (!isOpen) {
            wasOpenRef.current = false;
            return;
        }

        if (!wasOpenRef.current) {
            wasOpenRef.current = true;

            // Schedule initialization outside the
            // effect's synchronous execution.
            const frame = requestAnimationFrame(() => {
                setFormValues(
                    getInitialFormValues(parentNode)
                );
            });

            return () => cancelAnimationFrame(frame);
        }
    }, [isOpen, parentNode]);

    // --------------------------------------------------
    // Native Dialog Lifecycle
    // --------------------------------------------------

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) return;

        if (isOpen) {
            if (!dialog.open) {
                previousFocusRef.current =
                    document.activeElement;

                dialog.showModal();
            }

            const frame = requestAnimationFrame(() => {
                promptRef.current?.focus();
            });

            return () => cancelAnimationFrame(frame);
        }

        if (dialog.open) {
            dialog.close();
        }
    }, [isOpen]);

    // --------------------------------------------------
    // Restore Previous Focus
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

    function handleDialogClose() {
        if (isOpen && !isGenerating) {
            onClose?.();
        }

        restorePreviousFocus();
    }

    // --------------------------------------------------
    // Cancel / Close
    // --------------------------------------------------

    function handleCancel(event) {
        event.preventDefault();

        if (isGenerating) return;

        onClose?.();
    }

    function handleClose() {
        if (isGenerating) return;

        onClose?.();
    }

    // --------------------------------------------------
    // Form Updates
    // --------------------------------------------------

    function handlePromptChange(event) {
        setFormValues((current) => ({
            ...current,
            prompt: event.target.value,
        }));
    }

    function handleStyleChange(value) {
        setFormValues((current) => ({
            ...current,
            style: value,
        }));
    }

    function handleAspectRatioChange(value) {
        setFormValues((current) => ({
            ...current,
            aspectRatio: value,
        }));
    }

    // --------------------------------------------------
    // Submit Generation
    // --------------------------------------------------

    function handleSubmit(event) {
        event.preventDefault();

        if (!canGenerate) {
            if (!cleanPrompt) {
                promptRef.current?.focus();
            }

            return;
        }

        onGenerate?.({
            parentId: parentNode.id,
            prompt: cleanPrompt,
            style,
            aspectRatio,
        });
    }

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <dialog
            ref={dialogRef}
            onCancel={handleCancel}
            onClose={handleDialogClose}
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="fixed inset-0 m-auto max-h-[calc(100dvh-32px)] w-[min(540px,calc(100vw-32px))] overflow-y-auto rounded-[22px] border border-[var(--canvas-border)] bg-[var(--canvas-surface)] p-0 text-[var(--canvas-text)] shadow-2xl shadow-black/60 backdrop:bg-black/75 backdrop:backdrop-blur-sm"
        >
            <form onSubmit={handleSubmit}>
                {/* --------------------------------------
                    Header
                -------------------------------------- */}

                <header className="flex items-start justify-between gap-4 border-b border-[var(--canvas-border)] px-5 py-5 sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--canvas-accent-soft)] text-[var(--canvas-accent)]">
                            <GitBranch
                                size={19}
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <h2
                                id={titleId}
                                className="text-lg font-semibold tracking-tight"
                            >
                                Create a variation
                            </h2>

                            <p
                                id={descriptionId}
                                className="mt-1 text-xs leading-5 text-[var(--canvas-text-secondary)]"
                            >
                                Explore a new creative direction
                                from your selected concept.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isGenerating}
                        aria-label="Close generation dialog"
                        className="shrink-0 rounded-lg p-2 text-[var(--canvas-text-muted)] transition-colors hover:bg-[var(--canvas-surface-hover)] hover:text-[var(--canvas-text)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <X
                            size={18}
                            aria-hidden="true"
                        />
                    </button>
                </header>

                {/* --------------------------------------
                    Form Content
                -------------------------------------- */}

                <div className="space-y-6 px-5 py-6 sm:px-6">
                    {/* Parent Concept */}

                    {parentNode && (
                        <section
                            aria-label="Parent concept"
                            className="flex items-center gap-3 rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface-raised)] p-3"
                        >
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-black/20">
                                {parentNode.image ? (
                                    <Image
                                        src={parentNode.image}
                                        alt={`${parentNode.title} preview`}
                                        fill
                                        sizes="64px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-[var(--canvas-surface-hover)]">
                                        <Sparkles
                                            size={22}
                                            aria-hidden="true"
                                            className="text-[var(--canvas-text-muted)]"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--canvas-text-muted)]">
                                    Branching from
                                </p>

                                <p className="mt-1 truncate text-sm font-medium">
                                    {parentNode.title}
                                </p>

                                <p className="mt-1 text-xs text-[var(--canvas-text-secondary)]">
                                    {parentNode.settings?.style ??
                                        DEFAULT_STYLE}
                                    {" · "}
                                    {parentNode.settings?.aspectRatio ??
                                        DEFAULT_ASPECT_RATIO}
                                </p>
                            </div>

                            <ArrowRight
                                size={16}
                                aria-hidden="true"
                                className="shrink-0 text-[var(--canvas-text-muted)]"
                            />
                        </section>
                    )}

                    {/* Creative Prompt */}

                    <div className="space-y-2">
                        <label
                            htmlFor={promptId}
                            className="block text-xs font-medium"
                        >
                            Creative direction
                        </label>

                        <textarea
                            id={promptId}
                            ref={promptRef}
                            value={prompt}
                            onChange={handlePromptChange}
                            maxLength={MAX_PROMPT_LENGTH}
                            rows={5}
                            required
                            disabled={isGenerating}
                            aria-describedby={promptHelpId}
                            placeholder="Describe how you'd like to evolve this concept..."
                            className="w-full resize-y rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-bg)] px-4 py-3 text-sm leading-6 text-[var(--canvas-text)] outline-none transition-colors placeholder:text-[var(--canvas-text-muted)] focus:border-[var(--canvas-accent)] focus:ring-2 focus:ring-[var(--canvas-accent-soft)] disabled:opacity-60"
                        />

                        <div className="flex items-center justify-between gap-3">
                            <p
                                id={promptHelpId}
                                className="text-[11px] text-[var(--canvas-text-muted)]"
                            >
                                Describe the changes you want
                                to explore.
                            </p>

                            <span className="shrink-0 font-mono text-[11px] tabular-nums text-[var(--canvas-text-muted)]">
                                {prompt.length}/
                                {MAX_PROMPT_LENGTH}
                            </span>
                        </div>
                    </div>

                    {/* Visual Style */}

                    <fieldset
                        className="space-y-3 disabled:opacity-60"
                        disabled={isGenerating}
                    >
                        <legend className="text-xs font-medium">
                            Visual style
                        </legend>

                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                            {GENERATION_STYLES.map(
                                (option) => {
                                    const selected =
                                        style === option;

                                    return (
                                        <label
                                            key={option}
                                            className={`${OPTION_BASE_CLASS} ${selected
                                                    ? OPTION_SELECTED_CLASS
                                                    : OPTION_DEFAULT_CLASS
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={styleName}
                                                value={option}
                                                checked={selected}
                                                onChange={() =>
                                                    handleStyleChange(option)
                                                }
                                                className="sr-only"
                                            />

                                            {option}
                                        </label>
                                    );
                                }
                            )}
                        </div>
                    </fieldset>

                    {/* Aspect Ratio */}

                    <fieldset
                        className="space-y-3 disabled:opacity-60"
                        disabled={isGenerating}
                    >
                        <legend className="text-xs font-medium">
                            Aspect ratio
                        </legend>

                        <div className="grid grid-cols-4 gap-2">
                            {GENERATION_ASPECT_RATIOS.map(
                                (option) => {
                                    const selected =
                                        aspectRatio === option;

                                    return (
                                        <label
                                            key={option}
                                            className={`${OPTION_BASE_CLASS} ${selected
                                                    ? OPTION_SELECTED_CLASS
                                                    : OPTION_DEFAULT_CLASS
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={aspectRatioName}
                                                value={option}
                                                checked={selected}
                                                onChange={() =>
                                                    handleAspectRatioChange(
                                                        option
                                                    )
                                                }
                                                className="sr-only"
                                            />

                                            {option}
                                        </label>
                                    );
                                }
                            )}
                        </div>
                    </fieldset>

                    {/* Generation Error */}

                    {error && (
                        <p
                            role="alert"
                            className="rounded-xl border border-[var(--fomi-error)] bg-[rgba(255,127,139,0.08)] px-4 py-3 text-xs leading-5 text-[var(--fomi-error)]"
                        >
                            {error}
                        </p>
                    )}
                </div>

                {/* --------------------------------------
                    Footer
                -------------------------------------- */}

                <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--canvas-border)] px-5 py-4 sm:px-6">
                    {/* Generation Status */}

                    <div
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        className="text-[11px] text-[var(--canvas-text-muted)]"
                    >
                        {isGenerating ? (
                            <span className="inline-flex items-center gap-2">
                                <LoaderCircle
                                    size={13}
                                    aria-hidden="true"
                                    className="animate-spin motion-reduce:animate-none"
                                />

                                Creating your creative
                                variation...
                            </span>
                        ) : (
                            <span>
                                Demo generation · Curated imagery
                            </span>
                        )}
                    </div>

                    {/* Actions */}

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleClose}
                            disabled={isGenerating}
                            className="rounded-xl border border-[var(--canvas-border)] px-4 py-2.5 text-xs font-medium transition-colors hover:bg-[var(--canvas-surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            disabled={!canGenerate}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--canvas-accent)] px-4 py-2.5 text-xs font-semibold text-[#17131f] transition-colors hover:bg-[var(--canvas-accent-hover)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <LoaderCircle
                                        size={15}
                                        aria-hidden="true"
                                        className="animate-spin motion-reduce:animate-none"
                                    />

                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Sparkles
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Generate variation
                                </>
                            )}
                        </button>
                    </div>
                </footer>
            </form>
        </dialog>
    );
};

export default BranchGenerationModal;
