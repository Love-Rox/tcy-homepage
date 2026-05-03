import AdapterPage from "@/components/views/_adapter-page";
import {
  ASTRO_INTEGRATION_OPTIONS,
  InlineMd,
  REHYPE_OPTIONS,
  Section,
  SHARED_OPTIONS,
} from "@/components/tcy/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/astro.json";
import langEn from "@private/lang/pages/en/astro.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/tcy-astro";

const integrationSnippet = `// astro.config.mjs
import { defineConfig } from "astro/config";
import tcy from "@love-rox/tcy-astro";

export default defineConfig({
  integrations: [tcy()],
});`;

const integrationWithOptionsSnippet = `// astro.config.mjs
import { defineConfig } from "astro/config";
import tcy from "@love-rox/tcy-astro";

export default defineConfig({
  integrations: [
    tcy({
      maxLength: 2,
      excludeWords: ["URL", "API", "2026"],
    }),
  ],
});`;

const componentSnippet = `---
import Tcy from "@love-rox/tcy-astro/Tcy.astro";
---

<p style="writing-mode: vertical-rl">
  <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
</p>`;

export default async function AstroView({ locale }: { locale: Locale }) {
  const content = data[locale];

  // Astro is the only adapter with a "two pieces" intermezzo (integration vs
  // standalone component). Render it inline as the extraSection prop.
  const twoPieces = (
    <Section n={2} eyebrow="Pieces" heading={content.twoPieces.heading}>
      <div className="grid sm:grid-cols-2 gap-x-8 gap-y-6 mt-2">
        {content.twoPieces.items.map((piece: { name: string; description: string }) => (
          <div
            key={piece.name}
            className="pt-4"
            style={{ borderTop: "1px solid var(--color-rule)" }}
          >
            <p className="font-mono text-sm text-ink mb-2 break-all">{piece.name}</p>
            <p className="text-sm text-ink-mute leading-relaxed">
              <InlineMd text={piece.description} />
            </p>
          </div>
        ))}
      </div>
    </Section>
  );

  // shared options + rehype passthrough live in one combined table for Astro,
  // and integration-specific options live in their own.
  const sharedAndRehype = [...SHARED_OPTIONS[locale], ...REHYPE_OPTIONS[locale]];

  return (
    <AdapterPage
      locale={locale}
      adapterKey="astro"
      pkg={PKG}
      ghFolder="astro"
      thirdBadge="astro >= 4"
      content={content}
      landing={landing[locale]}
      extraSection={twoPieces}
      usage={[
        {
          label: content.usage.integrationLabel,
          language: "ts",
          code: integrationSnippet,
        },
        {
          heading: content.usage.withOptionsHeading,
          description: content.usage.withOptionsDescription,
          label: content.usage.withOptionsLabel,
          language: "ts",
          code: integrationWithOptionsSnippet,
        },
        {
          heading: content.usage.componentHeading,
          description: content.usage.componentDescription,
          label: content.usage.componentLabel,
          language: "astro",
          code: componentSnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: sharedAndRehype },
        { label: content.options.integrationLabel, rows: ASTRO_INTEGRATION_OPTIONS[locale] },
      ]}
    />
  );
}
