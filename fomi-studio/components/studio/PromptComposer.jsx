
"use client";

import { useRef, useState } from "react";
import {
    ImagePlus,
    LoaderCircle,
    Sparkles,
    X,
} from "lucide-react";

const MAX_PROMPT_LENGTH = 2000;
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const PromptComposer = ({
    mode = "image",
    onModeChange,
    onGenerate,
    disabled = false,
}) => {
    const [prompt, setPrompt] = useState("");
    const [reference, setReference] = useState(null);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fileInputRef = useRef(null);

    const isBusy = disabled || isSubmitting;

    const canGenerate =
        prompt.trim().length > 0 &&
        !reference &&
        !isBusy;

    function handleFileChange(event) {
        const file = event.target.files?.[0];
        event.target.value = "";

        if (!file) return;

        if (
            !["image/jpeg", "image/png", "image/webp"].includes(
                file.type
            )
        ) {
            setError("Please select a JPG, PNG, or WebP image.");
            return;
        }

        if (file.size > MAX_FILE_SIZE) {
            setError("Reference image must be 10 MB or smaller.");
            return;
        }

        setReference(file);
        setError("");
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!canGenerate) return;

        setError("");
        setIsSubmitting(true);

        try {
            if (typeof onGenerate !== "function") {
                throw new Error("Generation service is not connected.");
            }

            await onGenerate({
                mode,
                prompt: prompt.trim(),
                reference,
            });
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Generation failed. Please try again."
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    function handlePromptKeyDown(event) {
        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey) &&
            !event.repeat &&
            !event.nativeEvent.isComposing
        ) {
            event.preventDefault();

            if (canGenerate) {
                event.currentTarget.form?.requestSubmit();
            }
        }
    }

    return (
        <section aria-label="AI prompt composer">
            <form
                onSubmit={handleSubmit}
                aria-busy={isBusy}
                className="overflow-hidden rounded-2xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)] shadow-lg shadow-black/10"
            >
                <div className="flex items-center justify-between gap-3 px-4 pt-4 sm:px-5">
                    <div
                        role="group"
                        aria-label="Generation mode"
                        className="inline-flex rounded-lg bg-[var(--fomi-surface-raised)] p-1"
                    >
                        {["image", "video"].map((item) => (
                            <button
                                key={item}
                                type="button"
                                disabled={isBusy}
                                aria-pressed={mode === item}
                                onClick={() => {
                                    onModeChange?.(item);
                                    setError("");
                                }}
                                className={`rounded-md px-4 py-2 text-xs font-medium capitalize transition-colors focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:opacity-40 ${
                                    mode === item
                                        ? "bg-[var(--fomi-surface-hover)] text-[var(--fomi-text)]"
                                        : "text-[var(--fomi-text-muted)] hover:text-[var(--fomi-text)]"
                                }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <span className="font-mono text-xs text-[var(--fomi-text-muted)]">
                        {prompt.length} / {MAX_PROMPT_LENGTH}
                    </span>
                </div>

                <div className="px-4 pt-4 sm:px-5">
                    <label
                        htmlFor="generation-prompt"
                        className="sr-only"
                    >
                        Describe your creative vision
                    </label>

                    <textarea
                        id="generation-prompt"
                        value={prompt}
                        disabled={isBusy}
                        maxLength={MAX_PROMPT_LENGTH}
                        rows={5}
                        onChange={(event) => {
                            setPrompt(event.target.value);
                            setError("");
                        }}
                        onKeyDown={handlePromptKeyDown}
                        aria-keyshortcuts="Control+Enter Meta+Enter"
                        placeholder={
                            mode === "image"
                                ? "Describe the image you want to create..."
                                : "Describe your video scene, camera movement, lighting, and atmosphere..."
                        }
                        className="w-full resize-y rounded-md bg-transparent px-1 py-1 text-sm leading-7 text-[var(--fomi-text)] outline-none transition-colors placeholder:text-[var(--fomi-text-muted)] focus-visible:bg-[var(--fomi-surface-raised)] focus-visible:outline-none disabled:opacity-60"
                    />
                </div>

                {reference && (
                    <div className="mx-4 mb-3 flex items-center justify-between gap-3 rounded-lg border border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] px-3 py-2 sm:mx-5">
                        <span className="min-w-0 truncate text-xs text-[var(--fomi-text-secondary)]">
                            {reference.name}
                        </span>

                        <button
                            type="button"
                            disabled={isBusy}
                            aria-label="Remove reference image"
                            onClick={() => setReference(null)}
                            className="rounded-md p-1 text-[var(--fomi-text-muted)] hover:text-[var(--fomi-text)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:opacity-40"
                        >
                            <X size={16} aria-hidden="true" />
                        </button>
                    </div>
                )}

                {reference && (
                    <p className="mx-4 mb-3 text-xs text-[var(--fomi-text-muted)] sm:mx-5">
                        Reference processing is not supported in this demo.
                        Remove the attachment to generate.
                    </p>
                )}

                {error && (
                    <p
                        role="alert"
                        className="mx-4 mb-3 text-xs text-[var(--fomi-error)] sm:mx-5"
                    >
                        {error}
                    </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--fomi-border)] px-4 py-3 sm:px-5">
                    <div>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            disabled={isBusy}
                            onChange={handleFileChange}
                            className="sr-only"
                            aria-label="Upload reference image"
                            tabIndex={-1}
                        />

                        <button
                            type="button"
                            disabled={isBusy}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--fomi-text-secondary)] transition-colors hover:bg-[var(--fomi-surface-raised)] hover:text-[var(--fomi-text)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:opacity-40"
                        >
                            <ImagePlus
                                size={17}
                                aria-hidden="true"
                            />
                            Reference image
                        </button>
                    </div>

                    {/* Shortcut hint and Generate button */}
                    <div className="flex items-center gap-3">
                        <kbd
                            aria-hidden="true"
                            className="hidden whitespace-nowrap font-mono text-[11px] font-medium text-[var(--fomi-text-muted)] select-none sm:inline-flex"
                        >
                            Ctrl / ⌘ + ↵
                        </kbd>

                        <button
                            type="submit"
                            disabled={!canGenerate}
                            aria-keyshortcuts="Control+Enter Meta+Enter"
                            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[var(--fomi-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--fomi-bg)] transition-colors hover:bg-[var(--fomi-accent-hover)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {isBusy ? (
                                <LoaderCircle
                                    size={17}
                                    className="animate-spin motion-reduce:animate-none"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Sparkles
                                    size={17}
                                    aria-hidden="true"
                                />
                            )}

                            {isBusy ? "Generating..." : "Generate"}
                        </button>
                    </div>
                </div>
            </form>
        </section>
    );
};

export default PromptComposer;
