import React, { useState } from "react";
import { Search, Trash2, Download, CheckSquare, Square, Star, Calendar, ArrowRight, BookOpen } from "lucide-react";
import { AISummary } from "../types";

interface HistoryViewProps {
  summaries: AISummary[];
  onSelectSummary: (summary: AISummary) => void;
  onDeleteSummary: (id: string) => void;
  onToggleBookmark: (e: React.MouseEvent, summary: AISummary) => void;
}

export function HistoryView({
  summaries,
  onSelectSummary,
  onDeleteSummary,
  onToggleBookmark,
}: HistoryViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredHistory.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredHistory.map((item) => item.summaryId));
    }
  };

  const handleToggleSelectItem = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Bulk actions
  const handleBulkDelete = () => {
    if (confirm(`Are you sure you want to permanently delete these ${selectedIds.length} summaries?`)) {
      selectedIds.forEach((id) => onDeleteSummary(id));
      setSelectedIds([]);
    }
  };

  const handleBulkExport = () => {
    const selectedSummaries = summaries.filter((item) => selectedIds.includes(item.summaryId));
    const textOutput = selectedSummaries
      .map(
        (s) =>
          `=== ${s.title.toUpperCase()} ===\nCategory: ${s.category}\nLanguage: ${s.language}\nSummary:\n${s.shortSummary}\n`
      )
      .join("\n\n-------------------------\n\n");

    const blob = new Blob([textOutput], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "batch_summaries_export.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Filters logic
  const filteredHistory = summaries.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.originalText.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBookmark = !showBookmarksOnly || item.isBookmarked;

    return matchesSearch && matchesBookmark;
  });

  return (
    <div className="space-y-6 animate-fade-in p-1 max-w-4xl mx-auto">
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-extrabold text-on-background">Summary History</h2>
        <p className="text-on-surface-variant text-sm">
          Search, examine, batch export, or wipe your previous note transcript summaries.
        </p>
      </div>

      {/* Toolbar filters and search */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-surface-container/30 p-4 border border-outline-variant/10 rounded-2xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-on-surface-variant" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-container-high/60 border border-outline-variant/15 text-sm py-2.5 pl-10 pr-4 rounded-xl outline-none focus:border-secondary transition-all"
            placeholder="Search within historical transcripts..."
          />
        </div>

        <div className="flex gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setShowBookmarksOnly(!showBookmarksOnly)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 border transition-all cursor-pointer ${
              showBookmarksOnly
                ? "bg-secondary-container/10 border-secondary/50 text-secondary"
                : "bg-surface-container/50 border-outline-variant/10 text-on-surface-variant hover:bg-surface-variant/20"
            }`}
          >
            <Star className={`w-4 h-4 ${showBookmarksOnly ? "fill-secondary text-secondary" : ""}`} />
            <span>Starred Only</span>
          </button>
        </div>
      </section>

      {/* Selected batch toolbar */}
      {selectedIds.length > 0 && (
        <section className="flex justify-between items-center bg-secondary/10 border border-secondary/20 p-4 rounded-xl animate-scale-up">
          <span className="text-xs font-bold text-secondary uppercase font-mono">
            {selectedIds.length} summaries selected
          </span>
          <div className="flex gap-2">
            <button
              onClick={handleBulkExport}
              className="px-3.5 py-1.5 bg-surface-container-high/80 text-secondary border border-secondary/20 text-xs font-bold uppercase rounded-lg hover:bg-surface-variant/40 flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Selected</span>
            </button>
            <button
              onClick={handleBulkDelete}
              className="px-3.5 py-1.5 bg-error-container/20 text-error border border-error/20 text-xs font-bold uppercase rounded-lg hover:bg-error-container/30 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Wipe Selected</span>
            </button>
          </div>
        </section>
      )}

      {/* Main timeline listing */}
      {filteredHistory.length === 0 ? (
        <div className="bg-surface-container/30 p-12 rounded-2xl border border-outline-variant/15 text-center">
          <BookOpen className="w-12 h-12 text-outline mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold mb-1">No summaries match criteria</h3>
          <p className="text-on-surface-variant text-sm max-w-sm mx-auto">
            {summaries.length === 0
              ? "Your timeline history is currently empty. Generate a summary first."
              : "Try checking keywords or turning off the Starred Only filter."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* Header controls box */}
          <div className="flex items-center gap-2 px-4 py-2">
            <button onClick={handleToggleSelectAll} className="text-outline hover:text-secondary cursor-pointer">
              {selectedIds.length === filteredHistory.length ? (
                <CheckSquare className="w-4.5 h-4.5 text-secondary" />
              ) : (
                <Square className="w-4.5 h-4.5" />
              )}
            </button>
            <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider font-mono">
              Batch Selection Checklist ({filteredHistory.length} total)
            </span>
          </div>

          {/* Cards listing */}
          <div className="space-y-2.5">
            {filteredHistory.map((item) => {
              const isSelected = selectedIds.includes(item.summaryId);
              return (
                <div
                  key={item.summaryId}
                  className={`border p-4.5 rounded-2xl flex items-center gap-4 transition-all hover:bg-surface-container-low/70 ${
                    isSelected
                      ? "bg-secondary-container/5 border-secondary/30"
                      : "bg-surface-container/30 border-outline-variant/10"
                  }`}
                >
                  <button
                    onClick={() => handleToggleSelectItem(item.summaryId)}
                    className="text-outline hover:text-secondary shrink-0 cursor-pointer"
                  >
                    {isSelected ? (
                      <CheckSquare className="w-4.5 h-4.5 text-secondary" />
                    ) : (
                      <Square className="w-4.5 h-4.5" />
                    )}
                  </button>

                  <div
                    onClick={() => onSelectSummary(item)}
                    className="flex-1 min-w-0 cursor-pointer space-y-1"
                  >
                    <div className="flex gap-2 items-center">
                      <span className="px-2 py-0.5 rounded-full text-[9px] uppercase font-bold bg-primary/10 border border-primary/20 text-primary">
                        {item.category}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80 font-mono flex items-center gap-1 uppercase">
                        <Calendar className="w-3 h-3" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-sm md:text-base text-on-surface truncate pr-4">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={(e) => onToggleBookmark(e, item)}
                      className="p-1.5 hover:bg-surface-variant/30 rounded-lg transition-colors cursor-pointer"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          item.isBookmarked ? "text-secondary fill-secondary" : "text-outline"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => onSelectSummary(item)}
                      className="p-1.5 bg-surface-container-high/60 border border-outline-variant/10 rounded-lg hover:border-secondary/20 transition-colors cursor-pointer"
                    >
                      <ArrowRight className="w-4 h-4 text-secondary" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
