
// --------------------------------------------------
// Canvas Constants
// --------------------------------------------------

export const NODE_WIDTH = 280;
export const NODE_HEIGHT = 320;

export const MIN_ZOOM = 0.4;
export const MAX_ZOOM = 2;
export const DEFAULT_ZOOM = 1;

// --------------------------------------------------
// Node Lookup
// --------------------------------------------------

export function getNodeById(nodes, id) {
    if (!Array.isArray(nodes)) {
        return null;
    }

    return (
        nodes.find(
            (node) => node?.id === id
        ) ?? null
    );
}

// --------------------------------------------------
// Direct Children
// --------------------------------------------------

export function getChildNodes(nodes, parentId) {
    if (!Array.isArray(nodes)) {
        return [];
    }

    return nodes.filter(
        (node) =>
            node &&
            node.id !== parentId &&
            node.parentId === parentId
    );
}

// --------------------------------------------------
// Node Path
// --------------------------------------------------

/**
 * Returns the ancestry path from the
 * highest reachable ancestor to the node.
 *
 * Prevents infinite loops caused by
 * circular parent references.
 */
export function getNodePath(nodes, nodeId) {
    const path = [];
    const visited = new Set();

    let currentNode = getNodeById(
        nodes,
        nodeId
    );

    while (
        currentNode &&
        !visited.has(currentNode.id)
    ) {
        visited.add(currentNode.id);

        path.unshift(currentNode);

        currentNode = currentNode.parentId
            ? getNodeById(
                nodes,
                currentNode.parentId
            )
            : null;
    }

    return path;
}

// --------------------------------------------------
// Node Connections
// --------------------------------------------------

/**
 * Returns valid parent-to-child connections.
 */
export function getNodeConnections(nodes) {
    if (!Array.isArray(nodes)) {
        return [];
    }

    const validIds = new Set(
        nodes
            .filter((node) => node?.id)
            .map((node) => node.id)
    );

    return nodes
        .filter(
            (node) =>
                node?.parentId &&
                node.id !== node.parentId &&
                validIds.has(node.parentId)
        )
        .map((node) => ({
            id: `${node.parentId}-${node.id}`,
            sourceId: node.parentId,
            targetId: node.id,
        }));
}

// --------------------------------------------------
// Connection Path
// --------------------------------------------------

/**
 * Creates a cubic Bézier curve connecting
 * the right edge of the parent to the
 * left edge of the child.
 */
export function getConnectionPath(source, target) {
    if (
        !source?.position ||
        !target?.position
    ) {
        return "";
    }

    const startX =
        source.position.x + NODE_WIDTH;

    const startY =
        source.position.y + NODE_HEIGHT / 2;

    const endX = target.position.x;

    const endY =
        target.position.y + NODE_HEIGHT / 2;

    const controlOffset = Math.max(
        60,
        Math.abs(endX - startX) * 0.45
    );

    return [
        `M ${startX} ${startY}`,
        `C ${startX + controlOffset} ${startY},`,
        `${endX - controlOffset} ${endY},`,
        `${endX} ${endY}`,
    ].join(" ");
}

// --------------------------------------------------
// Zoom Utilities
// --------------------------------------------------

/**
 * Restricts zoom to the supported range.
 */
export function clampZoom(zoom) {
    if (!Number.isFinite(zoom)) {
        return DEFAULT_ZOOM;
    }

    return Math.min(
        MAX_ZOOM,
        Math.max(MIN_ZOOM, zoom)
    );
}

// --------------------------------------------------
// Node Bounds
// --------------------------------------------------

/**
 * Returns the bounding rectangle
 * containing all positioned nodes.
 */
