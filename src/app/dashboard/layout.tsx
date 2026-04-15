import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Navigation Sidebar (Desktop) */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 w-full pb-32 lg:pb-10">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="border-t border-black/5 bg-white py-6 px-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-[var(--base-color-olive-gray)] text-[10px] font-black uppercase tracking-widest">
            <span>&copy; 2026 Bacayuk</span>
            <span className="italic">Dibuat dengan cinta untuk anak Indonesia</span>
          </div>
        </footer>
      </div>

      {/* Navigation Bottom Bar (Mobile) */}
      <BottomNav />
    </div>
  );
}

