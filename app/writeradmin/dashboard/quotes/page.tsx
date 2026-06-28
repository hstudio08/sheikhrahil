"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit } from "lucide-react";
import { getQuotes, deleteQuote } from "@/lib/firebase/db-quotes";
import { Quote } from "@/types";

export default function QuotesDashboardPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadQuotes();
  }, []);

  async function loadQuotes() {
    setIsLoading(true);
    try {
      const data = await getQuotes();
      setQuotes(data);
    } catch (error) {
      console.error("Failed to load quotes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this quote?")) return;
    
    try {
      await deleteQuote(id);
      setQuotes(quotes.filter(quote => quote.id !== id));
    } catch (error) {
      console.error("Failed to delete quote:", error);
      alert("Error deleting quote.");
    }
  }

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 mb-8">
        <div>
          <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">
            Library Management
          </span>
          <h1 className="text-4xl font-serif">Quotes</h1>
        </div>
        
        <Link
          href="/writeradmin/dashboard/quotes/create"
          className="mt-4 md:mt-0 flex items-center gap-2 bg-primary text-primary-foreground font-sans tracking-wider uppercase text-xs px-5 py-3 hover:opacity-90 transition-all rounded-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Quote
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-muted-foreground font-sans text-sm">
          Loading quote matrix...
        </div>
      ) : quotes.length === 0 ? (
        <div className="border border-dashed border-border rounded-sm p-12 text-center bg-white">
          <p className="font-sans text-sm text-muted-foreground mb-4">No quotes found in the archive.</p>
          <Link
            href="/writeradmin/dashboard/quotes/create"
            className="inline-flex items-center gap-2 text-primary hover:underline font-sans text-sm"
          >
            <Plus className="w-4 h-4" /> Start writing
          </Link>
        </div>
      ) : (
        <div className="border border-border bg-white rounded-sm overflow-hidden">
          <table className="w-full text-left font-sans text-sm">
            <thead className="bg-background/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground w-1/2">Quote Excerpt</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden md:table-cell">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {quotes.map((quote) => (
                <tr key={quote.id} className="hover:bg-background/30 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-serif text-primary truncate max-w-md">
                      "{quote.quote}"
                    </p>
                    {quote.isFeatured && (
                      <span className="mt-1 inline-block px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] uppercase tracking-wider rounded-sm">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className={`px-2 py-1 rounded-sm text-xs uppercase tracking-wider ${quote.isPublished ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {quote.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground hidden lg:table-cell">
                    {quote.publicationDate}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                     <Link 
                      href={`/writeradmin/dashboard/quotes/${quote.id}`} 
                      className="flex items-center gap-2 px-3 py-1.5 text-sm bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors rounded-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>
                      <button 
                        onClick={() => handleDelete(quote.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors" 
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}