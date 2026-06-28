"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { Quote } from "@/types";
import { QuoteCard } from "@/components/public/QuoteCard";

interface QuotesArchiveProps {
  initialQuotes: Quote[];
}

const ITEMS_PER_PAGE = 8;

export function QuotesArchive({ initialQuotes }: QuotesArchiveProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState<string>("All");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Extract unique years from the publication dates for the filter
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    initialQuotes.forEach((quote) => {
      if (quote.publicationDate) {
        const year = new Date(quote.publicationDate).getFullYear().toString();
        years.add(year);
      }
    });
    return ["All", ...Array.from(years).sort((a, b) => Number(b) - Number(a))];
  }, [initialQuotes]);

  // Filter quotes based on search query and selected year
  const filteredQuotes = useMemo(() => {
    return initialQuotes.filter((quote) => {
      const matchesSearch = 
        quote.quote.toLowerCase().includes(searchQuery.toLowerCase()) || 
        quote.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      const quoteYear = new Date(quote.publicationDate).getFullYear().toString();
      const matchesYear = selectedYear === "All" || quoteYear === selectedYear;

      return matchesSearch && matchesYear;
    });
  }, [initialQuotes, searchQuery, selectedYear]);

  const visibleQuotes = filteredQuotes.slice(0, visibleCount);
  const hasMore = visibleCount < filteredQuotes.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
  };

  return (
    <div className="space-y-16">
      {/* Search and Filter Tools */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-center border-b border-border pb-8">
        
        {/* Live Search */}
        <div className="relative w-full md:w-1/2 lg:w-1/3">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search quotes by text..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on search
            }}
            className="w-full pl-10 pr-4 py-3 bg-transparent border border-border font-body text-primary focus:outline-none focus:border-primary transition-colors text-sm"
          />
        </div>

        {/* Year Filter */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-end w-full md:w-auto">
          {availableYears.map((year) => (
            <button
              key={year}
              onClick={() => {
                setSelectedYear(year);
                setVisibleCount(ITEMS_PER_PAGE); // Reset pagination on filter
              }}
              className={`px-4 py-2 font-sans text-[10px] uppercase tracking-widest transition-colors ${
                selectedYear === year
                  ? "bg-primary text-primary-foreground"
                  : "bg-transparent border border-border text-primary hover:bg-muted"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Display */}
      {filteredQuotes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
          {visibleQuotes.map((quote) => (
            <QuoteCard key={quote.id} quote={quote} />
          ))}
        </div>
      ) : (
        <div className="py-24 text-center border border-border bg-muted/10">
          <p className="font-serif text-2xl text-primary">No quotes found.</p>
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground mt-4">
            Try adjusting your search or year filter.
          </p>
        </div>
      )}

      {/* Load More Pagination */}
      {hasMore && (
        <div className="flex justify-center pt-8 border-t border-border mt-16">
          <button
            onClick={handleLoadMore}
            className="px-8 py-4 bg-transparent border border-border text-primary font-sans text-xs uppercase tracking-widest hover:bg-background transition-colors"
          >
            Load More Quotes
          </button>
        </div>
      )}
    </div>
  );
}