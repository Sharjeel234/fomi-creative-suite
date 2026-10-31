
export const sampleImages = [
    {
        id: "skincare-hero",
        src: "/images/campaign-skincare-hero.webp",
        title: "Skincare Campaign",
        category: "product",
        alt: "Premium skincare product campaign featuring an amber serum bottle",
    },
    {
        id: "skincare-natural",
        src: "/images/campaign-skincare-natural.webp",
        title: "Natural Light",
        category: "product",
        alt: "Amber serum bottle photographed in soft natural lighting",
    },
    {
        id: "skincare-dramatic",
        src: "/images/campaign-skincare-dramatic.webp",
        title: "Dramatic Lighting",
        category: "product",
        alt: "Amber serum bottle in a dramatic studio lighting setup",
    },
    {
        id: "skincare-minimal",
        src: "/images/campaign-skincare-minimal.webp",
        title: "Minimal Product",
        category: "product",
        alt: "Minimalist skincare product photograph with clean composition",
    },
    {
        id: "fashion-editorial",
        src: "/images/fashion-editorial.webp",
        title: "Fashion Editorial",
        category: "editorial",
        alt: "High-fashion editorial photography",
    },
    {
        id: "architectural-atmosphere",
        src: "/images/architectural-atmosphere.webp",
        title: "Architectural Atmosphere",
        category: "architecture",
        alt: "Atmospheric architectural photography",
    },
    {
        id: "surreal-object-study",
        src: "/images/surreal-object-study.webp",
        title: "Surreal Object Study",
        category: "abstract",
        alt: "Surreal artistic object composition",
    },
];

export function getSampleImages(category) {
    if (!category) return sampleImages;

    return sampleImages.filter(
        (image) => image.category === category
    );
}
