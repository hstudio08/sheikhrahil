"use client";

import { useEffect, useState } from "react";
import { getDashboardStats } from "@/lib/firebase/db-settings";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState({ poems: 0, quotes: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error("Failed to load stats", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="py-10 animate-fade-in">
      <div className="border-b border-border pb-6 mb-8">
        <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">
          Control Console
        </span>
        <h1 className="text-4xl font-serif">Welcome back, Sheikh Rahil</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-border bg-white p-6 rounded-sm">
          <h3 className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">
            Published Poems
          </h3>
          {isLoading ? (
            <div className="h-8 w-12 bg-background animate-pulse rounded-sm"></div>
          ) : (
            <p className="text-3xl font-serif text-primary">{stats.poems}</p>
          )}
        </div>
        
        <div className="border border-border bg-white p-6 rounded-sm">
          <h3 className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">
            Published Quotes
          </h3>
          {isLoading ? (
            <div className="h-8 w-12 bg-background animate-pulse rounded-sm"></div>
          ) : (
            <p className="text-3xl font-serif text-primary">{stats.quotes}</p>
          )}
        </div>

        <div className="border border-border bg-white p-6 rounded-sm">
          <h3 className="font-sans text-xs tracking-widest uppercase text-muted-foreground mb-2">
            Environment Mode
          </h3>
          <p className="text-2xl font-serif text-primary">Production Core</p>
        </div>
      </div>
    </div>
  );
}