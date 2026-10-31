
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppShell = ({ children, mode = "image" }) => {
    return (
        <div className="flex min-h-dvh bg-[var(--fomi-bg)] text-[var(--fomi-text)]">
            {/* Desktop navigation */}
            <Sidebar />

            {/* Workspace */}
            <div className="flex min-h-dvh min-w-0 flex-1 flex-col">
                <Topbar mode={mode} />

                <main
                    id="main-content"
                    className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8"
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AppShell;
