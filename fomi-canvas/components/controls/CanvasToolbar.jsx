
import {
    Focus,
    Maximize2,
    RotateCcw,
    ZoomIn,
    ZoomOut,
} from "lucide-react";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const MIN_ZOOM = 0.4;
const MAX_ZOOM = 2;

// --------------------------------------------------
// Reusable Toolbar Button
// --------------------------------------------------

const ToolbarButton = ({
    label,
    onClick,
    disabled = false,
    children,
}) => {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            aria-label={label}
            title={label}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--canvas-text-secondary)] transition-colors hover:bg-[var(--canvas-surface-hover)] hover:text-[var(--canvas-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--canvas-focus)] disabled:cursor-not-allowed disabled:opacity-35 disabled:hover:bg-transparent"
        >
            {children}
        </button>
    );
};

// --------------------------------------------------
// Canvas Toolbar
// --------------------------------------------------

const CanvasToolbar = ({
    zoom,
    onZoomIn,
    onZoomOut,
    onFitView,
    onResetView,
    onFocusSelected,
    canFocusSelected = false,
}) => {
    const canZoomIn = zoom < MAX_ZOOM - 0.001;
    const canZoomOut = zoom > MIN_ZOOM + 0.001;

    return (
        <div
            data-canvas-control
            role="toolbar"
            aria-label="Canvas view controls"
            className="absolute bottom-3 left-1/2 z-20 flex max-w-[calc(100%-16px)] -translate-x-1/2 items-center gap-0.5 rounded-2xl border border-[var(--canvas-border)] bg-[var(--canvas-surface)] p-1.5 shadow-2xl shadow-black/30 sm:bottom-5 sm:gap-1"
        >
            {/* Zoom Out */}
            <ToolbarButton
                label="Zoom out"
                onClick={onZoomOut}
                disabled={!canZoomOut}
            >
                <ZoomOut size={17} aria-hidden="true" />
            </ToolbarButton>

            {/* Current Zoom */}
            <output
                aria-label="Current zoom level"
                className="min-w-11 text-center font-mono text-xs tabular-nums text-[var(--canvas-text-secondary)] sm:min-w-12"
            >
                {Math.round(zoom * 100)}%
            </output>

            {/* Zoom In */}
            <ToolbarButton
                label="Zoom in"
                onClick={onZoomIn}
                disabled={!canZoomIn}
            >
                <ZoomIn size={17} aria-hidden="true" />
            </ToolbarButton>

            {/* Separator */}
            <div
                aria-hidden="true"
                className="mx-0.5 h-6 w-px shrink-0 bg-[var(--canvas-border)] sm:mx-1"
            />

            {/* Fit All Concepts */}
            <ToolbarButton
                label="Fit all concepts"
                onClick={onFitView}
            >
                <Maximize2 size={17} aria-hidden="true" />
            </ToolbarButton>

            {/* Reset View */}
            <ToolbarButton
                label="Reset view"
                onClick={onResetView}
            >
                <RotateCcw size={17} aria-hidden="true" />
            </ToolbarButton>

            {/* Focus Selected Concept */}
            {canFocusSelected && (
                <ToolbarButton
                    label="Focus selected concept"
                    onClick={onFocusSelected}
                >
                    <Focus size={17} aria-hidden="true" />
                </ToolbarButton>
            )}
        </div>
    );
};

export default CanvasToolbar;
