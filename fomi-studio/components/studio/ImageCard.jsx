"use client";

import Image from "next/image";
import {
    ArrowUpRight,
    Download,
    Eye,
    LoaderCircle,
} from "lucide-react";

const ImageCard = ({
    image,
    onPreview,
    onDownload,
    isDownloading = false,
}) => {
    return (
        <article className="group min-w-0 overflow-hidden rounded-2xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)] transition-colors hover:border-[var(--fomi-border-strong)]">
            <button
                type="button"
                onClick={() => onPreview?.(image)}
                aria-label={`Preview ${image.title}`}
                className="relative block aspect-[4/5] w-full overflow-hidden bg-[var(--fomi-surface-raised)] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--fomi-focus)]"
            >
                <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 639px) calc(100vw - 32px), (max-width: 1279px) 45vw, 360px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transform-none"
                />

                <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100 group-focus-within:bg-black/30 group-focus-within:opacity-100">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--fomi-text)] text-[var(--fomi-bg)]">
                        <Eye size={18} aria-hidden="true" />
                    </span>
                </span>

                {image.isDemo && (
                    <span className="absolute left-3 top-3 rounded-md border border-white/15 bg-black/65 px-2 py-1 text-[10px] font-medium text-white">
                        DEMO
                    </span>
                )}
            </button>

            <div className="flex items-center justify-between gap-2 p-3">
                <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium text-[var(--fomi-text)]">
                        {image.title}
                    </h4>

                    <p className="mt-1 truncate text-xs capitalize text-[var(--fomi-text-muted)]">
                        {image.category}
                    </p>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                    <button
                        type="button"
                        disabled={isDownloading}
                        onClick={() => onDownload?.(image)}
                        aria-label={`Download ${image.title}`}
                        title="Download original image"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--fomi-text-secondary)] transition-colors hover:bg-[var(--fomi-surface-hover)] hover:text-[var(--fomi-accent)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)] disabled:cursor-wait disabled:opacity-50"
                    >
                        {isDownloading ? (
                            <LoaderCircle
                                size={18}
                                className="animate-spin motion-reduce:animate-none"
                                aria-hidden="true"
                            />
                        ) : (
                            <Download size={18} aria-hidden="true" />
                        )}
                    </button>

                    <button
                        type="button"
                        onClick={() => onPreview?.(image)}
                        aria-label={`Open ${image.title} preview`}
                        title="Open preview"
                        className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--fomi-text-secondary)] transition-colors hover:bg-[var(--fomi-surface-hover)] hover:text-[var(--fomi-accent)] focus-visible:outline-2 focus-visible:outline-[var(--fomi-focus)]"
                    >
                        <ArrowUpRight size={18} aria-hidden="true" />
                    </button>
                </div>
            </div>
        </article>
    )
}

export default ImageCard