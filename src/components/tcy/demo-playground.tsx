"use client";

import { useId, useMemo, useState } from "react";
import { Tcy } from "@love-rox/tcy-react";
import { tokenize, type TargetPreset } from "@love-rox/tcy-core";

type Lang = "en" | "ja";

const copy = {
  en: {
    inputLabel: "本文 / Body text",
    targetLabel: "Target",
    combineLabel: "Combine consecutive runs",
    includeLabel: "include",
    includePlaceholder: "e.g. .",
    excludeLabel: "exclude",
    excludePlaceholder: "e.g. -",
    maxLengthLabel: "maxLength",
    maxLengthPlaceholder: "e.g. 2",
    excludeWordsLabel: "excludeWords",
    excludeWordsPlaceholder: "e.g. 2026, URL",
    rawLabel: "without <Tcy>",
    processedLabel: "with <Tcy>",
    rawSubtitle: "plain vertical typesetting",
    processedSubtitle: "uprighted by tate-chu-yoko",
    htmlLabel: "Generated markup",
    sectionControls: "Controls",
    sectionPreview: "Preview",
    sectionMarkup: "Markup",
    note: "Vertical writing and `text-combine-upright` work in all modern browsers. If the right page looks identical to the left, ensure your browser has `text-combine-upright: all` enabled.",
    targetLabels: {
      alphanumeric: "alphanumeric — A–Z, a–z, 0–9",
      alpha: "alpha — A–Z, a–z",
      digit: "digit — 0–9",
      ascii: "ascii — printable ASCII",
    },
  },
  ja: {
    inputLabel: "本文",
    targetLabel: "対象 (target)",
    combineLabel: "連続した対象を1スパンに連結",
    includeLabel: "include",
    includePlaceholder: "例: .",
    excludeLabel: "exclude",
    excludePlaceholder: "例: -",
    maxLengthLabel: "maxLength",
    maxLengthPlaceholder: "例: 2",
    excludeWordsLabel: "excludeWords",
    excludeWordsPlaceholder: "例: 2026, URL",
    rawLabel: "<Tcy> なし",
    processedLabel: "<Tcy> あり",
    rawSubtitle: "素の縦組み",
    processedSubtitle: "縦中横を適用",
    htmlLabel: "生成された HTML",
    sectionControls: "操作盤",
    sectionPreview: "見開き",
    sectionMarkup: "出力",
    note: "縦書きと `text-combine-upright` はモダンブラウザで動作します。右の頁が左と同じに見える場合、お使いのブラウザで `text-combine-upright: all` が有効か確認してください。",
    targetLabels: {
      alphanumeric: "alphanumeric — 英数字",
      alpha: "alpha — 英字のみ",
      digit: "digit — 数字のみ",
      ascii: "ascii — 印字可能 ASCII",
    },
  },
} as const;

const DEFAULT_TEXT = "第1章 2026年4月19日、Webの縦書きはAPIレベルから進化した。";
const TARGETS: TargetPreset[] = ["alphanumeric", "alpha", "digit", "ascii"];

function escape(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderHtml(text: string, options: Parameters<typeof tokenize>[1]): string {
  return tokenize(text, options)
    .map((s) =>
      s.type === "tcy" ? `<span class="tcy">${escape(s.value)}</span>` : escape(s.value),
    )
    .join("");
}

function InlineMd({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") && part.length >= 2 ? (
          <code
            key={i}
            className="font-mono text-[0.9em] px-1 py-0.5 bg-ground-deep text-shu-deep dark:text-shu"
            style={{ borderRadius: 2 }}
          >
            {part.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Field with a Gothic uppercase label and a hairline-bordered input. */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-mute">
        {label}
      </span>
      {children}
    </label>
  );
}

const inputCls =
  "bg-transparent text-ink font-mono text-sm pb-1.5 pt-0.5 px-0 outline-none focus:outline-none transition-colors";
const inputUnderline = { borderBottom: "1px solid var(--color-rule-strong)" };
const inputUnderlineFocus = "focus:[border-bottom-color:var(--color-shu)]";

/** Section heading inside the playground (Controls / Preview / Markup). */
function PanelHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-baseline gap-3">
      <span aria-hidden="true" className="block w-4 h-px bg-shu" />
      <h2 className="font-gothic text-[11px] uppercase tracking-[0.3em] text-ink-mute">
        {children}
      </h2>
    </div>
  );
}

