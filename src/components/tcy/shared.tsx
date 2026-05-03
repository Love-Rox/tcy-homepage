import type { ReactNode } from "react";
import { Link } from "waku";
import { Tcy } from "@love-rox/tcy-react";
import { localePath, type Locale } from "@/lib/locale";

export type { Locale };

export type AdapterKey = "core" | "react" | "vue" | "rehype" | "astro";

export interface AdapterMeta {
  key: AdapterKey;
  name: string;
  short: string;
  href: (locale: Locale) => string;
  isNew?: boolean;
}

export const ADAPTERS: AdapterMeta[] = [
  {
    key: "core",
    name: "@love-rox/tcy-core",
    short: "core",
    href: (l) => localePath(l, ""),
  },
  {
    key: "react",
    name: "@love-rox/tcy-react",
    short: "react",
    href: (l) => localePath(l, "react"),
  },
  {
    key: "vue",
    name: "@love-rox/tcy-vue",
    short: "vue",
    href: (l) => localePath(l, "vue"),
  },
  {
    key: "rehype",
    name: "@love-rox/tcy-rehype",
    short: "rehype",
    href: (l) => localePath(l, "rehype"),
  },
  {
    key: "astro",
    name: "@love-rox/tcy-astro",
    short: "astro",
    href: (l) => localePath(l, "astro"),
    isNew: true,
  },
];

// —— wa-modern primitives ——————————————————————————————————————————

const KANJI_NUMS = ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];

/** Vertical Kanji chapter number for section margins. Index is 1-based. */
export function ChapterNumber({ n }: { n: number }) {
  const k = KANJI_NUMS[n - 1] ?? String(n);
  return (
    <span
      aria-hidden="true"
      className="font-mincho text-shu-deep dark:text-shu select-none"
      style={{
        writingMode: "vertical-rl",
        fontSize: "0.875rem",
        letterSpacing: "0.4em",
        lineHeight: 1,
      }}
    >
      第{k}
    </span>
  );
}

/** A small red square 落款印 (seal). Used in footer + accent moments. */
export function SealMark({ label = "縦中横", size = 56 }: { label?: string; size?: number }) {
  return (
    <span
      role="img"
      aria-label={label}
      className="inline-flex items-center justify-center font-mincho text-ground bg-shu-deep select-none"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.28,
        lineHeight: 1,
        letterSpacing: "0.05em",
        writingMode: "vertical-rl",
        padding: size * 0.08,
        borderRadius: 2,
        boxShadow: "inset 0 0 0 2px rgba(244,237,226,0.2)",
        fontWeight: 700,
      }}
    >
      {label}
    </span>
  );
}

/** A hairline rule. Defaults to horizontal ink, pass orientation/tone to vary. */
export function Rule({
  orientation = "h",
  tone = "ink",
  className = "",
}: {
  orientation?: "h" | "v";
  tone?: "ink" | "shu";
  className?: string;
}) {
  const color = tone === "shu" ? "bg-shu" : "bg-rule";
  const dim = orientation === "h" ? "h-px w-full" : "w-px h-full";
  return <span aria-hidden="true" className={`block ${color} ${dim} ${className}`} />;
}

/** Section: chapter-number margin + Mincho heading + content. Optional eyebrow. */
export function Section({
  n,
  eyebrow,
  heading,
  children,
  className = "",
}: {
  n?: number;
  eyebrow?: string;
  heading: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`relative mb-20 ${className}`}>
      <header className="mb-8">
        {n !== undefined && (
          <div className="absolute -left-12 top-0 hidden lg:block">
            <ChapterNumber n={n} />
          </div>
        )}
        {eyebrow && (
          <p className="font-gothic text-xs uppercase tracking-[0.25em] text-ink-mute mb-3">
            {eyebrow}
          </p>
        )}
        <h2 className="font-mincho text-3xl sm:text-4xl text-ink leading-tight">{heading}</h2>
        <span aria-hidden="true" className="block h-px w-12 bg-shu mt-5" />
      </header>
      {children}
    </section>
  );
}

/** Body paragraph with InlineMd (`code` and **bold**). */
export function Prose({ children }: { children: string }) {
  return (
    <p className="text-ink leading-[1.95] whitespace-pre-line">
      <InlineMd text={children} />
    </p>
  );
}

