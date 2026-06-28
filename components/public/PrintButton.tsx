"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <button 
      onClick={handlePrint}
      className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer"
    >
      <Printer className="w-5 h-5" />
      <span className="font-sans text-[10px] uppercase tracking-widest">Print Poem</span>
    </button>
  );
}