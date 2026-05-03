import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { DemoPlayground } from "@/components/tcy/demo-playground";
import { localePath, type Locale } from "@/lib/locale";

const copy = {
  en: {
    packageLabel: "tate-chu-yoko",
    demoLabel: "Demo",
    eyebrow: "Interactive demo",
    heading: "Set the controls. Read the spread.",
    description:
      "Two vertical pages, side by side. The left is plain. The right is wrapped by <Tcy>. Adjust the controls below and watch the right page reflow in real time.",
    backToPackage: "← Back to overview",
    metaTitle: "tate-chu-yoko — interactive demo",
  },
  ja: {
    packageLabel: "tate-chu-yoko",
    demoLabel: "デモ",
    eyebrow: "インタラクティブ・デモ",
    heading: "操作盤を動かして、見開きを読む。",
    description:
      "縦組みの頁を 2 つ、左に素のまま、右に <Tcy> で包んだ姿で並べました。下の操作盤を動かすと、右の頁が即時に組み直されます。",
    backToPackage: "← パッケージ紹介に戻る",
    metaTitle: "tate-chu-yoko — インタラクティブ・デモ",
  },
} as const;

export default async function DemoView({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const url = localePath(locale, "demo");
  const packageUrl = localePath(locale, "");

  return (
    <div className="relative">
      <Meta
        title={content.metaTitle}
        description={content.description.replace(/<\/?[^>]+>/g, "")}
        image={`/api/og?title=${encodeURIComponent(content.metaTitle)}&eyebrow=${encodeURIComponent(content.packageLabel + " · " + content.demoLabel)}`}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [
            { label: content.packageLabel, href: packageUrl },
            { label: content.demoLabel, href: url },
          ],
          locale,
        )}
      />

      <div className="px-6 lg:px-12 max-w-6xl mx-auto pt-10 lg:pt-14">
        <Breadcrumbs
          items={[{ label: content.packageLabel, href: packageUrl }, { label: content.demoLabel }]}
          lang={locale}
        />
      </div>

      <div className="px-6 lg:px-12 pl-6 lg:pl-20 max-w-6xl mx-auto pb-24">
        <header className="mb-14 wa-fade-up" style={{ animationDelay: "120ms" }}>
          <p className="font-gothic text-[11px] uppercase tracking-[0.3em] text-shu-deep dark:text-shu mb-5">
            {content.eyebrow}
          </p>
          <h1 className="font-mincho text-[2.25rem] sm:text-[3rem] lg:text-[3.5rem] leading-[1.1] text-ink mb-6 max-w-3xl">
            {content.heading}
          </h1>
          <p className="font-gothic text-base text-ink-mute leading-[1.85] max-w-2xl">
            {content.description}
          </p>
          <span aria-hidden="true" className="block h-px w-12 bg-shu mt-8" />
        </header>

        <DemoPlayground lang={locale} />

        <div className="mt-16 pt-10" style={{ borderTop: "1px solid var(--color-rule)" }}>
          <Link
            to={packageUrl as `/${string}`}
            className="font-gothic text-sm text-ink-mute hover:text-shu-deep dark:hover:text-shu transition-colors underline decoration-rule decoration-from-font underline-offset-4"
          >
            {content.backToPackage}
          </Link>
        </div>
      </div>
    </div>
  );
}
