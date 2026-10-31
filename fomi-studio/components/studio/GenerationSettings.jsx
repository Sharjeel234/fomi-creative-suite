
"use client";

import {
    RotateCcw,
    SlidersHorizontal,
    Film,
} from "lucide-react";

export const DEFAULT_SETTINGS = {
    model: "fomi-creative",
    aspectRatio: "1:1",
    customWidth: 1200,
    customHeight: 800,
    count: 2,
    quality: "high",
    videoAspectRatio: "16:9",
    videoDuration: 5,
};

const imageRatios = [
    { value: "1:1", label: "Square", width: 26, height: 26 },
    { value: "16:9", label: "Landscape", width: 34, height: 19 },
    { value: "9:16", label: "Portrait", width: 19, height: 34 },
    { value: "custom", label: "Custom", width: 0, height: 0 },
];

const videoRatios = imageRatios.filter(
    (ratio) => ["16:9", "9:16"].includes(ratio.value)
);

const focusClass =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)]";

function isValidDimension(value) {
    return (
        Number.isInteger(value) &&
        value >= 256 &&
        value <= 4096
    );
}

const GenerationSettings = ({
    mode = "image",
    settings,
    onChange,
    disabled = false,
}) => {
    const isVideo = mode === "video";

    function updateSetting(key, value) {
        onChange((previous) => ({
            ...previous,
            [key]: value,
        }));
    }

    const ratios = isVideo ? videoRatios : imageRatios;

    const selectedRatio = isVideo
        ? settings.videoAspectRatio
        : settings.aspectRatio;

    const invalidDimensions =
        !isVideo &&
        settings.aspectRatio === "custom" &&
        (
            !isValidDimension(settings.customWidth) ||
            !isValidDimension(settings.customHeight)
        );

    return (
        <section
            aria-labelledby="generation-settings-title"
            className="min-w-0 rounded-2xl border border-[var(--fomi-border)] bg-[var(--fomi-surface)] p-4 sm:p-5"
        >
            {/* Settings header */}
            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {isVideo ? (
                        <Film
                            size={18}
                            className="text-[var(--fomi-accent)]"
                            aria-hidden="true"
                        />
                    ) : (
                        <SlidersHorizontal
                            size={18}
                            className="text-[var(--fomi-accent)]"
                            aria-hidden="true"
                        />
                    )}

                    <h3
                        id="generation-settings-title"
                        className="text-sm font-semibold text-[var(--fomi-text)]"
                    >
                        {isVideo
                            ? "Video settings"
                            : "Generation settings"}
                    </h3>
                </div>

                <button
                    type="button"
                    disabled={disabled}
                    aria-label="Reset generation settings"
                    title="Reset settings"
                    onClick={() =>
                        onChange({ ...DEFAULT_SETTINGS })
                    }
                    className={`rounded-lg p-2 text-[var(--fomi-text-muted)] hover:bg-[var(--fomi-surface-hover)] disabled:opacity-40 ${focusClass}`}
                >
                    <RotateCcw size={16} aria-hidden="true" />
                </button>
            </div>

            <div className="space-y-6">
                {/* AI Model */}
                <div className="space-y-2">
                    <label
                        htmlFor="generation-model"
                        className="block text-xs font-medium text-[var(--fomi-text-secondary)]"
                    >
                        AI Model
                    </label>

                    <select
                        id="generation-model"
                        value={settings.model}
                        disabled={disabled}
                        onChange={(event) =>
                            updateSetting(
                                "model",
                                event.target.value
                            )
                        }
                        className={`w-full rounded-xl border border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] px-3 py-3 text-sm text-[var(--fomi-text)] disabled:opacity-40 ${focusClass}`}
                    >
                        <option value="fomi-creative">
                            Fomi Creative (Demo)
                        </option>

                        <option value="fomi-fast">
                            Fomi Fast (Demo)
                        </option>
                    </select>
                </div>

                {/* Aspect ratio */}
                <fieldset className="space-y-3">
                    <legend className="mb-2 text-xs font-medium text-[var(--fomi-text-secondary)]">
                        Aspect ratio
                    </legend>

                    <div className="grid grid-cols-2 gap-2">
                        {ratios.map((ratio) => {
                            const active =
                                selectedRatio === ratio.value;

                            return (
                                <button
                                    key={ratio.value}
                                    type="button"
                                    disabled={disabled}
                                    aria-pressed={active}
                                    aria-label={
                                        `${ratio.label} aspect ratio` +
                                        (
                                            ratio.value === "custom"
                                                ? ""
                                                : `, ${ratio.value}`
                                        )
                                    }
                                    onClick={() =>
                                        updateSetting(
                                            isVideo
                                                ? "videoAspectRatio"
                                                : "aspectRatio",
                                            ratio.value
                                        )
                                    }
                                    className={`flex min-h-20 flex-col items-center justify-center gap-2 rounded-xl border p-2 transition-colors disabled:opacity-40 ${focusClass} ${active
                                            ? "border-[var(--fomi-accent)] bg-[var(--fomi-surface-hover)] text-[var(--fomi-text)]"
                                            : "border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] text-[var(--fomi-text-secondary)] hover:border-[var(--fomi-border-strong)]"
                                        }`}
                                >
                                    <span className="flex h-9 items-center justify-center">
                                        {ratio.value === "custom" ? (
                                            <SlidersHorizontal
                                                size={20}
                                                aria-hidden="true"
                                            />
                                        ) : (
                                            <span
                                                aria-hidden="true"
                                                className={`block rounded-[3px] border-2 ${active
                                                        ? "border-[var(--fomi-accent)]"
                                                        : "border-[var(--fomi-text-muted)]"
                                                    }`}
                                                style={{
                                                    width: ratio.width,
                                                    height: ratio.height,
                                                }}
                                            />
                                        )}
                                    </span>

                                    <span className="font-mono text-xs">
                                        {ratio.value === "custom"
                                            ? "Custom"
                                            : ratio.value}
                                    </span>

                                    <span className="text-[10px] text-[var(--fomi-text-muted)]">
                                        {ratio.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Custom dimensions */}
                    {!isVideo &&
                        settings.aspectRatio === "custom" && (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] p-3">
                                    {[
                                        [
                                            "customWidth",
                                            "Width (px)",
                                            "custom-width",
                                        ],
                                        [
                                            "customHeight",
                                            "Height (px)",
                                            "custom-height",
                                        ],
                                    ].map(([key, label, id]) => (
                                        <div
                                            key={key}
                                            className="min-w-0 space-y-2"
                                        >
                                            <label
                                                htmlFor={id}
                                                className="block text-xs text-[var(--fomi-text-secondary)]"
                                            >
                                                {label}
                                            </label>

                                            <input
                                                id={id}
                                                type="number"
                                                min={256}
                                                max={4096}
                                                step={1}
                                                value={settings[key]}
                                                disabled={disabled}
                                                aria-invalid={
                                                    !isValidDimension(
                                                        settings[key]
                                                    )
                                                }
                                                aria-describedby={
                                                    invalidDimensions
                                                        ? "custom-dimensions-help custom-dimensions-error"
                                                        : "custom-dimensions-help"
                                                }
                                                onChange={(event) =>
                                                    updateSetting(
                                                        key,
                                                        event.target.value === ""
                                                            ? ""
                                                            : Number(
                                                                event.target.value
                                                            )
                                                    )
                                                }
                                                className={`w-full min-w-0 rounded-lg border border-[var(--fomi-border)] bg-[var(--fomi-surface)] px-3 py-2 text-sm text-[var(--fomi-text)] disabled:opacity-40 ${focusClass}`}
                                            />
                                        </div>
                                    ))}

                                    <p
                                        id="custom-dimensions-help"
                                        className="col-span-2 text-xs leading-5 text-[var(--fomi-text-muted)]"
                                    >
                                        Enter whole numbers between 256 and
                                        4096 pixels per side. Demo settings
                                        do not resize the sample images.
                                    </p>
                                </div>

                                {invalidDimensions && (
                                    <p
                                        id="custom-dimensions-error"
                                        role="alert"
                                        className="text-xs text-[var(--fomi-error)]"
                                    >
                                        Enter whole numbers between 256
                                        and 4096.
                                    </p>
                                )}
                            </div>
                        )}
                </fieldset>

                {/* Video duration */}
                {isVideo ? (
                    <fieldset className="space-y-2">
                        <legend className="mb-2 text-xs font-medium text-[var(--fomi-text-secondary)]">
                            Preview duration
                        </legend>

                        <div className="grid grid-cols-2 gap-2">
                            {[5, 10].map((duration) => {
                                const active =
                                    settings.videoDuration === duration;

                                return (
                                    <button
                                        key={duration}
                                        type="button"
                                        disabled={disabled}
                                        aria-pressed={active}
                                        aria-label={`${duration} second preview duration`}
                                        onClick={() =>
                                            updateSetting(
                                                "videoDuration",
                                                duration
                                            )
                                        }
                                        className={`min-h-11 rounded-xl border text-sm transition-colors disabled:opacity-40 ${focusClass} ${active
                                                ? "border-[var(--fomi-accent)] bg-[var(--fomi-surface-hover)] text-[var(--fomi-text)]"
                                                : "border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] text-[var(--fomi-text-secondary)]"
                                            }`}
                                    >
                                        {duration}s
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                ) : (
                    /* Number of images */
                    <fieldset className="space-y-2">
                        <legend className="mb-2 text-xs font-medium text-[var(--fomi-text-secondary)]">
                            Number of images
                        </legend>

                        <div className="grid grid-cols-4 gap-2">
                            {[1, 2, 3, 4].map((count) => {
                                const active =
                                    settings.count === count;

                                return (
                                    <button
                                        key={count}
                                        type="button"
                                        disabled={disabled}
                                        aria-pressed={active}
                                        aria-label={`${count} ${count === 1
                                                ? "image"
                                                : "images"
                                            }`}
                                        onClick={() =>
                                            updateSetting(
                                                "count",
                                                count
                                            )
                                        }
                                        className={`min-h-10 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 ${focusClass} ${active
                                                ? "border-[var(--fomi-accent)] bg-[var(--fomi-accent)] text-[var(--fomi-bg)]"
                                                : "border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] text-[var(--fomi-text-secondary)]"
                                            }`}
                                    >
                                        {count}
                                    </button>
                                );
                            })}
                        </div>
                    </fieldset>
                )}

                {/* Quality */}
                <fieldset className="space-y-2">
                    <legend className="mb-2 text-xs font-medium text-[var(--fomi-text-secondary)]">
                        Quality
                    </legend>

                    <div className="grid grid-cols-2 gap-2">
                        {["standard", "high"].map((quality) => {
                            const active =
                                settings.quality === quality;

                            return (
                                <button
                                    key={quality}
                                    type="button"
                                    disabled={disabled}
                                    aria-pressed={active}
                                    onClick={() =>
                                        updateSetting(
                                            "quality",
                                            quality
                                        )
                                    }
                                    className={`min-h-11 rounded-xl border px-3 text-xs font-medium capitalize transition-colors disabled:opacity-40 ${focusClass} ${active
                                            ? "border-[var(--fomi-accent)] bg-[var(--fomi-surface-hover)] text-[var(--fomi-text)]"
                                            : "border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] text-[var(--fomi-text-secondary)]"
                                        }`}
                                >
                                    {quality}
                                </button>
                            );
                        })}
                    </div>
                </fieldset>

                {/* Video demo notice */}
                {isVideo && (
                    <p className="rounded-lg border border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] p-3 text-xs leading-5 text-[var(--fomi-text-muted)]">
                        Video mode simulates generation with a static
                        cinematic poster. Duration and aspect ratio
                        are preview metadata, not an exported video.
                    </p>
                )}
            </div>
        </section>
    );
};

export default GenerationSettings;
