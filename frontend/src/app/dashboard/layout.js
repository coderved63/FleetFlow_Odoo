import Sidebar from '@/components/Sidebar';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function DashboardLayout({ children }) {
    return (
        <ProtectedRoute>
            <div className="flex bg-neutral-950 h-screen overflow-hidden text-neutral-100 font-sans">
                <Sidebar />
                <main className="flex-1 overflow-y-auto bg-neutral-950">
                    <div className="p-8 w-full max-w-[1400px] mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </ProtectedRoute>
    );
}
