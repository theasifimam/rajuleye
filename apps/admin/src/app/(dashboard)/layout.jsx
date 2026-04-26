import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { AuthGuard } from "@/components/AuthGuard";
export default function DashboardLayout({ children, }) {
    return (<AuthGuard>
      <div className="flex flex-col md:flex-row min-h-screen bg-background text-foreground transition-colors duration-500">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-500 pb-20 md:pb-0">
        <Topbar />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-h-[calc(100vh-80px-80px)] md:max-h-[calc(100vh-80px)] scrollbar-hide">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {children}
          </div>
        </main>
      </div>
    </div>
    </AuthGuard>);
}
