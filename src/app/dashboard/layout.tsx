import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-black/5 bg-white/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-foreground/40">
            &copy; 2026 Bacayuk. Dibuat dengan cinta untuk anak Indonesia.
          </p>
        </div>
      </footer>
    </div>
  );
}
