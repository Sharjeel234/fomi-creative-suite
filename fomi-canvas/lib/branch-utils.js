
import {
    NODE_WIDTH,
    NODE_HEIGHT,
} from "@/lib/canvas-utils";

// --------------------------------------------------
// Branch Layout Constants
// --------------------------------------------------

const BRANCH_HORIZONTAL_GAP = 160;
const BRANCH_VERTICAL_GAP = 60;
const MIN_CANVAS_Y = 24;

const MAX_VERTICAL_STEPS = 6;

// --------------------------------------------------
// Demo Images
// --------------------------------------------------

const DEMO_IMAGES = {
    Editorial: "/images/campaign-skincare-hero.webp",
    Natural: "/images/campaign-skincare-natural.webp",
    Dramatic: "/images/campaign-skincare-dramatic.webp",
    Minimal: "/images/campaign-skincare-minimal.webp",
};

// --------------------------------------------------
// Generation Options
// --------------------------------------------------

export const GENERATION_STYLES = [
    "Editorial",
    "Natural",
    "Dramatic",
    "Minimal",
];

export const GENERATION_ASPECT_RATIOS = [
    "1:1",
    "4:5",
    "16:9",
    "9:16",
];

// --------------------------------------------------
// Create Concept ID
// --------------------------------------------------

export function createConceptId() {
    return `concept-${crypto.randomUUID()}`;
}

// --------------------------------------------------
// Demo Image Lookup
// --------------------------------------------------

export function getDemoImage(style) {
    return (
        DEMO_IMAGES[style] ??
        DEMO_IMAGES.Editorial
    );
}

// --------------------------------------------------
// Collision Detection
// --------------------------------------------------

function rectanglesOverlap(
    a,
    b,
    gap = 24
) {
    return (
        a.x < b.x + NODE_WIDTH + gap &&
        a.x + NODE_WIDTH + gap > b.x &&
        a.y < b.y + NODE_HEIGHT + gap &&
        a.y + NODE_HEIGHT + gap > b.y
    );
}

// --------------------------------------------------
// Vertical Position Offsets
// --------------------------------------------------

function getBranchOffsets(maxSteps) {
    const offsets = [0];

    for (
        let index = 1;
        index <= maxSteps;
        index++
    ) {
        offsets.push(index);
        offsets.push(-index);
    }

    return offsets;
}

// --------------------------------------------------
// Find Next Branch Position
// --------------------------------------------------

/**
 * Finds an available position to the
 * right of the parent concept.
 *
 * - Prefers nearby vertical slots.
 * - Avoids collisions with existing nodes.
 * - Expands horizontally when needed.
 */
export function getNextBranchPosition(
    nodes,
    parentId
) {
    if (!Array.isArray(nodes)) {
        throw new Error(
            "Invalid concept collection."
        );
    }

    const parent = nodes.find(
        (node) => node?.id === parentId
    );

    if (
        !parent ||
        !Number.isFinite(parent.position?.x) ||
        !Number.isFinite(parent.position?.y)
    ) {
        throw new Error(
            "Parent concept not found or has an invalid position."
        );
    }

    const baseX =
        parent.position.x +
        NODE_WIDTH +
        BRANCH_HORIZONTAL_GAP;

    const baseY = parent.position.y;

    const verticalStep =
        NODE_HEIGHT + BRANCH_VERTICAL_GAP;

    const horizontalStep =
        NODE_WIDTH + BRANCH_HORIZONTAL_GAP;

    const offsets = getBranchOffsets(
        MAX_VERTICAL_STEPS
    );

    const occupiedPositions = nodes
        .map((node) => node?.position)
        .filter(
            (position) =>
                Number.isFinite(position?.x) &&
                Number.isFinite(position?.y)
        );

    const maxColumns = nodes.length + 2;

    for (
        let column = 0;
        column < maxColumns;
        column++
    ) {
        const x =
            baseX + column * horizontalStep;

        for (const offset of offsets) {
            const y =
                baseY + offset * verticalStep;

            if (y < MIN_CANVAS_Y) {
                continue;
            }

            const candidate = { x, y };

            const overlaps =
                occupiedPositions.some(
                    (position) =>
                        rectanglesOverlap(
                            candidate,
                            position
                        )
                );

            if (!overlaps) {
                return candidate;
            }
        }
    }

    throw new Error(
        "Unable to find space for the new branch."
    );
}

// --------------------------------------------------
// Create Branch Node
// --------------------------------------------------

/**
 * Creates a demo variation from a
 * selected parent concept.
 *
 * This function does not call an AI API.
 */
export function createBranchNode({
    nodes,
    parentId,
    prompt,
    style = "Editorial",
    aspectRatio = "1:1",
}) {
    if (!Array.isArray(nodes)) {
        throw new Error(
            "Invalid concept collection."
        );
    }

    const parent = nodes.find(
        (node) => node?.id === parentId
    );

    if (!parent) {
        throw new Error(
            "Select a valid parent concept."
        );
    }

    if (typeof prompt !== "string") {
        throw new Error(
            "Enter a valid generation prompt."
        );
    }

    const cleanPrompt = prompt.trim();

    if (!cleanPrompt) {
        throw new Error(
            "Enter a prompt to create a variation."
        );
    }

    if (!GENERATION_STYLES.includes(style)) {
        throw new Error(
            "Invalid creative style."
        );
    }

    if (
        !GENERATION_ASPECT_RATIOS.includes(
            aspectRatio
        )
    ) {
        throw new Error(
            "Invalid aspect ratio."
        );
    }

    const position = getNextBranchPosition(
        nodes,
        parentId
    );

    return {
        id: createConceptId(),
        parentId,

        title: `${style} Variation`,

        description:
            cleanPrompt.slice(0, 100),

        prompt: cleanPrompt,

        image: getDemoImage(style),

        position,

        settings: {
            style,
            aspectRatio,
            quality:
                parent.settings?.quality ??
                "High",
        },

        createdAt: new Date().toISOString(),
    };
}
