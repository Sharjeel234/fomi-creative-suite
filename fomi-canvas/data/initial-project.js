
export const initialProject = {
    id: "fomi-project-001",
    name: "Skincare Campaign",
    description:
        "Exploring premium visual directions for a luxury skincare launch.",
    createdAt: "2026-11-01T00:00:00.000Z",
};

export const initialNodes = [
    {
        id: "concept-001",
        parentId: null,
        title: "Original Concept",
        description: "The starting point for the campaign.",
        prompt:
            "Luxury skincare serum product photography with a refined editorial aesthetic, premium materials, and elegant composition.",
        image: "/images/campaign-skincare-hero.webp",
        position: { x: 80, y: 260 },
        settings: {
            style: "Editorial",
            aspectRatio: "1:1",
            quality: "High",
        },
        createdAt: "2026-11-01T00:00:00.000Z",
    },
    {
        id: "concept-002",
        parentId: "concept-001",
        title: "Natural Light",
        description: "Soft daylight and organic warmth.",
        prompt:
            "Luxury skincare serum in soft natural daylight, organic textures, subtle shadows, warm neutral tones.",
        image: "/images/campaign-skincare-natural.webp",
        position: { x: 520, y: 40 },
        settings: {
            style: "Natural",
            aspectRatio: "1:1",
            quality: "High",
        },
        createdAt: "2026-11-01T00:05:00.000Z",
    },
    {
        id: "concept-003",
        parentId: "concept-001",
        title: "Dramatic Studio",
        description: "Cinematic contrast and bold lighting.",
        prompt:
            "Luxury skincare serum in a dramatic studio setting, sculptural lighting, deep shadows, premium campaign aesthetic.",
        image: "/images/campaign-skincare-dramatic.webp",
        position: { x: 520, y: 380 },
        settings: {
            style: "Dramatic",
            aspectRatio: "1:1",
            quality: "High",
        },
        createdAt: "2026-11-01T00:10:00.000Z",
    },
    {
        id: "concept-004",
        parentId: "concept-002",
        title: "Minimal Editorial",
        description: "Clean composition and restrained details.",
        prompt:
            "Minimal luxury skincare editorial photography, clean architectural composition, negative space, refined neutral palette.",
        image: "/images/campaign-skincare-minimal.webp",
        position: { x: 960, y: 40 },
        settings: {
            style: "Minimal",
            aspectRatio: "1:1",
            quality: "High",
        },
        createdAt: "2026-11-01T00:15:00.000Z",
    },
];

export const initialCanvasState = {
    project: initialProject,
    nodes: initialNodes,
    selectedNodeId: "concept-002",
    comparisonNodeIds: [],
    zoom: 1,
    pan: { x: 0, y: 0 },
    activePanel: "inspector",
};
