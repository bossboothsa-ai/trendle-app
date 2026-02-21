import { BottomNav } from "@/components/BottomNav";

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
            {/* Main Content Area */}
            <main className="max-w-md mx-auto min-h-screen bg-white shadow-xl overflow-hidden relative">
                {children}
            </main>

            {/* Bottom Navigation (Mobile First) */}
            <BottomNav />

            {/* Desktop Message (Optional) */}
            <div className="hidden md:flex fixed top-0 left-0 h-full w-full -z-10 items-center justify-center bg-gray-100">
                <div className="text-center text-gray-400">
                    <p>Mobile-first experience</p>
                </div>
            </div>
        </div>
    );
}
