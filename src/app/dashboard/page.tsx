"use client";

import { useState, useRef, useCallback } from "react";
import {
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Wand2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { FRAMEWORKS, TONES, INDUSTRIES, MODELS } from "@/types";
import type { FrameworkType, ToneType, IndustryType } from "@/types";

const STATUS_MESSAGES = [
  "Analyzing prompt structure...",
  "Applying framework scaffolding...",
  "Enriching with expert context...",
  "Optimizing output quality...",
  "Polishing final prompt...",
];

export default function DashboardPage() {
  // Input state
  const [rawPrompt, setRawPrompt] = useState("");
  const [framework, setFramework] = useState<FrameworkType>("co-star");
  const [tone, setTone] = useState<ToneType>("professional");
  const [industry, setIndustry] = useState<IndustryType>("general");
  const [model, setModel] = useState<string>(MODELS[0].id);
  const [temperature, setTemperature] = useState(0.7);

  // Output state
  const [enrichedPrompt, setEnrichedPrompt] = useState("");
  const [isEnriching, setIsEnriching] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);

  // UI state
  const [showPreferences, setShowPreferences] = useState(true);
  const outputRef = useRef<HTMLDivElement>(null);
  const statusInterval = useRef<NodeJS.Timeout>(undefined);

  const handleEnrich = useCallback(async () => {
    if (!rawPrompt.trim()) return;

    setIsEnriching(true);
    setEnrichedPrompt("");
    setError("");
    setStatusIdx(0);
    setCopied(false);

    // Rotate status messages
    let idx = 0;
    statusInterval.current = setInterval(() => {
      idx = (idx + 1) % STATUS_MESSAGES.length;
      setStatusIdx(idx);
    }, 3000);

    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rawPrompt: rawPrompt.trim(),
          framework,
          tone,
          industry,
          model,
          temperature,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Error ${response.status}`);
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        setEnrichedPrompt(fullText);

        // Auto-scroll
        if (outputRef.current) {
          outputRef.current.scrollTop = outputRef.current.scrollHeight;
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to enrich prompt");
    } finally {
      setIsEnriching(false);
      clearInterval(statusInterval.current);
    }
  }, [rawPrompt, framework, tone, industry, model, temperature]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(enrichedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [enrichedPrompt]);

  const handleReset = useCallback(() => {
    setRawPrompt("");
    setEnrichedPrompt("");
    setError("");
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-glass-border)]">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-bold flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-[var(--color-accent-cyan)]" />
            Enrichment Workspace
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Transform raw prompts into expert-engineered outputs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleReset}
            className="btn-ghost text-xs flex items-center gap-1.5 py-2 px-3"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        </div>
      </header>

      {/* Main content: split view */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Left panel: Input */}
        <div className="lg:w-1/2 flex flex-col border-r border-[var(--color-glass-border)] overflow-auto">
          {/* Prompt input */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-[var(--color-text-secondary)]">
                Raw Prompt
              </label>
              <span className="text-xs text-[var(--color-text-muted)]">
                {rawPrompt.length} chars
              </span>
            </div>
            <textarea
              value={rawPrompt}
              onChange={(e) => setRawPrompt(e.target.value)}
              placeholder="Enter your raw prompt here... e.g., 'write a marketing email for our new AI product'"
              className="textarea-glass flex-1"
              disabled={isEnriching}
            />

            {/* Preference Panel */}
            <div className="mt-4">
              <button
                onClick={() => setShowPreferences(!showPreferences)}
                className="flex items-center gap-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors mb-3"
              >
                <Sparkles className="w-4 h-4 text-[var(--color-accent-violet)]" />
                Enrichment Settings
                {showPreferences ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {showPreferences && (
                <div className="glass rounded-xl p-5 space-y-4 animate-fade-in-up" style={{ animationDuration: '0.3s' }}>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Framework */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                        Framework
                      </label>
                      <select
                        value={framework}
                        onChange={(e) => setFramework(e.target.value as FrameworkType)}
                        className="select-glass"
                        disabled={isEnriching}
                      >
                        {Object.entries(FRAMEWORKS).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Tone */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                        Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value as ToneType)}
                        className="select-glass"
                        disabled={isEnriching}
                      >
                        {Object.entries(TONES).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                        Industry
                      </label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value as IndustryType)}
                        className="select-glass"
                        disabled={isEnriching}
                      >
                        {Object.entries(INDUSTRIES).map(([key, label]) => (
                          <option key={key} value={key}>
                            {label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Model */}
                    <div>
                      <label className="block text-xs font-medium text-[var(--color-text-muted)] mb-1.5">
                        Model
                      </label>
                      <select
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className="select-glass"
                        disabled={isEnriching}
                      >
                        {MODELS.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Temperature */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-medium text-[var(--color-text-muted)]">
                        Temperature
                      </label>
                      <span className="text-xs text-[var(--color-accent-cyan)] font-mono">
                        {temperature.toFixed(1)}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full accent-[var(--color-accent-cyan)]"
                      disabled={isEnriching}
                    />
                    <div className="flex justify-between text-[10px] text-[var(--color-text-muted)] mt-0.5">
                      <span>Precise</span>
                      <span>Creative</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Enrich button */}
            <button
              onClick={handleEnrich}
              disabled={isEnriching || !rawPrompt.trim()}
              className="btn-primary mt-4 flex items-center justify-center gap-2 py-3.5 text-base"
            >
              {isEnriching ? (
                <>
                  <div className="spinner-orbital" style={{ width: 20, height: 20 }} />
                  {STATUS_MESSAGES[statusIdx]}
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Enrich Prompt
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right panel: Output */}
        <div className="lg:w-1/2 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--color-glass-border)]">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-text-secondary)]">
                Enriched Output
              </span>
              {enrichedPrompt && (
                <span className="badge badge-cyan text-[10px]">
                  {FRAMEWORKS[framework]}
                </span>
              )}
            </div>
            {enrichedPrompt && (
              <button
                onClick={handleCopy}
                className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-[var(--color-success)]" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copy
                  </>
                )}
              </button>
            )}
          </div>

          <div ref={outputRef} className="flex-1 overflow-auto p-6">
            {error && (
              <div className="p-4 rounded-xl bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)] text-sm flex items-start gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium">Enrichment Failed</p>
                  <p className="mt-1 opacity-80">{error}</p>
                </div>
              </div>
            )}

            {!enrichedPrompt && !isEnriching && !error && (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent-cyan)]/10 to-[var(--color-accent-violet)]/10 flex items-center justify-center mb-4 border border-[var(--color-glass-border)]">
                  <Wand2 className="w-7 h-7 text-[var(--color-accent-cyan)]" />
                </div>
                <h3 className="font-[var(--font-display)] text-lg font-semibold mb-1">
                  Ready to Enrich
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] max-w-xs">
                  Enter a raw prompt on the left and click &quot;Enrich Prompt&quot; to
                  transform it using AI-powered frameworks.
                </p>
              </div>
            )}

            {isEnriching && !enrichedPrompt && (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="spinner-orbital mb-6" />
                <p className="text-sm text-[var(--color-accent-cyan)] font-medium animate-pulse">
                  {STATUS_MESSAGES[statusIdx]}
                </p>
              </div>
            )}

            {enrichedPrompt && (
              <div className={`enriched-output whitespace-pre-wrap ${isEnriching ? "cursor-blink" : ""}`}>
                {enrichedPrompt}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
