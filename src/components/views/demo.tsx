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
    heading: "tate-chu-yoko — Interactive demo",
    description:
      "Tweak the options and watch the vertical text rerender. The raw side shows what you get without the library; the uprighted side shows the same text wrapped by <Tcy>.",
    backToPackage: "← Back to package overview",
    metaTitle: "tate-chu-yoko demo",
  },
  ja: {
    packageLabel: "tate-chu-yoko",
    demoLabel: "デモ",
    heading: "tate-chu-yoko — インタラクティブデモ",
    description:
      "オプションを変えると縦組みのプレビューがその場で更新されます。左は未処理、右は <Tcy> で包んだ出力です。",
    backToPackage: "← パッケージ紹介に戻る",
    metaTitle: "tate-chu-yoko デモ",
  },
} as const;

export default async function DemoView({ locale }: { locale: Locale }) {
  const content = copy[locale];
  const url = localePath(locale, "demo");
  const packageUrl = localePath(locale, "");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={content.metaTitle}
        description={content.description}
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
      <Breadcrumbs
        items={[{ label: content.packageLabel, href: packageUrl }, { label: content.demoLabel }]}
        lang={locale}
      />

      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 mb-3">
            {content.heading}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {content.description}
          </p>
        </div>

        <DemoPlayground lang={locale} />

        <div className="mt-10">
          <Link to={packageUrl} className="text-primary-600 dark:text-primary-400 hover:underline">
            {content.backToPackage}
          </Link>
        </div>
      </div>
    </div>
  );
}
