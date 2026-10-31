import Link from "next/link"
import { Sparkle, Compass, History } from "lucide-react"

const navigation = [
    { label: "Create", href: "/", icon: Sparkle },
    { label: "Explore", href: "#explore", icon: Compass },
    { label: "History", href: "#history", icon: History }
]

const Sidebar = () => {
    return (
        <aside
            aria-label="Main navigation"
            className="hidden w-[72px] shrink-0 flex-col items-center self-stretch border-r border-[var(--fomi-border)] bg-[var(--fomi-nav)] py-5 md:flex"
        >
            <Link
                href="/"
                aria-label="Fomi Studio Home"
                className="mb-10 rounded-md text-2xl font-bold text-[var(--fomi-accent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--fomi-focus)]"
            >
                FS
            </Link>

            <nav aria-label="Workspace">
                <ul className="flex flex-col gap-4">
                    {navigation.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = index === 0;

                        return (
                            <li key={item.label}>
                                <Link
                                    href={item.href}
                                    aria-label={item.label}
                                    title={item.label}
                                    aria-current={isActive ? "page" : undefined}
                                    className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--fomi-focus)] ${isActive
                                        ? "bg-[var(--fomi-surface-hover)] text-[var(--fomi-accent)]"
                                        : "text-[var(--fomi-text-muted)] hover:bg-[var(--fomi-surface-raised)] hover:text-[var(--fomi-text)]"
                                        }`}
                                >
                                    <Icon
                                        size={20}
                                        strokeWidth={1.8}
                                        aria-hidden="true"
                                    />
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar