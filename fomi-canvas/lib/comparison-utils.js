
const MAX_COMPARISON_NODES = 2;

// --------------------------------------------------
// Normalize Comparison IDs
// --------------------------------------------------

/**
 * Returns up to two valid, distinct node IDs.
 *
 * - Removes missing node IDs.
 * - Removes duplicate IDs.
 * - Preserves selection order.
 * - Enforces the comparison limit.
 */
export function normalizeComparisonIds(nodes, ids) {
    if (!Array.isArray(nodes) || !Array.isArray(ids)) {
        return [];
    }

    const validIds = new Set(
        nodes
            .filter(
                (node) =>
                    node &&
                    typeof node.id === "string"
            )
            .map((node) => node.id)
    );

    const seenIds = new Set();
    const normalizedIds = [];

    for (const id of ids) {
        if (
            typeof id !== "string" ||
            !validIds.has(id) ||
            seenIds.has(id)
        ) {
            continue;
        }

        seenIds.add(id);
        normalizedIds.push(id);

        if (
            normalizedIds.length ===
            MAX_COMPARISON_NODES
        ) {
            break;
        }
    }

    return normalizedIds;
}

// --------------------------------------------------
// Toggle Comparison Node
// --------------------------------------------------

/**
 * Adds or removes a node from comparison.
 *
 * - Selecting an existing node removes it.
 * - Selecting a new node adds it if space exists.
 * - A third selection is rejected.
 * - Existing selections are never replaced.
 */
export function toggleComparisonNode(
    nodes,
    currentIds,
    nodeId
) {
    const ids = normalizeComparisonIds(
        nodes,
        currentIds
    );

    if (
        typeof nodeId !== "string" ||
        !Array.isArray(nodes) ||
        !nodes.some((node) => node?.id === nodeId)
    ) {
        return ids;
    }

    // Remove an already selected concept.
    if (ids.includes(nodeId)) {
        return ids.filter((id) => id !== nodeId);
    }

    // Do not replace an existing selection.
    if (ids.length >= MAX_COMPARISON_NODES) {
        return ids;
    }

    // Add a new concept.
    return [...ids, nodeId];
}

// --------------------------------------------------
// Resolve Comparison Nodes
// --------------------------------------------------

/**
 * Resolves selected IDs into node objects,
 * preserving comparison order (A then B).
 */
export function getComparisonNodes(nodes, ids) {
    if (!Array.isArray(nodes)) {
        return [];
    }

    const validIds = normalizeComparisonIds(
        nodes,
        ids
    );

    const nodeMap = new Map(
        nodes
            .filter(
                (node) =>
                    node &&
                    typeof node.id === "string"
            )
            .map((node) => [node.id, node])
    );

    return validIds
        .map((id) => nodeMap.get(id))
        .filter(Boolean);
}

// --------------------------------------------------
// Comparison Readiness
// --------------------------------------------------

/**
 * Returns true when exactly two valid,
 * distinct concepts are selected.
 */
export function canCompareNodes(nodes, ids) {
    return (
        normalizeComparisonIds(nodes, ids).length ===
        MAX_COMPARISON_NODES
    );
}

// --------------------------------------------------
// Compare Generation Settings
// --------------------------------------------------

const COMPARISON_FIELDS = [
    {
        key: "style",
        label: "Style",
    },
    {
        key: "aspectRatio",
        label: "Aspect ratio",
    },
    {
        key: "quality",
        label: "Quality",
    },
];

/**
 * Returns a comparison of generation settings.
 *
 * Each result contains:
 * - key
 * - label
 * - firstValue
 * - secondValue
 * - isDifferent
 */
export function getSettingsDifferences(
    firstNode,
    secondNode
) {
    if (!firstNode || !secondNode) {
        return [];
    }

    return COMPARISON_FIELDS.map(
        ({ key, label }) => {
            const firstValue =
                firstNode.settings?.[key] ??
                "Not set";

            const secondValue =
                secondNode.settings?.[key] ??
                "Not set";

            return {
                key,
                label,
                firstValue,
                secondValue,
                isDifferent:
                    firstValue !== secondValue,
            };
        }
    );
}