export function InlineMd({ text }: { text: string }) {
  // Tokenize: handle **bold** and `code` segments without nesting.
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={i}
              className="font-mono text-[0.88em] px-1.5 py-0.5 bg-ground-deep text-shu-deep dark:text-shu"
              style={{ borderRadius: 2 }}
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={i} className="font-medium text-ink">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/** Hairline-bordered metadata pill in mono (version, license, etc.). */
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 font-mono text-[11px] tracking-wide text-ink-mute"
      style={{ border: "1px solid var(--color-rule)", borderRadius: 1 }}
    >
      {children}
    </span>
  );
}

/** Small vermilion seal-square. Kept understated (single character preferred). */
export function NewBadge({ label = "新" }: { label?: string }) {
  return (
    <span
      className="inline-flex items-center justify-center font-mincho text-[11px] font-bold text-ground bg-shu-deep dark:bg-shu w-5 h-5 select-none"
      style={{ borderRadius: 1, lineHeight: 1 }}
      aria-label="new"
    >
      {label}
    </span>
  );
}

export function SnippetBlock({
  label,
  code,
  language,
}: {
  label: string;
  code: string;
  language: string;
}) {
  return (
    <figure className="mt-5">
      <figcaption className="flex items-baseline justify-between mb-2">
        <span className="font-gothic text-xs uppercase tracking-[0.18em] text-ink-mute">
          {label}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          {language}
        </span>
      </figcaption>
      <pre
        className="bg-ink text-ground font-mono text-[13px] leading-[1.7] py-5 pr-5 pl-6 overflow-x-auto m-0"
        style={{ borderLeft: "2px solid var(--color-shu)" }}
      >
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export interface OptionRow {
  name: string;
  type: string;
  default: string;
  description: string;
}

export function OptionsTable({
  columns,
  rows,
}: {
  columns: { name: string; type: string; default: string; description: string };
  rows: OptionRow[];
}) {
  return (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--color-rule-strong)" }}>
            <Th>{columns.name}</Th>
            <Th>{columns.type}</Th>
            <Th>{columns.default}</Th>
            <Th>{columns.description}</Th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} style={{ borderBottom: "1px solid var(--color-rule)" }}>
              <td className="px-3 py-3 font-mono text-[13px] text-ink whitespace-nowrap align-top">
                {row.name}
              </td>
              <td className="px-3 py-3 font-mono text-[12px] text-ink-mute align-top">
                {row.type}
              </td>
              <td className="px-3 py-3 font-mono text-[12px] text-ink-mute whitespace-nowrap align-top">
                {row.default}
              </td>
              <td className="px-3 py-3 text-ink leading-relaxed align-top">
                <InlineMd text={row.description} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Th({ children }: { children: ReactNode }) {
  return (
    <th className="text-left font-gothic font-medium text-[11px] uppercase tracking-[0.18em] text-ink-mute px-3 py-3">
      {children}
    </th>
  );
}

export function InstallCommands({ pkg }: { pkg: string }) {
  const commands = [
    { manager: "bun", command: `bun add ${pkg}` },
    { manager: "pnpm", command: `pnpm add ${pkg}` },
    { manager: "npm", command: `npm i ${pkg}` },
    { manager: "yarn", command: `yarn add ${pkg}` },
  ];
  return (
    <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mt-5">
      {commands.map(({ manager, command }) => (
        <div key={manager} className="pb-3" style={{ borderBottom: "1px solid var(--color-rule)" }}>
          <p className="font-gothic text-[10px] uppercase tracking-[0.25em] text-ink-mute mb-1.5">
            {manager}
          </p>
          <code className="font-mono text-sm text-ink break-all">{command}</code>
        </div>
      ))}
    </div>
  );
}

/** Adapter switcher: horizontal table-of-contents with shu underline on the active item. */
export function AdapterNav({ current, locale }: { current: AdapterKey; locale: Locale }) {
  return (
    <nav aria-label="tate-chu-yoko packages" className="mb-12">
      <ul className="flex flex-wrap items-stretch text-sm">
        {ADAPTERS.map((a, i) => {
          const active = a.key === current;
          return (
            <li
              key={a.key}
              className="flex items-stretch"
              style={i > 0 ? { borderLeft: "1px solid var(--color-rule)" } : {}}
            >
              <Link
                to={a.href(locale) as `/${string}`}
                className={[
                  "flex items-center gap-2 px-4 py-2 font-mono text-[13px] transition-colors relative",
                  active
                    ? "text-ink font-medium"
                    : "text-ink-mute hover:text-ink dark:hover:text-ink",
                ].join(" ")}
              >
                <span>{a.short}</span>
                {a.isNew && <NewBadge />}
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute left-4 right-4 -bottom-px h-px bg-shu"
                  />
                )}
              </Link>
            </li>
          );
        })}
      </ul>
      <span aria-hidden="true" className="block h-px w-full bg-rule" />
    </nav>
  );
}

