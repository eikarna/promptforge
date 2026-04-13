"use client";

import { useState, useEffect, useCallback } from "react";
import {
  History,
  Search,
  Trash2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  Filter,
} from "lucide-react";
import { getPromptHistory, deletePrompt } from "@/actions/history";
import { FRAMEWORKS, TONES, INDUSTRIES } from "@/types";
import type { FrameworkType } from "@/types";

interface PromptRecord {
  id: string;
  rawPrompt: string;
  enrichedPrompt: string;
  framework: string;
  tone: string;
  industry: string;
  model: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [prompts, setPrompts] = useState<PromptRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterFramework, setFilterFramework] = useState<string>("");

  const loadHistory = useCallback(async () => {
    setLoading(true);
    const result = await getPromptHistory(page);
    if (result.prompts) {
      setPrompts(result.prompts as PromptRecord[]);
      setTotal(result.total || 0);
    }
    setLoading(false);
  }, [page]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleDelete = async (id: string) => {
    await deletePrompt(id);
    setPrompts((prev) => prev.filter((p) => p.id !== id));
    setTotal((prev) => prev - 1);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = prompts.filter((p) => {
    const matchSearch =
      !search ||
      p.rawPrompt.toLowerCase().includes(search.toLowerCase()) ||
      p.enrichedPrompt.toLowerCase().includes(search.toLowerCase());
    const matchFramework = !filterFramework || p.framework === filterFramework;
    return matchSearch && matchFramework;
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-glass-border)]">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-bold flex items-center gap-2">
            <History className="w-5 h-5 text-[var(--color-accent-violet)]" />
            Prompt History
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            {total} enriched prompts
          </p>
        </div>
      </header>

      {/* Filters */}
      <div className="px-6 py-3 flex items-center gap-3 border-b border-[var(--color-glass-border)]">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts..."
            className="input-glass pl-9 py-2 text-sm"
          />
        </div>
        <select
          value={filterFramework}
          onChange={(e) => setFilterFramework(e.target.value)}
          className="select-glass w-auto py-2 text-sm"
        >
          <option value="">All Frameworks</option>
          {Object.entries(FRAMEWORKS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-auto p-6 space-y-3">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="spinner-orbital" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Clock className="w-12 h-12 text-[var(--color-text-muted)] mb-4 opacity-40" />
            <h3 className="font-[var(--font-display)] text-lg font-semibold mb-1">
              No prompts yet
            </h3>
            <p className="text-sm text-[var(--color-text-muted)]">
              Enriched prompts will appear here
            </p>
          </div>
        ) : (
          filtered.map((prompt) => {
            const isExpanded = expandedId === prompt.id;
            const frameworkLabel =
              FRAMEWORKS[prompt.framework as FrameworkType] || prompt.framework;
            const date = new Date(prompt.createdAt);

            return (
              <div key={prompt.id} className="glass rounded-xl overflow-hidden">
                {/* Summary row */}
                <button
                  onClick={() =>
                    setExpandedId(isExpanded ? null : prompt.id)
                  }
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-[var(--color-glass-hover)] transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {prompt.rawPrompt}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="badge badge-cyan text-[10px]">
                        {frameworkLabel}
                      </span>
                      <span className="badge badge-violet text-[10px]">
                        {TONES[prompt.tone as keyof typeof TONES] || prompt.tone}
                      </span>
                      <span className="text-[10px] text-[var(--color-text-muted)]">
                        {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[var(--color-text-muted)]" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--color-text-muted)]" />
                  )}
                </button>

                {/* Expanded content */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-[var(--color-glass-border)]">
                    <div className="mt-4 mb-3">
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                        Raw Prompt
                      </p>
                      <p className="text-sm text-[var(--color-text-secondary)] bg-black/20 rounded-lg p-3">
                        {prompt.rawPrompt}
                      </p>
                    </div>

                    <div className="mb-3">
                      <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                        Enriched Prompt
                      </p>
                      <div className="text-sm enriched-output bg-black/20 rounded-lg p-3 max-h-80 overflow-auto whitespace-pre-wrap">
                        {prompt.enrichedPrompt}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          handleCopy(prompt.id, prompt.enrichedPrompt)
                        }
                        className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3"
                      >
                        {copiedId === prompt.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(prompt.id)}
                        className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3 text-[var(--color-danger)] border-[var(--color-danger)]/20 hover:bg-[var(--color-danger)]/10"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