export function DemoPlayground({ lang }: { lang: Lang }) {
  const t = copy[lang];
  const [text, setText] = useState(DEFAULT_TEXT);
  const [target, setTarget] = useState<TargetPreset>("alphanumeric");
  const [combine, setCombine] = useState(true);
  const [include, setInclude] = useState("");
  const [exclude, setExclude] = useState("");
  const [maxLengthInput, setMaxLengthInput] = useState("");
  const [excludeWordsInput, setExcludeWordsInput] = useState("");
  const combineId = useId();

  const options = useMemo(() => {
    const maxLengthValue = maxLengthInput ? Number.parseInt(maxLengthInput, 10) : NaN;
    const excludeWords = excludeWordsInput
      .split(",")
      .map((w) => w.trim())
      .filter(Boolean);
    return {
      target,
      combine,
      ...(include ? { include } : {}),
      ...(exclude ? { exclude } : {}),
      ...(Number.isFinite(maxLengthValue) && maxLengthValue > 0
        ? { maxLength: maxLengthValue }
        : {}),
      ...(excludeWords.length > 0 ? { excludeWords } : {}),
    };
  }, [target, combine, include, exclude, maxLengthInput, excludeWordsInput]);

  const html = useMemo(() => renderHtml(text, options), [text, options]);

  return (
    <div className="tcy-demo-scope">
      <style>{`
        .tcy-demo-scope .tcy-page .tcy {
          -webkit-text-combine: horizontal;
          text-combine-upright: all;
        }
        .tcy-demo-scope .tcy-page-vertical {
          writing-mode: vertical-rl;
          font-family: "Shippori Mincho B1", "Yu Mincho", serif;
          font-size: 1.5rem;
          line-height: 2.1;
          font-weight: 500;
          height: 22rem;
          overflow-x: auto;
          padding: 0.75rem 0.5rem;
        }
      `}</style>

      {/* —— Controls panel —————————————————————————————————————————— */}
      <section className="mb-12">
        <PanelHeading>{t.sectionControls}</PanelHeading>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
          <div className="lg:col-span-2">
            <Field label={t.inputLabel}>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={2}
                className={`${inputCls} resize-y w-full ${inputUnderlineFocus}`}
                style={inputUnderline}
              />
            </Field>
          </div>

          <Field label={t.targetLabel}>
            <select
              value={target}
              onChange={(e) => setTarget(e.target.value as TargetPreset)}
              className={`${inputCls} w-full appearance-none cursor-pointer ${inputUnderlineFocus}`}
              style={inputUnderline}
            >
              {TARGETS.map((val) => (
                <option key={val} value={val}>
                  {t.targetLabels[val]}
                </option>
              ))}
            </select>
          </Field>

          <div className="flex items-end">
            <label htmlFor={combineId} className="flex items-center gap-3 cursor-pointer pb-1.5">
              <span
                className="relative inline-block w-9 h-4 transition-colors"
                style={{
                  border: "1px solid var(--color-rule-strong)",
                  borderRadius: 999,
                  backgroundColor: combine ? "var(--color-shu)" : "transparent",
                }}
              >
                <input
                  id={combineId}
                  type="checkbox"
                  checked={combine}
                  onChange={(e) => setCombine(e.target.checked)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <span
                  className="absolute top-0.5 w-2.5 h-2.5 bg-ground transition-transform"
                  style={{
                    borderRadius: 999,
                    border: "1px solid var(--color-rule-strong)",
                    left: combine ? "calc(100% - 0.625rem - 2px)" : "2px",
                  }}
                />
              </span>
              <span className="font-gothic text-[12px] text-ink">{t.combineLabel}</span>
            </label>
          </div>

          <Field label={t.includeLabel}>
            <input
              value={include}
              onChange={(e) => setInclude(e.target.value)}
              placeholder={t.includePlaceholder}
              className={`${inputCls} w-full ${inputUnderlineFocus}`}
              style={inputUnderline}
            />
          </Field>

          <Field label={t.excludeLabel}>
            <input
              value={exclude}
              onChange={(e) => setExclude(e.target.value)}
              placeholder={t.excludePlaceholder}
              className={`${inputCls} w-full ${inputUnderlineFocus}`}
              style={inputUnderline}
            />
          </Field>

          <Field label={t.maxLengthLabel}>
            <input
              type="number"
              min={1}
              value={maxLengthInput}
              onChange={(e) => setMaxLengthInput(e.target.value)}
              placeholder={t.maxLengthPlaceholder}
              className={`${inputCls} w-full ${inputUnderlineFocus}`}
              style={inputUnderline}
            />
          </Field>

          <Field label={t.excludeWordsLabel}>
            <input
              value={excludeWordsInput}
              onChange={(e) => setExcludeWordsInput(e.target.value)}
              placeholder={t.excludeWordsPlaceholder}
              className={`${inputCls} w-full ${inputUnderlineFocus}`}
              style={inputUnderline}
            />
          </Field>
        </div>
      </section>

      {/* —— Preview panel: book-spread of two vertical pages ———————— */}
      <section className="mb-12">
        <PanelHeading>{t.sectionPreview}</PanelHeading>

        <div className="relative grid grid-cols-1 md:grid-cols-2">
          {/* central spine — only on md+ */}
          <span
            aria-hidden="true"
            className="hidden md:block absolute inset-y-4 left-1/2 -translate-x-1/2 w-px bg-shu"
          />

          {/* Left page: raw */}
          <div className="md:pr-10">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="font-mincho text-base text-ink-mute italic">{t.rawLabel}</p>
              <p className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                {t.rawSubtitle}
              </p>
            </div>
            <div
              className="tcy-page py-6 px-2 bg-ground-card"
              style={{
                borderTop: "1px solid var(--color-rule)",
                borderBottom: "1px solid var(--color-rule)",
              }}
            >
              <div className="flex justify-center">
                <p className="tcy-page-vertical text-ink">{text}</p>
              </div>
            </div>
          </div>

          {/* Right page: with Tcy */}
          <div className="md:pl-10 mt-10 md:mt-0">
            <div className="mb-3 flex items-baseline justify-between">
              <p className="font-mincho text-base text-shu-deep dark:text-shu italic">
                {t.processedLabel}
              </p>
              <p className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-soft">
                {t.processedSubtitle}
              </p>
            </div>
            <div
              className="tcy-page py-6 px-2 bg-ground-card"
              style={{
                borderTop: "1px solid var(--color-shu)",
                borderBottom: "1px solid var(--color-shu)",
              }}
            >
              <div className="flex justify-center">
                <p className="tcy-page-vertical text-ink">
                  <Tcy {...options}>{text}</Tcy>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* —— Markup panel —————————————————————————————————————————— */}
      <section>
        <PanelHeading>{t.sectionMarkup}</PanelHeading>
        <pre
          className="bg-ink text-ground font-mono text-[12px] leading-[1.7] py-5 pr-5 pl-6 overflow-x-auto m-0 whitespace-pre-wrap break-all"
          style={{ borderLeft: "2px solid var(--color-shu)" }}
        >
          <code>{html}</code>
        </pre>

        <p className="mt-6 text-xs text-ink-mute leading-relaxed">
          <InlineMd text={t.note} />
        </p>
      </section>
    </div>
  );
}
