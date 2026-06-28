import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Changed to h-[100dvh] and overflow-hidden to lock the viewport size.
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-background overflow-hidden">
      <AdminSidebar />
      {/* The main tag now handles its own internal scrolling independently of the body */}
      <main className="flex-1 w-full h-full overflow-y-auto">
        <div className="w-full max-w-5xl mx-auto p-4 md:p-8 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}