"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Key,
  Eye,
  EyeOff,
  Check,
  Loader2,
  Shield,
  AlertCircle,
} from "lucide-react";
import { saveApiKey, removeApiKey, hasApiKey } from "@/actions/settings";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    hasApiKey().then(setHasKey);
  }, []);

  const handleSave = async () => {
    if (!apiKey.trim()) return;
    setSaving(true);
    setMessage(null);

    const formData = new FormData();
    formData.set("apiKey", apiKey.trim());

    const result = await saveApiKey(formData);

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "API key saved successfully" });
      setHasKey(true);
      setApiKey("");
    }
    setSaving(false);
  };

  const handleRemove = async () => {
    setRemoving(true);
    setMessage(null);

    const result = await removeApiKey();

    if (result.error) {
      setMessage({ type: "error", text: result.error });
    } else {
      setMessage({ type: "success", text: "API key removed" });
      setHasKey(false);
    }
    setRemoving(false);
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-glass-border)]">
        <div>
          <h1 className="font-[var(--font-display)] text-xl font-bold flex items-center gap-2">
            <Settings className="w-5 h-5 text-[var(--color-accent-emerald)]" />
            Settings
          </h1>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            Manage your API keys and preferences
          </p>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl space-y-6">
          {/* API Key Section */}
          <div className="glass-strong rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[var(--color-accent-cyan)]/10 flex items-center justify-center">
                <Key className="w-5 h-5 text-[var(--color-accent-cyan)]" />
              </div>
              <div>
                <h2 className="font-[var(--font-display)] text-lg font-semibold">
                  OpenRouter API Key
                </h2>
                <p className="text-xs text-[var(--color-text-muted)]">
                  Required to use AI models for prompt enrichment
                </p>
              </div>
            </div>

            {/* Status */}
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-sm"
              style={{
                background: hasKey ? 'rgba(52,211,153,0.08)' : 'rgba(245,158,11,0.08)',
                border: `1px solid ${hasKey ? 'rgba(52,211,153,0.2)' : 'rgba(245,158,11,0.2)'}`,
                color: hasKey ? 'var(--color-accent-emerald)' : 'var(--color-warning)',
              }}
            >
              {hasKey ? (
                <>
                  <Shield className="w-4 h-4" />
                  API key configured (encrypted)
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4" />
                  No API key configured — set one below or use the server default
                </>
              )}
            </div>

            {message && (
              <div
                className={`mb-4 p-3 rounded-xl text-sm flex items-center gap-2 ${
                  message.type === "success"
                    ? "bg-[var(--color-success)]/10 border border-[var(--color-success)]/20 text-[var(--color-success)]"
                    : "bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 text-[var(--color-danger)]"
                }`}
              >
                {message.type === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <AlertCircle className="w-4 h-4" />
                )}
                {message.text}
              </div>
            )}

            <div className="space-y-3">
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="input-glass pr-10 font-mono text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition-colors"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving || !apiKey.trim()}
                  className="btn-primary flex items-center gap-2 text-sm py-2.5 px-5"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Save Key
                    </>
                  )}
                </button>

                {hasKey && (
                  <button
                    onClick={handleRemove}
                    disabled={removing}
                    className="btn-ghost text-sm flex items-center gap-2 text-[var(--color-danger)] border-[var(--color-danger)]/20 hover:bg-[var(--color-danger)]/10 py-2.5 px-5"
                  >
                    {removing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Remove Key"
                    )}
                  </button>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs text-[var(--color-text-muted)] leading-relaxed">
              Get your API key from{" "}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--color-accent-cyan)] hover:underline"
              >
                openrouter.ai/keys
              </a>
              . Your key is encrypted before storage and never exposed to the client.
            </p>
          </div>

          {/* How It Works */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-[var(--font-display)] text-base font-semibold mb-3">
              How API Keys Work
            </h2>
            <ul className="space-y-2 text-sm text-[var(--color-text-secondary)]">
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent-cyan)] font-bold mt-0.5">1.</span>
                Your personal API key is used for all enrichment requests
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent-cyan)] font-bold mt-0.5">2.</span>
                Keys are encrypted with XOR cipher before database storage
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent-cyan)] font-bold mt-0.5">3.</span>
                If no personal key is set, the server&apos;s default key is used (if available)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[var(--color-accent-cyan)] font-bold mt-0.5">4.</span>
                You can change or remove your key at any time
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
