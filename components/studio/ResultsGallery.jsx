
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import {
    Images,
    Sparkles,
    X,
    Film,
    Clapperboard,
    Eye,
    Download,
    LoaderCircle,
    AlertCircle,
    CheckCircle2,
    Info,
} from "lucide-react";

import ImageCard from "./ImageCard";
import { downloadImage } from "@/lib/download-image";

const ResultsGallery = ({
    mode = "image",
    images = [],
    isLoading = false,
    loadingCount = 2,
    generationFeedback = null,
    generationMeta = null,
    onDismissGenerationFeedback,
}) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [downloadingId, setDownloadingId] = useState(null);
    const [downloadFeedback, setDownloadFeedback] = useState(null);

    const dialogRef = useRef(null);
    const closeButtonRef = useRef(null);
    const previousFocusRef = useRef(null);

    const isVideo = mode === "video";

    const hasLimitedResults =
        !isVideo &&
        !isLoading &&
        generationMeta?.mode === "image" &&
        generationMeta.generatedCount > 0 &&
        generationMeta.generatedCount < generationMeta.requestedCount;

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog || !selectedImage) return;

        previousFocusRef.current = document.activeElement;

        const previousOverflow = document.body.style.overflow;

        if (!dialog.open) {
            dialog.showModal();
        }

        document.body.style.overflow = "hidden";
        closeButtonRef.current?.focus();

        return () => {
            document.body.style.overflow = previousOverflow;

            if (dialog.open) {
                dialog.close();
            }

            const previousElement = previousFocusRef.current;

            if (previousElement?.isConnected) {
                previousElement.focus();
            }
        };
    }, [selectedImage]);

    const openPreview = (image) => {
        setDownloadFeedback(null);
        setSelectedImage(image);
    };

    const closePreview = () => {
        setSelectedImage(null);
    };

    const handleDownload = async (image) => {
        if (downloadingId !== null || image.type === "video") {
            return;
        }

        setDownloadingId(image.id);
        setDownloadFeedback(null);

        try {
            await downloadImage(image);

            setDownloadFeedback({
                type: "success",
                message: `Download started: ${image.title}`,
            });
        } catch (error) {
            setDownloadFeedback({
                type: "error",
                message:
                    error instanceof Error
                        ? error.message
                        : "Unable to download this image.",
            });
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <section
            aria-labelledby="results-title"
            aria-busy={isLoading}
            className="min-w-0 space-y-5"
        >
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                    <h3
                        id="results-title"
                        className="text-lg font-semibold text-[var(--fomi-text)]"
                    >
                        {isVideo ? "Video previews" : "Your creations"}
                    </h3>

                    <p className="mt-1 text-sm text-[var(--fomi-text-secondary)]">
                        {isVideo
                            ? "Explore your simulated cinematic concepts."
                            : "Explore your generated results."}
                    </p>
                </div>

                {!isLoading && images.length > 0 && (
                    <span className="inline-flex shrink-0 items-center gap-2 text-xs text-[var(--fomi-text-muted)]">
                        {isVideo ? (
                            <Film size={16} aria-hidden="true" />
                        ) : (
                            <Images size={16} aria-hidden="true" />
                        )}

                        {images.length}{" "}
                        {isVideo
                            ? images.length === 1
                                ? "preview"
                                : "previews"
                            : images.length === 1
                                ? "result"
                                : "results"}
                    </span>
                )}
            </div>

            <div
                role="status"
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
            >
                {isLoading
                    ? isVideo
                        ? "Preparing simulated video preview."
                        : "Generating demo images."
                    : ""}
            </div>

            {generationFeedback && !isLoading && (
                <div
                    role={
                        generationFeedback.type === "error"
                            ? "alert"
                            : "status"
                    }
                    className={`flex items-start justify-between gap-3 rounded-xl border p-3 ${generationFeedback.type === "error"
                        ? "border-[var(--fomi-error)] bg-[var(--fomi-surface)]"
                        : "border-[var(--fomi-border)] bg-[var(--fomi-surface)]"
                        }`}
                >
                    <div className="flex min-w-0 items-start gap-3">
                        {generationFeedback.type === "error" ? (
                            <AlertCircle
                                size={18}
                                className="mt-0.5 shrink-0 text-[var(--fomi-error)]"
                                aria-hidden="true"
                            />
                        ) : hasLimitedResults ? (
                            <Info
                                size={18}
                                className="mt-0.5 shrink-0 text-[var(--fomi-accent)]"
                                aria-hidden="true"
                            />
                        ) : (
                            <CheckCircle2
                                size={18}
                                className="mt-0.5 shrink-0 text-[var(--fomi-success)]"
                                aria-hidden="true"
                            />
                        )}

                        <div className="space-y-1">
                            <p className="text-sm font-medium text-[var(--fomi-text)]">
                                {generationFeedback.type === "error"
                                    ? "Generation failed"
                                    : hasLimitedResults
                                        ? "Limited demo results"
                                        : "Preview ready"}
                            </p>

                            <p className="text-xs leading-5 text-[var(--fomi-text-secondary)]">
                                {generationFeedback.message}
                            </p>

                            {generationFeedback.type === "success" &&
                                hasLimitedResults && (
                                    <p className="text-xs leading-5 text-[var(--fomi-text-muted)]">
                                        Only unique matching assets are shown.
                                        Additional images were not duplicated.
                                    </p>
                                )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onDismissGenerationFeedback}
                        aria-label="Dismiss generation notification"
                        className="shrink-0 rounded-lg p-1 text-[var(--fomi-text-muted)] hover:bg-[var(--fomi-surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)]"
                    >
                        <X size={16} aria-hidden="true" />
                    </button>
                </div>
            )}

            {downloadFeedback && (
                <div
                    role={
                        downloadFeedback.type === "error"
                            ? "alert"
                            : "status"
                    }
                    className="flex items-start justify-between gap-3 rounded-xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)] p-3"
                >
                    <div className="flex min-w-0 items-start gap-2">
                        {downloadFeedback.type === "error" ? (
                            <AlertCircle
                                size={16}
                                className="shrink-0 text-[var(--fomi-error)]"
                                aria-hidden="true"
                            />
                        ) : (
                            <CheckCircle2
                                size={16}
                                className="shrink-0 text-[var(--fomi-success)]"
                                aria-hidden="true"
                            />
                        )}

                        <p className="text-xs leading-5 text-[var(--fomi-text-secondary)]">
                            {downloadFeedback.message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setDownloadFeedback(null)}
                        aria-label="Dismiss download notification"
                        className="shrink-0 rounded p-1 text-[var(--fomi-text-muted)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)]"
                    >
                        <X size={15} aria-hidden="true" />
                    </button>
                </div>
            )}

            {isLoading ? (
                <div
                    role="status"
                    aria-label={
                        isVideo
                            ? "Preparing video preview"
                            : "Generating images"
                    }
                    className={`grid gap-4 ${isVideo
                        ? "grid-cols-1"
                        : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                        }`}
                >
                    {Array.from(
                        { length: loadingCount },
                        (_, index) => index
                    ).map((item) => (
                        <div
                            key={item}
                            className="overflow-hidden rounded-2xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)]"
                        >
                            <div
                                className={`animate-pulse bg-[var(--fomi-surface-raised)] motion-reduce:animate-none ${isVideo
                                    ? "aspect-video"
                                    : "aspect-[4/5]"
                                    }`}
                            />

                            <div className="space-y-2 p-3">
                                <div className="h-4 w-2/3 animate-pulse rounded bg-[var(--fomi-surface-raised)] motion-reduce:animate-none" />
                                <div className="h-3 w-1/3 animate-pulse rounded bg-[var(--fomi-surface-raised)] motion-reduce:animate-none" />
                            </div>
                        </div>
                    ))}

                    <span className="sr-only">
                        {isVideo
                            ? "Preparing simulated video preview."
                            : "Generating demo images."}
                    </span>
                </div>
            ) : images.length === 0 ? (
                <div className="flex min-h-56 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[var(--fomi-border-strong)] bg-[var(--fomi-surface)] px-6 py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--fomi-surface-raised)] text-[var(--fomi-accent)]">
                        {isVideo ? (
                            <Clapperboard
                                size={22}
                                aria-hidden="true"
                            />
                        ) : (
                            <Sparkles
                                size={22}
                                aria-hidden="true"
                            />
                        )}
                    </div>

                    <p className="text-sm font-medium text-[var(--fomi-text)]">
                        {isVideo
                            ? "Your video concepts will appear here"
                            : "Your creations will appear here"}
                    </p>

                    <p className="max-w-sm text-xs leading-6 text-[var(--fomi-text-muted)]">
                        {isVideo
                            ? "Describe a cinematic scene and generate a simulated poster preview."
                            : "Enter a prompt, adjust your settings, and generate your first visual."}
                    </p>
                </div>
            ) : isVideo ? (
                <div className="space-y-4">
                    {images.map((video) => (
                        <article
                            key={video.id}
                            className="overflow-hidden rounded-2xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)]"
                        >
                            <button
                                type="button"
                                onClick={() => openPreview(video)}
                                aria-label={`Preview ${video.title}`}
                                className="group relative block w-full overflow-hidden bg-[var(--fomi-surface-raised)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)]"
                            >
                                <div
                                    className="relative w-full"
                                    style={{
                                        aspectRatio:
                                            video.aspectRatio === "9:16"
                                                ? "9 / 16"
                                                : "16 / 9",
                                        maxHeight: "440px",
                                    }}
                                >
                                    <Image
                                        src={video.src}
                                        alt={video.alt}
                                        fill
                                        sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1023px) calc(100vw - 48px), 900px"
                                        className="object-contain transition-transform duration-500 group-hover:scale-[1.02] motion-reduce:transform-none"
                                    />
                                </div>

                                <span className="absolute left-4 top-4 rounded-md border border-white/20 bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white">
                                    SIMULATED PREVIEW
                                </span>

                                <span className="absolute bottom-4 right-4 flex items-center gap-2 rounded-lg bg-black/75 px-3 py-2 text-xs font-medium text-white">
                                    <Eye size={15} aria-hidden="true" />
                                    View poster
                                </span>
                            </button>

                            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
                                <div>
                                    <h4 className="text-sm font-semibold text-[var(--fomi-text)]">
                                        {video.title}
                                    </h4>

                                    <p className="mt-1 text-xs text-[var(--fomi-text-muted)]">
                                        Static concept poster ·{" "}
                                        {video.duration}s concept ·{" "}
                                        {video.aspectRatio}
                                    </p>
                                </div>

                                <span className="rounded-lg bg-[var(--fomi-surface-raised)] px-3 py-1.5 text-xs text-[var(--fomi-text-secondary)]">
                                    Demo asset
                                </span>
                            </div>
                        </article>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {images.map((image) => (
                        <ImageCard
                            key={image.id}
                            image={image}
                            onPreview={openPreview}
                            onDownload={handleDownload}
                            isDownloading={downloadingId === image.id}
                        />
                    ))}
                </div>
            )}

            {selectedImage && (
                <dialog
                    ref={dialogRef}
                    aria-label={`Preview ${selectedImage.title}`}
                    onClose={closePreview}
                    onCancel={(event) => {
                        event.preventDefault();
                        closePreview();
                    }}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closePreview();
                        }
                    }}
                    className="fixed inset-0 m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-4xl overflow-hidden rounded-2xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)] p-0 text-[var(--fomi-text)] backdrop:bg-black/80"
                >
                    <div className="flex max-h-[90dvh] flex-col">
                        <div className="flex items-center justify-between gap-3 border-b border-[var(--fomi-border)] px-4 py-3">
                            <div className="min-w-0">
                                <h4 className="truncate text-sm font-semibold">
                                    {selectedImage.title}
                                </h4>

                                <p className="mt-1 text-xs text-[var(--fomi-text-muted)]">
                                    {selectedImage.type === "video"
                                        ? "Simulated video concept"
                                        : "Original demo image"}
                                </p>
                            </div>

                            <button
                                ref={closeButtonRef}
                                type="button"
                                onClick={closePreview}
                                aria-label="Close preview"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--fomi-text-secondary)] hover:bg-[var(--fomi-surface-hover)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)]"
                            >
                                <X size={19} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="min-h-0 overflow-y-auto p-4">
                            <div className="relative mx-auto h-[min(60dvh,600px)] w-full">
                                <Image
                                    src={selectedImage.src}
                                    alt={selectedImage.alt}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 900px"
                                    className="object-contain"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--fomi-border)] pt-4">
                                <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-[var(--fomi-text-secondary)]">
                                    <span>
                                        <strong className="font-medium text-[var(--fomi-text)]">
                                            Type:
                                        </strong>{" "}
                                        {selectedImage.type === "video"
                                            ? "Video concept poster"
                                            : "Image"}
                                    </span>

                                    <span>
                                        <strong className="font-medium text-[var(--fomi-text)]">
                                            Ratio:
                                        </strong>{" "}
                                        {selectedImage.aspectRatio || "Original"}
                                    </span>

                                    {selectedImage.quality && (
                                        <span>
                                            <strong className="font-medium text-[var(--fomi-text)]">
                                                Quality:
                                            </strong>{" "}
                                            {selectedImage.quality}
                                        </span>
                                    )}

                                    {selectedImage.duration && (
                                        <span>
                                            <strong className="font-medium text-[var(--fomi-text)]">
                                                Concept duration:
                                            </strong>{" "}
                                            {selectedImage.duration}s
                                        </span>
                                    )}
                                </div>

                                {selectedImage.type !== "video" && (
                                    <button
                                        type="button"
                                        disabled={downloadingId !== null}
                                        onClick={() =>
                                            handleDownload(selectedImage)
                                        }
                                        className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[var(--fomi-accent)] px-4 py-2 text-xs font-semibold text-[var(--fomi-bg)] transition-colors hover:bg-[var(--fomi-accent-hover)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-wait disabled:opacity-50"
                                    >
                                        {downloadingId === selectedImage.id ? (
                                            <LoaderCircle
                                                size={16}
                                                className="animate-spin motion-reduce:animate-none"
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <Download
                                                size={16}
                                                aria-hidden="true"
                                            />
                                        )}

                                        {downloadingId === selectedImage.id
                                            ? "Preparing..."
                                            : "Download original"}
                                    </button>
                                )}
                            </div>

                            {selectedImage.isDemo && (
                                <p className="mt-3 text-xs leading-5 text-[var(--fomi-text-muted)]">
                                    {selectedImage.type === "video"
                                        ? "This is a static cinematic concept poster. No playable video or MP4 file has been generated."
                                        : "This is a curated local demo asset, not an AI-generated image. Downloads use the original file, not a resized generation."}
                                </p>
                            )}

                            {downloadFeedback && (
                                <p
                                    role={
                                        downloadFeedback.type === "error"
                                            ? "alert"
                                            : "status"
                                    }
                                    className={`mt-3 text-xs ${downloadFeedback.type === "error"
                                        ? "text-[var(--fomi-error)]"
                                        : "text-[var(--fomi-success)]"
                                        }`}
                                >
                                    {downloadFeedback.message}
                                </p>
                            )}
                        </div>
                    </div>
                </dialog>
            )}
        </section>
    );
};

export default ResultsGallery;
