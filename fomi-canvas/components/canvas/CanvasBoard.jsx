
"use client";

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";

import ConceptNode from "./ConceptNode";
import BranchConnections from "./BranchConnections";
import CanvasToolbar from "@/components/controls/CanvasToolbar";

import {
    DEFAULT_ZOOM,
    getFitView,
    getFocusedView,
    getNodeById,
    getNodesBounds,
    zoomAtPoint,
} from "@/lib/canvas-utils";

// --------------------------------------------------
// Configuration
// --------------------------------------------------

const MIN_CANVAS_WIDTH = 1320;
const MIN_CANVAS_HEIGHT = 820;
const CANVAS_PADDING = 120;

const GENERATED_NODE_ZOOM = 0.9;
const ANIMATION_DURATION = 360;

const INTERACTIVE_SELECTOR = [
    "[data-concept-node]",
    "[data-canvas-control]",
    "button",
    "input",
    "textarea",
    "select",
    "a",
    '[role="button"]',
    '[contenteditable="true"]',
].join(",");

// --------------------------------------------------
// Canvas Board
// --------------------------------------------------

const CanvasBoard = ({
    nodes,
    selectedNodeId,
    onSelectNode,
    focusNodeRequest = null,
}) => {
    const viewportRef = useRef(null);
    const dragRef = useRef(null);

    const fittedRef = useRef(false);
    const lastFocusRequestRef = useRef(null);

    const animationTimerRef = useRef(null);
    const animationFrameRef = useRef(null);
    const animationActiveRef = useRef(false);

    const [viewport, setViewport] = useState({
        width: 0,
        height: 0,
    });

    const [view, setView] = useState({
        zoom: DEFAULT_ZOOM,
        pan: { x: 0, y: 0 },
    });

    const viewRef = useRef(view);

    const [isDragging, setIsDragging] = useState(false);
    const [isAnimatingView, setIsAnimatingView] =
        useState(false);

    // --------------------------------------------------
    // Animation Helpers
    // --------------------------------------------------

    const cancelViewAnimation = useCallback(() => {
        if (animationTimerRef.current !== null) {
            clearTimeout(animationTimerRef.current);
            animationTimerRef.current = null;
        }

        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(
                animationFrameRef.current
            );
            animationFrameRef.current = null;
        }

        animationActiveRef.current = false;
        setIsAnimatingView(false);
    }, []);

    const animateToView = useCallback(
        (nextView) => {
            if (!nextView) return;

            cancelViewAnimation();

            const prefersReducedMotion =
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches;

            if (prefersReducedMotion) {
                viewRef.current = nextView;
                setView(nextView);
                return;
            }

            animationActiveRef.current = true;
            setIsAnimatingView(true);

            animationFrameRef.current =
                requestAnimationFrame(() => {
                    animationFrameRef.current =
                        requestAnimationFrame(() => {
                            viewRef.current = nextView;
                            setView(nextView);

                            animationFrameRef.current =
                                null;
                        });
                });

            animationTimerRef.current =
                setTimeout(() => {
                    animationActiveRef.current =
                        false;

                    setIsAnimatingView(false);

                    animationTimerRef.current =
                        null;
                }, ANIMATION_DURATION + 50);
        },
        [cancelViewAnimation]
    );

    // --------------------------------------------------
    // Cleanup
    // --------------------------------------------------

    useEffect(() => {
        return () => {
            if (
                animationTimerRef.current !== null
            ) {
                clearTimeout(
                    animationTimerRef.current
                );
            }

            if (
                animationFrameRef.current !== null
            ) {
                cancelAnimationFrame(
                    animationFrameRef.current
                );
            }
        };
    }, []);

    // --------------------------------------------------
    // Viewport Measurement
    // --------------------------------------------------

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;

        const observer = new ResizeObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry) return;

                const { width, height } =
                    entry.contentRect;

                setViewport((current) => {
                    if (
                        current.width === width &&
                        current.height === height
                    ) {
                        return current;
                    }

                    return { width, height };
                });
            }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, []);

    // --------------------------------------------------
    // Initial Fit
    // --------------------------------------------------

    useEffect(() => {
        if (
            fittedRef.current ||
            !viewport.width ||
            !viewport.height ||
            !nodes.length ||
            focusNodeRequest
        ) {
            return;
        }

        const nextView = getFitView(
            nodes,
            viewport
        );

        const frame = requestAnimationFrame(() => {
            if (fittedRef.current) return;

            fittedRef.current = true;
            viewRef.current = nextView;
            setView(nextView);
        });

        return () => cancelAnimationFrame(frame);
    }, [nodes, viewport, focusNodeRequest]);

    // --------------------------------------------------
    // Focus Requests
    // --------------------------------------------------

    useEffect(() => {
        if (!focusNodeRequest) return;
        if (!viewport.width || !viewport.height) {
            return;
        }

        if (
            lastFocusRequestRef.current ===
            focusNodeRequest.requestId
        ) {
            return;
        }

        const targetNode = getNodeById(
            nodes,
            focusNodeRequest.nodeId
        );

        if (!targetNode) return;

        const nextView = getFocusedView(
            targetNode,
            viewport,
            GENERATED_NODE_ZOOM
        );

        if (!nextView) return;

        const frame = requestAnimationFrame(() => {
            if (
                lastFocusRequestRef.current ===
                focusNodeRequest.requestId
            ) {
                return;
            }

            fittedRef.current = true;

            lastFocusRequestRef.current =
                focusNodeRequest.requestId;

            animateToView(nextView);
        });

        return () => cancelAnimationFrame(frame);
    }, [
        focusNodeRequest,
        nodes,
        viewport,
        animateToView,
    ]);

    // --------------------------------------------------
    // Viewport Helpers
    // --------------------------------------------------

    const getViewportCenter = useCallback(
        () => ({
            x: viewport.width / 2,
            y: viewport.height / 2,
        }),
        [viewport.width, viewport.height]
    );

    // --------------------------------------------------
    // Zoom
    // --------------------------------------------------

    const handleZoom = useCallback(
        (factor) => {
            if (
                !viewport.width ||
                !viewport.height
            ) {
                return;
            }

            cancelViewAnimation();

            setView((current) => {
                const nextView = zoomAtPoint(
                    current,
                    getViewportCenter(),
                    current.zoom * factor
                );

                viewRef.current = nextView;
                return nextView;
            });
        },
        [
            viewport.width,
            viewport.height,
            getViewportCenter,
            cancelViewAnimation,
        ]
    );

    // --------------------------------------------------
    // Fit / Reset / Focus
    // --------------------------------------------------

    const handleFitView = useCallback(() => {
        if (
            !viewport.width ||
            !viewport.height
        ) {
            return;
        }

        animateToView(
            getFitView(nodes, viewport)
        );
    }, [nodes, viewport, animateToView]);

    const handleResetView = handleFitView;

    const handleFocusSelected = useCallback(
        () => {
            if (
                !viewport.width ||
                !viewport.height
            ) {
                return;
            }

            const selectedNode = getNodeById(
                nodes,
                selectedNodeId
            );

            const nextView = getFocusedView(
                selectedNode,
                viewport,
                DEFAULT_ZOOM
            );

            if (nextView) {
                animateToView(nextView);
            }
        },
        [
            nodes,
            selectedNodeId,
            viewport,
            animateToView,
        ]
    );

    // --------------------------------------------------
    // Pointer Drag
    // --------------------------------------------------

    function handlePointerDown(event) {
        if (event.button !== 0) return;
        if (dragRef.current) return;

        if (!(event.target instanceof Element)) {
            return;
        }

        if (
            event.target.closest(
                INTERACTIVE_SELECTOR
            )
        ) {
            return;
        }

        cancelViewAnimation();

        const currentView = viewRef.current;

        dragRef.current = {
            pointerId: event.pointerId,
            startX: event.clientX,
            startY: event.clientY,
            panX: currentView.pan.x,
            panY: currentView.pan.y,
        };

        event.currentTarget.setPointerCapture(
            event.pointerId
        );

        setIsDragging(true);
    }

    function handlePointerMove(event) {
        const drag = dragRef.current;

        if (
            !drag ||
            drag.pointerId !== event.pointerId
        ) {
            return;
        }

        const deltaX =
            event.clientX - drag.startX;

        const deltaY =
            event.clientY - drag.startY;

        setView((current) => {
            const nextView = {
                ...current,
                pan: {
                    x: drag.panX + deltaX,
                    y: drag.panY + deltaY,
                },
            };

            viewRef.current = nextView;
            return nextView;
        });
    }

    function handlePointerEnd(event) {
        const drag = dragRef.current;

        if (
            !drag ||
            drag.pointerId !== event.pointerId
        ) {
            return;
        }

        dragRef.current = null;
        setIsDragging(false);

        if (
            event.currentTarget.hasPointerCapture(
                event.pointerId
            )
        ) {
            event.currentTarget.releasePointerCapture(
                event.pointerId
            );
        }
    }

    // --------------------------------------------------
    // Mouse Wheel Zoom
    // --------------------------------------------------

    useEffect(() => {
        const element = viewportRef.current;
        if (!element) return;

        function handleWheel(event) {
            if (
                event.target instanceof Element &&
                event.target.closest(
                    INTERACTIVE_SELECTOR
                )
            ) {
                return;
            }

            if (
                !element.clientWidth ||
                !element.clientHeight
            ) {
                return;
            }

            event.preventDefault();

            const rect =
                element.getBoundingClientRect();

            const point = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top,
            };

            const deltaMultiplier =
                event.deltaMode === 1
                    ? 16
                    : event.deltaMode === 2
                        ? element.clientHeight
                        : 1;

            const normalizedDelta =
                event.deltaY * deltaMultiplier;

            const factor = Math.exp(
                -normalizedDelta * 0.0015
            );

            if (
                animationTimerRef.current !== null
            ) {
                clearTimeout(
                    animationTimerRef.current
                );

                animationTimerRef.current =
                    null;
            }

            if (
                animationFrameRef.current !== null
            ) {
                cancelAnimationFrame(
                    animationFrameRef.current
                );

                animationFrameRef.current =
                    null;
            }

            animationActiveRef.current = false;
            setIsAnimatingView(false);

            setView((current) => {
                const nextView = zoomAtPoint(
                    current,
                    point,
                    current.zoom * factor
                );

                viewRef.current = nextView;
                return nextView;
            });
        }

        element.addEventListener(
            "wheel",
            handleWheel,
            { passive: false }
        );

        return () => {
            element.removeEventListener(
                "wheel",
                handleWheel
            );
        };
    }, []);

    // --------------------------------------------------
    // Canvas Dimensions
    // --------------------------------------------------

    const {
        canvasWidth,
        canvasHeight,
    } = useMemo(() => {
        if (!nodes.length) {
            return {
                canvasWidth: MIN_CANVAS_WIDTH,
                canvasHeight: MIN_CANVAS_HEIGHT,
            };
        }

        const bounds = getNodesBounds(nodes);

        return {
            canvasWidth: Math.max(
                MIN_CANVAS_WIDTH,
                bounds.x +
                bounds.width +
                CANVAS_PADDING
            ),

            canvasHeight: Math.max(
                MIN_CANVAS_HEIGHT,
                bounds.y +
                bounds.height +
                CANVAS_PADDING
            ),
        };
    }, [nodes]);

    // --------------------------------------------------
    // Render
    // --------------------------------------------------

    return (
        <div
            ref={viewportRef}
            className="canvas-board h-full w-full touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerEnd}
            onPointerCancel={handlePointerEnd}
            onLostPointerCapture={handlePointerEnd}
            style={{
                cursor: isDragging
                    ? "grabbing"
                    : "grab",
            }}
            aria-label="Interactive creative canvas"
        >
            {/* Canvas World */}
            <div
                className="absolute left-0 top-0"
                style={{
                    width: canvasWidth,
                    height: canvasHeight,

                    transform: `translate3d(${view.pan.x}px, ${view.pan.y}px, 0) scale(${view.zoom})`,

                    transformOrigin: "0 0",

                    willChange:
                        isDragging ||
                            isAnimatingView
                            ? "transform"
                            : "auto",

                    transition: isAnimatingView
                        ? `transform ${ANIMATION_DURATION}ms cubic-bezier(.16,1,.3,1)`
                        : "none",
                }}
            >
                <BranchConnections
                    nodes={nodes}
                    selectedNodeId={
                        selectedNodeId
                    }
                />

                {nodes.map((node) => (
                    <ConceptNode
                        key={node.id}
                        node={node}
                        isSelected={
                            node.id === selectedNodeId
                        }
                        onSelect={onSelectNode}
                    />
                ))}
            </div>

            {/* Canvas Information */}
            <div className="pointer-events-none absolute left-5 top-5 z-10 rounded-xl border border-[var(--canvas-border)] bg-[var(--canvas-surface)]/90 px-4 py-3 backdrop-blur-md">
                <p className="text-xs font-medium text-[var(--canvas-text)]">
                    Creative Direction Map
                </p>

                <p className="mt-1 text-[11px] text-[var(--canvas-text-muted)]">
                    Drag to pan · Scroll to zoom
                </p>
            </div>

            {/* Canvas Toolbar */}
            <CanvasToolbar
                zoom={view.zoom}
                onZoomIn={() =>
                    handleZoom(1.2)
                }
                onZoomOut={() =>
                    handleZoom(1 / 1.2)
                }
                onFitView={handleFitView}
                onResetView={handleResetView}
                onFocusSelected={
                    handleFocusSelected
                }
                canFocusSelected={Boolean(
                    getNodeById(
                        nodes,
                        selectedNodeId
                    )
                )}
            />
        </div>
    );
};

export default CanvasBoard;
