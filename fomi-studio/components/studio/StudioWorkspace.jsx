
"use client";

import { useRef, useState } from "react";

import PromptComposer from "./PromptComposer";
import GenerationSettings, {
    DEFAULT_SETTINGS,
} from "./GenerationSettings";
import ResultsGallery from "./ResultsGallery";

const StudioWorkspace = ({
    mode = "image",
    onModeChange,
}) => {
    const [settings, setSettings] = useState({
        ...DEFAULT_SETTINGS,
    });

    const [results, setResults] = useState([]);
    const [resultMode, setResultMode] = useState("image");
    const [isGenerating, setIsGenerating] = useState(false);
    const [loadingCount, setLoadingCount] = useState(2);

    const [generationFeedback, setGenerationFeedback] =
        useState(null);

    const [generationMeta, setGenerationMeta] =
        useState(null);

    // Prevent duplicate requests before React state updates.
    const generationLockRef = useRef(false);

    function handleModeChange(nextMode) {
        if (
            generationLockRef.current ||
            isGenerating ||
            nextMode === mode
        ) {
            return;
        }

        onModeChange?.(nextMode);

        setResults([]);
        setResultMode(nextMode);
        setGenerationFeedback(null);
        setGenerationMeta(null);
    }

    async function handleGenerate({
        mode: requestedMode,
        prompt,
        reference,
    }) {
        // Immediately block concurrent generation requests.
        if (generationLockRef.current) {
            return;
        }

        if (reference) {
            throw new Error(
                "Reference-image processing is not available in this demo."
            );
        }

        generationLockRef.current = true;

        const requestSettings = { ...settings };

        setLoadingCount(
            requestedMode === "video"
                ? 1
                : requestSettings.count
        );

        setGenerationFeedback(null);
        setIsGenerating(true);

        try {
            const response = await fetch("/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    mode: requestedMode,
                    prompt,
                    settings: requestSettings,
                }),
            });

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error(
                    "The generation service returned an invalid response."
                );
            }

            if (!response.ok || !data.success) {
                throw new Error(
                    data.error ||
                        "Unable to generate preview."
                );
            }

            if (!Array.isArray(data.results)) {
                throw new Error(
                    "Invalid generation results."
                );
            }

            if (data.results.length === 0) {
                throw new Error(
                    "No demo results were returned. Please try another prompt."
                );
            }

            const requestedCount =
                requestedMode === "video"
                    ? 1
                    : requestSettings.count;

            const generatedCount = data.results.length;

            setResults(data.results);
            setResultMode(requestedMode);

            setGenerationMeta({
                requestedCount,
                generatedCount,
                mode: requestedMode,
                isDemo: Boolean(data.demo),
            });

            setGenerationFeedback({
                type: "success",
                message:
                    requestedMode === "video"
                        ? "Simulated video concept is ready."
                        : generatedCount < requestedCount
                          ? `Showing ${generatedCount} unique image${generatedCount === 1 ? "" : "s"} out of ${requestedCount} requested.`
                          : `${generatedCount} demo image${generatedCount === 1 ? "" : "s"} ready.`,
            });
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Generation failed. Please try again.";

            setGenerationFeedback({
                type: "error",
                message,
            });

            // Preserve previous results if the request fails.
            throw error;
        } finally {
            generationLockRef.current = false;
            setIsGenerating(false);
        }
    }

    return (
        <section
            aria-labelledby="workspace-title"
            className="min-w-0"
        >
            <div className="mb-5 space-y-1">
                <h3
                    id="workspace-title"
                    className="text-lg font-semibold text-[var(--fomi-text)]"
                >
                    Create with AI
                </h3>

                <p className="text-sm text-[var(--fomi-text-secondary)]">
                    Describe your vision and bring it to life.
                </p>
            </div>

            <div className="grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:[grid-template-areas:'composer_settings'_'results_settings']">
                <div className="min-w-0 lg:[grid-area:composer]">
                    <PromptComposer
                        key={mode}
                        mode={mode}
                        onModeChange={handleModeChange}
                        onGenerate={handleGenerate}
                        disabled={isGenerating}
                    />
                </div>

                <aside
                    aria-label="Generation settings panel"
                    className="min-w-0 lg:[grid-area:settings]"
                >
                    <GenerationSettings
                        mode={mode}
                        settings={settings}
                        onChange={setSettings}
                        disabled={isGenerating}
                    />
                </aside>

                <div className="min-w-0 lg:[grid-area:results]">
                    <ResultsGallery
                        mode={resultMode}
                        images={results}
                        isLoading={isGenerating}
                        loadingCount={loadingCount}
                        generationFeedback={generationFeedback}
                        generationMeta={generationMeta}
                        onDismissGenerationFeedback={() =>
                            setGenerationFeedback(null)
                        }
                    />
                </div>
            </div>
        </section>
    );
};

export default StudioWorkspace;
