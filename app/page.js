
"use client";

import { useState } from "react";
import AppShell from "@/components/layout/AppShell";
import StudioWorkspace from "@/components/studio/StudioWorkspace";
import { Sparkles } from "lucide-react";

const Homepage = () => {
    const [mode, setMode] = useState("image");

    return (
        <AppShell mode={mode}>
            <section className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8">
                {/* Introduction */}
                <div className="flex flex-col gap-3 pt-4 sm:pt-10">
                    <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[var(--fomi-border)] bg-[var(--fomi-surface)] px-3 py-1.5">
                        <Sparkles
                            size={14}
                            className="text-[var(--fomi-accent)]"
                            aria-hidden="true"
                        />
                        <span className="text-xs text-[var(--fomi-text-secondary)]">
                            AI Creative Studio
                        </span>
                    </div>

                    <h2 className="max-w-3xl text-3xl font-semibold tracking-tight text-[var(--fomi-text)] sm:text-4xl lg:text-5xl">
                        Imagine something{" "}
                        <span className="text-[var(--fomi-accent)]">
                            extraordinary.
                        </span>
                    </h2>

                    <p className="max-w-xl text-sm leading-7 text-[var(--fomi-text-secondary)] sm:text-base">
                        Turn your ideas into beautiful visuals. Describe what
                        you want to create, explore different styles, and
                        bring your imagination to life.
                    </p>
                </div>

                <StudioWorkspace
                    mode={mode}
                    onModeChange={setMode}
                />
            </section>
        </AppShell>
    );
};

export default Homepage;
