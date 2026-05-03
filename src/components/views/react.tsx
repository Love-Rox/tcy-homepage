import AdapterPage from "@/components/views/_adapter-page";
import { COMPONENT_OPTIONS, SHARED_OPTIONS } from "@/components/tcy/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/react.json";
import langEn from "@private/lang/pages/en/react.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/tcy-react";

const reactSnippet = `import { Tcy } from "@love-rox/tcy-react";

export function Chapter() {
  return (
    <p style={{ writingMode: "vertical-rl" }}>
      <Tcy>第1章 2026年4月、Webの縦書きは進化した。</Tcy>
    </p>
  );
}`;

export default async function ReactView({ locale }: { locale: Locale }) {
  const content = data[locale];
  return (
    <AdapterPage
      locale={locale}
      adapterKey="react"
      pkg={PKG}
      ghFolder="react"
      thirdBadge="SSR-safe"
      content={content}
      landing={landing[locale]}
      usage={[
        {
          label: content.usage.snippetLabel,
          language: "tsx",
          code: reactSnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: SHARED_OPTIONS[locale] },
        { label: content.options.componentLabel, rows: COMPONENT_OPTIONS[locale] },
      ]}
    />
  );
}
