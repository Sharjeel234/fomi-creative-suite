
function createFilename(image) {
    const name = (image.title || "fomi-creation")
        .toLowerCase()
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 60);

    const extension =
        image.src.split("?")[0].split(".").pop()?.toLowerCase() ||
        "webp";

    return `fomi-${name || "creation"}-${image.id
        .toString()
        .replace(/[^a-zA-Z0-9-]/g, "")
        .slice(-20)}.${extension}`;
}

export async function downloadImage(image) {
    if (!image?.src || !image?.id) {
        throw new Error("Image is unavailable for download.");
    }

    // Only permit local demo assets.
    if (
        !image.src.startsWith("/images/") ||
        image.src.startsWith("//") ||
        image.src.includes("..")
    ) {
        throw new Error("This image source cannot be downloaded.");
    }

    const response = await fetch(image.src, {
        cache: "no-store",
    });

    if (!response.ok) {
        throw new Error("Unable to retrieve the original image.");
    }

    const blob = await response.blob();

    if (!blob.type.startsWith("image/")) {
        throw new Error("The downloaded resource is not an image.");
    }

    const objectUrl = URL.createObjectURL(blob);

    try {
        const link = document.createElement("a");
        link.href = objectUrl;
        link.download = createFilename(image);
        link.style.display = "none";

        document.body.appendChild(link);
        link.click();
        link.remove();
    } finally {
        // Release after the browser has handled the click.
        setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    }
}
