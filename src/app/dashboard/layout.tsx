import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { BottomNav } from "@/components/BottomNav";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { heroes } from "@/db/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  const currentHero = session?.user ? await db.query.heroes.findFirst({
    where: eq(heroes.userId, session.user.id)
  }) : null;

  return (
    <div className="min-h-screen flex bg-surface">
      {/* Navigation Sidebar (Desktop) */}
      <Sidebar userRole={currentHero?.role} />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Top App Bar */}
        <TopBar />

        {/* Main Content Area */}
        <main className="flex-1 w-full pb-32 lg:pb-10">
          {children}
        </main>
        
        {/* Footer (Simplified) */}
        <footer className="border-t border-black/5 bg-white/50 backdrop-blur-sm py-6 px-10">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-foreground/40 text-[10px] font-black uppercase tracking-widest">
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
