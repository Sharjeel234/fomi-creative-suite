
import { NextResponse } from "next/server";
import { sampleImages } from "@/data/sample-images";

const VALID_MODELS = ["fomi-creative", "fomi-fast"];
const VALID_RATIOS = ["1:1", "16:9", "9:16", "custom"];
const VALID_VIDEO_RATIOS = ["16:9", "9:16"];
const VALID_QUALITIES = ["standard", "high"];

const PROMPT_CATEGORIES = [
  {
    category: "product",
    keywords: [
      "skincare",
      "serum",
      "cosmetic",
      "cosmetics",
      "beauty",
      "bottle",
      "product",
      "perfume",
      "makeup",
    ],
  },
  {
    category: "editorial",
    keywords: [
      "fashion",
      "editorial",
      "portrait",
      "model",
      "runway",
      "clothing",
      "outfit",
    ],
  },
  {
    category: "architecture",
    keywords: [
      "architecture",
      "architectural",
      "building",
      "interior",
      "house",
      "structure",
      "modern home",
    ],
  },
  {
    category: "abstract",
    keywords: [
      "abstract",
      "surreal",
      "conceptual",
      "floating",
      "dreamlike",
      "sculpture",
    ],
  },
];

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function selectDemoImages(prompt, count) {
  const normalizedPrompt = prompt.toLowerCase();

  const rankedCategories = PROMPT_CATEGORIES.map(
    ({ category, keywords }) => ({
      category,
      score: keywords.reduce(
        (score, keyword) =>
          score +
          (normalizedPrompt.includes(keyword) ? 1 : 0),
        0
      ),
    })
  ).sort((a, b) => b.score - a.score);

  const bestMatch = rankedCategories[0];

  const matchingImages =
    bestMatch?.score > 0
      ? sampleImages.filter(
        (image) => image.category === bestMatch.category
      )
      : [];

  const imagePool =
    matchingImages.length > 0
      ? matchingImages
      : sampleImages;

  // Remove duplicate image sources from the available pool.
  const uniqueImages = Array.from(
    new Map(
      imagePool.map((image) => [image.src, image])
    ).values()
  );

  // Never return more images than actually exist.
  const resultCount = Math.min(count, uniqueImages.length);

  const seed = [...normalizedPrompt].reduce(
    (total, char) => total + char.charCodeAt(0),
    0
  );

  // Rotate selection so different prompts can produce
  // different subsets without repeating images.
  const selectedImages = Array.from(
    { length: resultCount },
    (_, index) =>
      uniqueImages[(seed + index) % uniqueImages.length]
  );

  return selectedImages.map((image, index) => ({
    ...image,
    id: `${image.id}-${Date.now()}-${index}`,
    type: "image",
    isDemo: true,
  }));
}

function errorResponse(message, status = 400) {
  return NextResponse.json(
    {
      success: false,
      error: message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch {
    return errorResponse("Invalid JSON request body.");
  }

  if (
    !body ||
    typeof body !== "object" ||
    Array.isArray(body)
  ) {
    return errorResponse("Request body must be an object.");
  }

  const { mode, prompt, settings } = body;

  if (!["image", "video"].includes(mode)) {
    return errorResponse("Unsupported generation mode.");
  }

  // Normalize before validating to avoid rejecting
  // otherwise valid prompts with surrounding whitespace.
  const normalizedPrompt =
    typeof prompt === "string" ? prompt.trim() : "";

  if (
    !normalizedPrompt ||
    normalizedPrompt.length > 2000
  ) {
    return errorResponse(
      "Prompt must contain between 1 and 2000 characters."
    );
  }

  if (
    !settings ||
    typeof settings !== "object" ||
    Array.isArray(settings)
  ) {
    return errorResponse("Generation settings are required.");
  }

  const {
    model,
    aspectRatio,
    customWidth,
    customHeight,
    count,
    quality,
    videoAspectRatio,
    videoDuration,
  } = settings;

  if (!VALID_MODELS.includes(model)) {
    return errorResponse("Invalid generation model.");
  }

  if (!VALID_QUALITIES.includes(quality)) {
    return errorResponse("Invalid quality setting.");
  }

  // VIDEO GENERATION — SIMULATED POSTER
  if (mode === "video") {
    if (!VALID_VIDEO_RATIOS.includes(videoAspectRatio)) {
      return errorResponse("Invalid video aspect ratio.");
    }

    if (![5, 10].includes(videoDuration)) {
      return errorResponse(
        "Invalid video preview duration."
      );
    }

    await delay(model === "fomi-fast" ? 700 : 1400);

    const result = {
      id: `video-demo-${Date.now()}`,
      type: "video",
      src: "/images/video-preview-poster.webp",
      title: "Cinematic video concept",
      alt: "Static cinematic video concept poster",
      category: "Video concept",
      aspectRatio: videoAspectRatio,
      duration: videoDuration,
      quality,
      model,
      isDemo: true,
      isPlayable: false,
    };

    return NextResponse.json(
      {
        success: true,
        mode,
        prompt: normalizedPrompt,
        settings: {
          model,
          videoAspectRatio,
          videoDuration,
          quality,
        },
        results: [result],
        requestedCount: 1,
        generatedCount: 1,
        demo: true,
        message: "Simulated video preview created.",
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  }

  // IMAGE GENERATION
  if (!VALID_RATIOS.includes(aspectRatio)) {
    return errorResponse("Invalid aspect ratio.");
  }

  if (
    !Number.isInteger(count) ||
    count < 1 ||
    count > 4
  ) {
    return errorResponse(
      "Generation count must be between 1 and 4."
    );
  }

  if (aspectRatio === "custom") {
    const validDimensions = [
      customWidth,
      customHeight,
    ].every(
      (value) =>
        Number.isInteger(value) &&
        value >= 256 &&
        value <= 4096
    );

    if (!validDimensions) {
      return errorResponse(
        "Custom dimensions must be whole numbers between 256 and 4096."
      );
    }
  }

  if (sampleImages.length === 0) {
    return errorResponse(
      "No demo images are available.",
      503
    );
  }

  await delay(model === "fomi-fast" ? 500 : 1100);

  const results = selectDemoImages(
    normalizedPrompt,
    count
  ).map((image) => ({
    ...image,
    aspectRatio,
    quality,
    model,
  }));

  return NextResponse.json(
    {
      success: true,
      mode,
      prompt: normalizedPrompt,
      settings: {
        model,
        aspectRatio,
        count,
        quality,
        ...(aspectRatio === "custom"
          ? { customWidth, customHeight }
          : {}),
      },
      results,
      requestedCount: count,
      generatedCount: results.length,
      demo: true,
      message:
        results.length < count
          ? `Showing ${results.length} unique demo image(s) out of ${count} requested.`
          : "Demo images selected successfully.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}
