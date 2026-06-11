import React, { useState } from "react";
import { Search, Sparkles, BookOpen, Clock, Star, Plus, ArrowUpRight, GraduationCap, Users } from "lucide-react";
import { AISummary } from "../types";

interface DashboardViewProps {
  summaries: AISummary[];
  onSelectSummary: (summary: AISummary) => void;
  onNewSummary: () => void;
  onToggleBookmark: (e: React.MouseEvent, summary: AISummary) => void;
}

export function DashboardView({
  summaries,
  onSelectSummary,
  onNewSummary,
  onToggleBookmark,
}: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Calculate stats from actual state
  const totalSummariesCount = summaries.length;
  const timeSavedValue = summaries.reduce((acc, curr) => acc + (curr.readingTime || 0.1), 0);
  const timeSavedFormatted = (timeSavedValue / 6).toFixed(1); // logical estimation: study notes save roughly 1/6th of parsing time

  // Define static categories
  const categoriesList = ["All", "Meetings", "Lectures", "Interviews", "Personal"];

  // Filter lists based on Search + Filters
  const filteredSummaries = summaries.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      activeCategory === "All" ||
      item.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8 animate-fade-in p-1">
      {/* Search & filters bar */}
      <section className="space-y-4">
        <div className="relative group search-glow w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant w-5 h-5 transition-colors group-focus-within:text-secondary" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container/50 border border-outline-variant/30 focus:border-secondary focus:ring-0 text-base py-4 pl-12 pr-4 transition-all outline-none rounded-xl text-on-surface placeholder:text-outline"
            placeholder="Search summaries, key files, or keywords..."
          />
        </div>

        {/* Filter categories horizontally scrollable list */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-semibold text-xs tracking-wide uppercase transition-all shrink-0 cursor-pointer ${
                activeCategory === cat
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container text-on-surface-variant hover:bg-surface-variant/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Numerical Stats overview panels */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container/65 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-3xl md:text-5xl font-bold text-secondary tracking-tight">
            {totalSummariesCount}
          </span>
          <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider font-mono">
            Summaries Created
          </span>
        </div>

        <div className="bg-surface-container/65 backdrop-blur-md p-6 rounded-2xl border border-outline-variant/20 flex flex-col items-center justify-center text-center space-y-1">
          <span className="text-3xl md:text-5xl font-bold text-primary tracking-tight">
            {timeSavedFormatted}h
          </span>
          <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider font-mono">
            Reading Time Saved
          </span>
        </div>
      </section>

      {/* Recents summaries lists */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight text-on-surface">
            Recent Summaries
          </h2>
          <span className="text-xs text-on-surface-variant font-medium">
            Showing {filteredSummaries.length} items
          </span>
        </div>

        {filteredSummaries.length === 0 ? (
          <div className="bg-surface-container/40 p-12 text-center rounded-2xl border border-dashed border-outline-variant/20">
            <BookOpen className="w-12 h-12 text-outline mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-bold mb-1">No summaries found</h3>
            <p className="text-on-surface-variant text-sm max-w-sm mx-auto mb-6">
              {summaries.length === 0
                ? "You haven't summarized any folders or document files yet."
                : "No matching results. Try clearing search keywords or filters."}
            </p>
            {summaries.length === 0 && (
              <button
                onClick={onNewSummary}
                className="px-5 py-2.5 bg-primary text-on-primary text-xs font-bold uppercase tracking-wider rounded-xl hover:scale-[1.02] flex items-center gap-1.5 mx-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Summarize First Note
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSummaries.map((summary) => (
              <div
                key={summary.summaryId}
                onClick={() => onSelectSummary(summary)}
                className="bg-surface-container/50 backdrop-blur-md hover:bg-surface-container/90 border border-outline-variant/15 hover:border-secondary/40 p-6 rounded-2xl flex flex-col justify-between gap-4 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-secondary/5 group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <span className="px-2.5 py-1 rounded-full text-[10px] uppercase font-bold bg-secondary/10 border border-secondary/20 text-secondary flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-secondary fill-secondary" />
                    {summary.category || "General"}
                  </span>
                  <span className="text-xs text-on-surface-variant font-mono flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {summary.readingTime?.toFixed(0) || "2"}m read
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-on-surface leading-tight tracking-tight group-hover:text-secondary transition-colors">
                    {summary.title}
                  </h3>
                  <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2">
                    {summary.shortSummary}
                  </p>
                </div>

                <div className="pt-3 flex justify-between items-center border-t border-outline-variant/10">
                  <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">
                    {summary.createdAt ? new Date(summary.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    }) : "Just now"}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => onToggleBookmark(e, summary)}
                      className="p-1.5 hover:bg-surface-variant/40 rounded-lg transition-colors cursor-pointer"
                      title={summary.isBookmarked ? "Remove Bookmark" : "Bookmark Summary"}
                    >
                      <Star
                        className={`w-4 h-4 transition-colors ${
                          summary.isBookmarked ? "text-secondary fill-secondary" : "text-outline hover:text-secondary"
                        }`}
                      />
                    </button>
                    <button className="p-1.5 hover:bg-surface-variant/40 rounded-lg text-primary hover:text-secondary transition-colors cursor-pointer">
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating Action Button (FAB) (Pillar 1/2) */}
      <button
        onClick={onNewSummary}
        className="fixed bottom-24 right-6 md:right-12 w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-[1.08] active:scale-[0.94] hover:shadow-primary/30 transition-all cursor-pointer z-40 group"
        title="Compose New Summary"
      >
        <Plus className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
      </button>
    </div>
  );
}
