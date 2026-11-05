
import { getNodeById } from "./canvas-utils";

// --------------------------------------------------
// Get Ancestors
// --------------------------------------------------

/**
 * Returns ancestors ordered from the highest
 * reachable parent to the immediate parent.
 *
 * Prevents circular references and duplicate IDs.
 */
export function getNodeAncestors(nodes, nodeId) {
    const ancestors = [];

    if (!Array.isArray(nodes) || !nodeId) {
        return ancestors;
    }

    const currentNode = getNodeById(nodes, nodeId);

    if (!currentNode) {
        return ancestors;
    }

    const visited = new Set([nodeId]);

    let parentId = currentNode.parentId;

    while (parentId && !visited.has(parentId)) {
        const parentNode = getNodeById(
            nodes,
            parentId
        );

        if (!parentNode) {
            break;
        }

        visited.add(parentId);
        ancestors.unshift(parentNode);

        parentId = parentNode.parentId;
    }

    return ancestors;
}

// --------------------------------------------------
// Get Complete Lineage
// --------------------------------------------------

/**
 * Returns the lineage from the highest
 * reachable ancestor to the selected node.
 */
export function getNodeLineage(nodes, nodeId) {
    if (!Array.isArray(nodes)) {
        return [];
    }

    const currentNode = getNodeById(
        nodes,
        nodeId
    );

    if (!currentNode) {
        return [];
    }

    return [
        ...getNodeAncestors(nodes, nodeId),
        currentNode,
    ];
}

// --------------------------------------------------
// Get Direct Children
// --------------------------------------------------

/**
 * Returns direct children in their existing
 * array order.
 */
export function getDirectChildren(nodes, nodeId) {
    if (!Array.isArray(nodes) || !nodeId) {
        return [];
    }

    return nodes.filter(
        (node) =>
            node &&
            node.id !== nodeId &&
            node.parentId === nodeId
    );
}

// --------------------------------------------------
// Get All Descendants
// --------------------------------------------------

/**
 * Returns descendants in depth-first order.
 *
 * Uses iterative traversal to avoid
 * recursive call-stack overflow.
 *
 * Prevents cycles and duplicate results.
 */
export function getNodeDescendants(nodes, nodeId) {
    if (
        !Array.isArray(nodes) ||
        !getNodeById(nodes, nodeId)
    ) {
        return [];
    }

    const descendants = [];
    const visited = new Set([nodeId]);

    // Build a parent-to-children lookup.
    const childrenByParent = new Map();

    for (const node of nodes) {
        if (!node?.parentId) {
            continue;
        }

        if (!childrenByParent.has(node.parentId)) {
            childrenByParent.set(
                node.parentId,
                []
            );
        }

        childrenByParent
            .get(node.parentId)
            .push(node);
    }

    // Stack is reversed to preserve
    // the original child ordering.
    const stack = [
        ...(childrenByParent.get(nodeId) ?? [])
    ].reverse();

    while (stack.length > 0) {
        const node = stack.pop();

        if (!node || visited.has(node.id)) {
            continue;
        }

        visited.add(node.id);
        descendants.push(node);

        const children =
            childrenByParent.get(node.id) ?? [];

        for (
            let index = children.length - 1;
            index >= 0;
            index--
        ) {
            const child = children[index];

            if (!visited.has(child.id)) {
                stack.push(child);
            }
        }
    }

    return descendants;
}

// --------------------------------------------------
// Get Node Depth
// --------------------------------------------------

/**
 * Returns the number of ancestors
 * between the selected node and the
 * highest reachable parent.
 */
export function getNodeDepth(nodes, nodeId) {
    return getNodeAncestors(
        nodes,
        nodeId
    ).length;
}

// --------------------------------------------------
// Get Root Node
// --------------------------------------------------

/**
 * Returns the highest reachable ancestor.
 *
 * For malformed cyclic data, this is
 * not guaranteed to be a true root.
 */
export function getRootNode(nodes, nodeId) {
    const lineage = getNodeLineage(
        nodes,
        nodeId
    );

    return lineage[0] ?? null;
}

// --------------------------------------------------
// Get Branch Statistics
// --------------------------------------------------

/**
 * Returns lineage and descendant statistics
 * for the selected concept.
 */
export function getBranchStats(nodes, nodeId) {
    const currentNode = Array.isArray(nodes)
        ? getNodeById(nodes, nodeId)
        : null;

    if (!currentNode) {
        return {
            depth: 0,
            directChildren: 0,
            totalDescendants: 0,
            lineageLength: 0,
        };
    }

    const lineage = getNodeLineage(
        nodes,
        nodeId
    );

    const children = getDirectChildren(
        nodes,
        nodeId
    );

    const descendants = getNodeDescendants(
        nodes,
        nodeId
    );

    return {
        depth: Math.max(0, lineage.length - 1),
        directChildren: children.length,
        totalDescendants: descendants.length,
        lineageLength: lineage.length,
    };
}
