import AdapterPage from "@/components/views/_adapter-page";
import { REHYPE_OPTIONS, SHARED_OPTIONS } from "@/components/tcy/shared";
import type { Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/rehype.json";
import langEn from "@private/lang/pages/en/rehype.json";
import landingJa from "@private/lang/pages/ja/index.json";
import landingEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };
const landing = { en: landingEn, ja: landingJa };

const PKG = "@love-rox/tcy-rehype";

const markdownSnippet = `import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("第1章 2026年4月"),
);
// <p>第<span class="tcy">1</span>章 <span class="tcy">2026</span>年<span class="tcy">4</span>月</p>`;

const htmlOnlySnippet = `import { unified } from "unified";
import rehypeParse from "rehype-parse";
import rehypeStringify from "rehype-stringify";
import rehypeTcy from "@love-rox/tcy-rehype";

const html = String(
  await unified()
    .use(rehypeParse, { fragment: true })
    .use(rehypeTcy)
    .use(rehypeStringify)
    .process("<p>第1章 2026年4月</p>"),
);`;

export default async function RehypeView({ locale }: { locale: Locale }) {
  const content = data[locale];
  return (
    <AdapterPage
      locale={locale}
      adapterKey="rehype"
      pkg={PKG}
      ghFolder="rehype"
      thirdBadge="build-time"
      content={content}
      landing={landing[locale]}
      usage={[
        { label: content.usage.snippetLabel, language: "ts", code: markdownSnippet },
        {
          heading: content.usage.htmlOnlyHeading,
          description: content.usage.htmlOnlyDescription,
          label: content.usage.htmlOnlyLabel,
          language: "ts",
          code: htmlOnlySnippet,
        },
      ]}
      optionGroups={[
        { label: content.options.sharedLabel, rows: SHARED_OPTIONS[locale] },
        { label: content.options.pluginLabel, rows: REHYPE_OPTIONS[locale] },
      ]}
    />
  );
}
