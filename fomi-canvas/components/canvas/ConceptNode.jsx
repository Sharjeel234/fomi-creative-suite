
import Image from "next/image";
import { GitBranch, Sparkles } from "lucide-react";

import {
    NODE_WIDTH,
    NODE_HEIGHT,
} from "@/lib/canvas-utils";

// --------------------------------------------------
// Concept Node
// --------------------------------------------------

const ConceptNode = ({
    node,
    isSelected = false,
    onSelect,
}) => {
    const isBranch = Boolean(node.parentId);

    const title = node.title || "Untitled concept";
    const description = node.description || "No description available.";

    const style = node.settings?.style;
    const aspectRatio = node.settings?.aspectRatio;

    return (
        <button
            type="button"
            data-concept-node
            onClick={() => onSelect?.(node.id)}
            aria-label={`Select concept: ${title}`}
            aria-pressed={isSelected}
            className="absolute overflow-hidden rounded-2xl border text-left shadow-xl shadow-black/20 transition-[border-color,box-shadow] duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--canvas-focus)]"
            style={{
                left: node.position.x,
                top: node.position.y,
                width: NODE_WIDTH,
                height: NODE_HEIGHT,
                borderColor: isSelected
                    ? "var(--canvas-accent)"
                    : "var(--canvas-border)",
                background: "var(--canvas-surface-raised)",
                boxShadow: isSelected
                    ? "var(--canvas-selection-glow)"
                    : undefined,
            }}
        >
            {/* Concept Preview */}
            <div className="relative h-[190px] w-full overflow-hidden bg-black/20">
                {node.image ? (
                    <Image
                        src={node.image}
                        alt={`${title} visual concept`}
                        fill
                        sizes={`${NODE_WIDTH}px`}
                        className="object-cover"
                        draggable={false}
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[var(--canvas-surface-hover)]">
                        <Sparkles
                            size={28}
                            aria-hidden="true"
                            className="text-[var(--canvas-text-muted)]"
                        />
                    </div>
                )}
            </div>

            {/* Concept Details */}
            <div className="space-y-2 p-4">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm font-semibold text-[var(--canvas-text)]">
                        {title}
                    </span>

                    {isBranch ? (
                        <GitBranch
                            size={15}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--canvas-accent)]"
                        />
                    ) : (
                        <Sparkles
                            size={15}
                            aria-hidden="true"
                            className="shrink-0 text-[var(--canvas-accent)]"
                        />
                    )}
                </div>

                <p className="line-clamp-2 text-xs leading-5 text-[var(--canvas-text-secondary)]">
                    {description}
                </p>

                {(style || aspectRatio) && (
                    <div className="flex items-center gap-2 text-[11px] text-[var(--canvas-text-muted)]">
                        {style && <span>{style}</span>}

                        {style && aspectRatio && (
                            <span aria-hidden="true">·</span>
                        )}

                        {aspectRatio && <span>{aspectRatio}</span>}
                    </div>
                )}
            </div>
        </button>
    );
};

export default ConceptNode;