export function getNodesBounds(nodes) {
    if (!Array.isArray(nodes) || !nodes.length) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    let hasValidNode = false;

    for (const node of nodes) {
        const x = node?.position?.x;
        const y = node?.position?.y;

        if (
            !Number.isFinite(x) ||
            !Number.isFinite(y)
        ) {
            continue;
        }

        hasValidNode = true;

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);

        maxX = Math.max(
            maxX,
            x + NODE_WIDTH
        );

        maxY = Math.max(
            maxY,
            y + NODE_HEIGHT
        );
    }

    if (!hasValidNode) {
        return {
            x: 0,
            y: 0,
            width: 0,
            height: 0,
        };
    }

    return {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
    };
}

// --------------------------------------------------
// Fit View
// --------------------------------------------------

/**
 * Centers the node graph inside the viewport.
 *
 * Zoom is constrained to the supported range.
 */
export function getFitView(
    nodes,
    viewport,
    padding = 64
) {
    if (
        !Array.isArray(nodes) ||
        !nodes.length ||
        !Number.isFinite(viewport?.width) ||
        !Number.isFinite(viewport?.height) ||
        viewport.width <= 0 ||
        viewport.height <= 0
    ) {
        return {
            zoom: DEFAULT_ZOOM,
            pan: { x: 0, y: 0 },
        };
    }

    const bounds = getNodesBounds(nodes);

    if (!bounds.width || !bounds.height) {
        return {
            zoom: DEFAULT_ZOOM,
            pan: { x: 0, y: 0 },
        };
    }

    const safePadding =
        Number.isFinite(padding)
            ? Math.max(0, padding)
            : 64;

    const availableWidth = Math.max(
        1,
        viewport.width - safePadding * 2
    );

    const availableHeight = Math.max(
        1,
        viewport.height - safePadding * 2
    );

    const fitZoom = Math.min(
        availableWidth / bounds.width,
        availableHeight / bounds.height,
        DEFAULT_ZOOM
    );

    const zoom = clampZoom(fitZoom);

    return {
        zoom,
        pan: {
            x:
                viewport.width / 2 -
                (bounds.x + bounds.width / 2) *
                zoom,

            y:
                viewport.height / 2 -
                (bounds.y + bounds.height / 2) *
                zoom,
        },
    };
}

// --------------------------------------------------
// Focused View
// --------------------------------------------------

/**
 * Centers a specific concept in the viewport.
 */
export function getFocusedView(
    node,
    viewport,
    zoom = DEFAULT_ZOOM
) {
    if (
        !Number.isFinite(node?.position?.x) ||
        !Number.isFinite(node?.position?.y) ||
        !Number.isFinite(viewport?.width) ||
        !Number.isFinite(viewport?.height)
    ) {
        return null;
    }

    const nextZoom = clampZoom(zoom);

    return {
        zoom: nextZoom,
        pan: {
            x:
                viewport.width / 2 -
                (
                    node.position.x +
                    NODE_WIDTH / 2
                ) * nextZoom,

            y:
                viewport.height / 2 -
                (
                    node.position.y +
                    NODE_HEIGHT / 2
                ) * nextZoom,
        },
    };
}

// --------------------------------------------------
// Pointer-Anchored Zoom
// --------------------------------------------------

/**
 * Zooms around a point in viewport coordinates
 * while keeping the point's canvas position fixed.
 */
export function zoomAtPoint(
    view,
    point,
    nextZoom
) {
    const currentZoom = clampZoom(
        view?.zoom
    );

    const zoom = clampZoom(nextZoom);

    const currentPanX =
        Number.isFinite(view?.pan?.x)
            ? view.pan.x
            : 0;

    const currentPanY =
        Number.isFinite(view?.pan?.y)
            ? view.pan.y
            : 0;

    const pointX =
        Number.isFinite(point?.x)
            ? point.x
            : 0;

    const pointY =
        Number.isFinite(point?.y)
            ? point.y
            : 0;

    const ratio = zoom / currentZoom;

    return {
        zoom,
        pan: {
            x:
                pointX -
                (pointX - currentPanX) * ratio,

            y:
                pointY -
                (pointY - currentPanY) * ratio,
        },
    };
}
