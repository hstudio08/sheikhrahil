"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Feather, 
  Quote, 
  MessageSquare, 
  User, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { removeSession } from "@/lib/firebase/auth-actions";
import { useRouter } from "next/navigation";

const navigation = [
  { name: "Dashboard", href: "/writeradmin/dashboard", icon: LayoutDashboard },
  { name: "Poems", href: "/writeradmin/dashboard/poems", icon: Feather },
  { name: "Quotes", href: "/writeradmin/dashboard/quotes", icon: Quote },
  { name: "Messages", href: "/writeradmin/dashboard/messages", icon: MessageSquare },
  { name: "Settings", href: "/writeradmin/dashboard/settings", icon: User },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await removeSession();
    router.push("/writeradmin");
    router.refresh();
  };

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between bg-white border-b border-border px-4 py-3 sticky top-0 z-50">
        <h2 className="font-serif text-xl tracking-tight text-primary">Literary Studio</h2>
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-primary p-2 hover:bg-background rounded-sm transition-colors"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar (Desktop fixed, Mobile off-canvas) */}
      <div 
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-border flex flex-col transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:min-h-screen ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden md:flex h-16 items-center px-6 border-b border-border">
          <h2 className="font-serif text-xl tracking-tight text-primary">Literary Studio</h2>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMenu}
                className={`flex items-center gap-3 px-3 py-2 text-sm font-sans rounded-sm transition-colors ${
                  isActive 
                    ? "bg-background text-primary font-medium" 
                    : "text-muted-foreground hover:bg-background/50 hover:text-primary"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-3 py-2 text-sm font-sans text-muted-foreground hover:bg-background/50 hover:text-destructive rounded-sm transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </div>

      {/* Mobile Overlay Background */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={closeMenu}
        />
      )}
    </>
  );
}