/** A vertical-rl Mincho text container — used for hero, demo previews, blog accents. */
export function VerticalSample({
  children,
  height = "16rem",
  fontSize = "1.5rem",
  className = "",
  showTcy = true,
}: {
  children: string;
  height?: string;
  fontSize?: string;
  className?: string;
  showTcy?: boolean;
}) {
  const inner = showTcy ? <Tcy>{children}</Tcy> : children;
  return (
    <div className={`tcy flex justify-center ${className}`} style={{ height }}>
      <p
        className="tcy-vertical text-ink"
        style={{ fontSize, lineHeight: 2.05, padding: "0.5rem 0.25rem" }}
      >
        {inner}
      </p>
    </div>
  );
}

/** CTA link: shu underline-grow on hover. Use for hero CTAs. */
export function Cta({
  to,
  href,
  children,
  variant = "primary",
}: {
  to?: string;
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
}) {
  const cls = [
    "group inline-flex items-center gap-2 px-5 py-3 font-gothic text-[13px] uppercase tracking-[0.18em] transition-colors",
    variant === "primary"
      ? "text-ground bg-ink hover:bg-shu-deep dark:bg-ink dark:text-ground dark:hover:bg-shu"
      : "text-ink hover:text-shu-deep dark:hover:text-shu",
  ].join(" ");
  const inner = (
    <>
      {children}
      <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </>
  );
  if (to) {
    return (
      <Link to={to as `/${string}`} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {inner}
    </a>
  );
}

// —— shared option tables ————————————————————————————————————————

export const SHARED_OPTIONS = {
  ja: [
    {
      name: "target",
      type: "'alphanumeric' | 'alpha' | 'digit' | 'ascii' | RegExp",
      default: "'alphanumeric'",
      description:
        "縦中横対象として扱う文字種。`alphanumeric` は `[0-9A-Za-z]`、`ascii` は印字可能な ASCII 全般。任意の RegExp も指定可能。",
    },
    {
      name: "combine",
      type: "boolean",
      default: "true",
      description:
        "連続した対象文字を1つのスパンにまとめるか。`false` にすると1文字ずつ別々のスパンで包みます。",
    },
    {
      name: "include",
      type: "string | string[]",
      default: "undefined",
      description: "`target` に含まれなくても対象として扱う追加の文字。",
    },
    {
      name: "exclude",
      type: "string | string[]",
      default: "undefined",
      description: "対象から外したい文字。`include` より優先されます。",
    },
    {
      name: "maxLength",
      type: "number",
      default: "undefined",
      description:
        "縦中横セグメントの最大文字数。これを超える長さの英数字 run はプレーンテキストに戻ります。たとえば `maxLength: 2` にすると `2026` のような4桁年は寝かせ、`1` や `19` の短い run のみを縦中横にできます。",
    },
    {
      name: "excludeWords",
      type: "string[]",
      default: "undefined",
      description:
        "縦中横にしたくない語を完全一致で指定（部分一致ではなくセグメント値全体のマッチ）。`URL` `API` のような固有の略号や、特定の年号だけを横倒しのまま残したいときに便利。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "target",
      type: "'alphanumeric' | 'alpha' | 'digit' | 'ascii' | RegExp",
      default: "'alphanumeric'",
      description:
        "What counts as a tate-chu-yoko target. `alphanumeric` matches `[0-9A-Za-z]`; `ascii` covers printable ASCII. A custom RegExp is accepted.",
    },
    {
      name: "combine",
      type: "boolean",
      default: "true",
      description:
        "Merge consecutive target characters into a single span. Set to `false` to wrap each character individually.",
    },
    {
      name: "include",
      type: "string | string[]",
      default: "undefined",
      description: "Extra characters to treat as targets regardless of `target`.",
    },
    {
      name: "exclude",
      type: "string | string[]",
      default: "undefined",
      description: "Characters to exclude. Takes precedence over `include`.",
    },
    {
      name: "maxLength",
      type: "number",
      default: "undefined",
      description:
        "Maximum length for a tcy segment. Runs longer than this are demoted back to plain text — for example `maxLength: 2` keeps single digits and pairs uprighted while leaving four-digit years like `2026` lying on their side.",
    },
    {
      name: "excludeWords",
      type: "string[]",
      default: "undefined",
      description:
        "Exact words to exclude from tcy wrapping. Matched against the whole segment value (not a substring) — useful for keeping acronyms like `URL` / `API` or specific years out of the upright treatment.",
    },
  ] as OptionRow[],
};

export const COMPONENT_OPTIONS = {
  ja: [
    {
      name: "className",
      type: "string",
      default: "'tcy'",
      description: "生成される span に付与するクラス名。",
    },
    {
      name: "as",
      type: "keyof JSX.IntrinsicElements",
      default: "'span'",
      description: "ラップに使用するタグ名。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "className",
      type: "string",
      default: "'tcy'",
      description: "Class applied to each generated span.",
    },
    {
      name: "as",
      type: "keyof JSX.IntrinsicElements",
      default: "'span'",
      description: "Tag name used for wrapping.",
    },
  ] as OptionRow[],
};

export const REHYPE_OPTIONS = {
  ja: [
    {
      name: "tagName",
      type: "string",
      default: "'span'",
      description: "ラップに使用するタグ名。",
    },
    {
      name: "className",
      type: "string | string[]",
      default: "'tcy'",
      description: "ラップ要素に付与するクラス名（配列で複数指定可）。",
    },
    {
      name: "skipTags",
      type: "string[]",
      default: "['code', 'pre', 'script', 'style']",
      description:
        "走査をスキップするタグ。`<code>` `<pre>` などコード表示中のテキストはデフォルトで処理されません。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "tagName",
      type: "string",
      default: "'span'",
      description: "Tag name used for wrapping.",
    },
    {
      name: "className",
      type: "string | string[]",
      default: "'tcy'",
      description:
        "Class name(s) applied to the wrapping element. Pass an array for multiple classes.",
    },
    {
      name: "skipTags",
      type: "string[]",
      default: "['code', 'pre', 'script', 'style']",
      description:
        "Tags whose subtrees are left untouched. Code/pre/script/style content is skipped by default.",
    },
  ] as OptionRow[],
};

export const ASTRO_INTEGRATION_OPTIONS = {
  ja: [
    {
      name: "markdown",
      type: "boolean",
      default: "true",
      description:
        "Markdown / MDX パイプラインに `rehype-tcy` を登録するか。`false` にするとインテグレーションは何もしません（`<Tcy>` コンポーネントだけ使う構成にできます）。",
    },
  ] as OptionRow[],
  en: [
    {
      name: "markdown",
      type: "boolean",
      default: "true",
      description:
        "Whether to register `rehype-tcy` on the Markdown / MDX pipeline. Set to `false` to opt out (e.g. if you only want the `<Tcy>` component).",
    },
  ] as OptionRow[],
};

export const RECOMMENDED_CSS = `.tcy {
  -webkit-text-combine: horizontal;
  text-combine-upright: all;
}`;

export const NPM_BASE = "https://www.npmjs.com/package/";
export const GITHUB_ROOT = "https://github.com/Love-Rox/tate-chu-yoko";

export function npmUrl(pkg: string) {
  return `${NPM_BASE}${pkg}`;
}

export function githubPackageUrl(folder: string) {
  return `${GITHUB_ROOT}/tree/main/packages/${folder}#readme`;
}
