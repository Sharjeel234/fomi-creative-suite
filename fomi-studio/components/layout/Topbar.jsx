
import {
    CircleHelp,
    ImageIcon,
    Film,
    PanelLeft,
    UserRound,
} from "lucide-react";

const Topbar = ({ mode = "image" }) => {
    const isVideo = mode === "video";

    return (
        <header className="flex h-[60px] shrink-0 items-center justify-between gap-3 border-b border-[var(--fomi-border)] bg-[var(--fomi-nav)] px-4 sm:px-6">
            {/* Workspace identity */}
            <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--fomi-surface-raised)] text-[var(--fomi-accent)]">
                    <PanelLeft
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>

                <div className="min-w-0">
                    <h1 className="truncate text-sm font-semibold text-[var(--fomi-text)]">
                        Fomi Studio
                    </h1>

                    <p className="hidden text-xs text-[var(--fomi-text-muted)] sm:block">
                        Creative workspace
                    </p>
                </div>
            </div>

            {/* Right-side controls */}
            <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <span
                    aria-label={`Current generation mode: ${isVideo ? "Video" : "Image"
                        }`}
                    className="inline-flex h-8 items-center gap-2 rounded-full border border-[var(--fomi-border)] bg-[var(--fomi-surface)] px-3 text-xs text-[var(--fomi-text-secondary)]"
                >
                    {isVideo ? (
                        <Film
                            size={14}
                            strokeWidth={1.8}
                            className="text-[var(--fomi-accent)]"
                            aria-hidden="true"
                        />
                    ) : (
                        <ImageIcon
                            size={14}
                            strokeWidth={1.8}
                            className="text-[var(--fomi-accent)]"
                            aria-hidden="true"
                        />
                    )}

                    {isVideo ? "Video" : "Image"}
                </span>

                <a
                    href="https://fomi.art"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Visit Fomi website for help (opens in new tab)"
                    title="Fomi website"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--fomi-text-secondary)] transition-colors hover:bg-[var(--fomi-surface-hover)] hover:text-[var(--fomi-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)]"
                >
                    <CircleHelp
                        size={19}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </a>

                <div
                    role="img"
                    aria-label="Demo user account"
                    title="Demo account"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--fomi-border)] bg-[var(--fomi-surface-raised)] text-[var(--fomi-text)]"
                >
                    <UserRound
                        size={18}
                        strokeWidth={1.8}
                        aria-hidden="true"
                    />
                </div>
            </div>
        </header>
    );
};

export default Topbar;
