import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { Tcy } from "@love-rox/tcy-react";
import {
  ADAPTERS,
  Badge,
  InlineMd,
  NewBadge,
  Prose,
  RECOMMENDED_CSS,
  Section,
  SnippetBlock,
} from "@/components/tcy/shared";
import { localePath, type Locale } from "@/lib/locale";
import langJa from "@private/lang/pages/ja/index.json";
import langEn from "@private/lang/pages/en/index.json";

const data = { en: langEn, ja: langJa };

const NPM_URL = "https://www.npmjs.com/package/@love-rox/tcy-core";
const GITHUB_URL = "https://github.com/Love-Rox/tate-chu-yoko";
const PREVIEW_SAMPLE = "第1章 2026年4月、Webの縦書きは進化した。";

export default async function LandingView({ locale }: { locale: Locale }) {
  const content = data[locale];
  const url = localePath(locale, "");
  const demoUrl = localePath(locale, "demo");

  const items = content.family.items;
  const coreItem = items.core;
  const adapterItems = [items.react, items.vue, items.rehype, items.astro];
  const adapterMap = ADAPTERS.reduce<Record<string, (typeof ADAPTERS)[number]>>(
    (acc, a) => ({ ...acc, [a.key]: a }),
    {},
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={`${content.hero.heading} - ${content.hero.eyebrow}`}
        description={content.hero.tagline}
        image={`/api/og?title=${encodeURIComponent(content.hero.heading)}&eyebrow=${encodeURIComponent(content.hero.eyebrow)}`}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems([{ label: content.hero.heading, href: url }], locale)}
      />
      <Breadcrumbs items={[{ label: content.hero.heading }]} lang={locale} />

      <div className="max-w-5xl mx-auto">
        <section className="mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">
            {content.hero.eyebrow}
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-slate-100 mb-5 font-mono">
            {content.hero.heading}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
            {content.hero.tagline}
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            <Badge>{content.hero.badges.version}</Badge>
            <Badge>{content.hero.badges.license}</Badge>
            <Badge>{content.hero.badges.ssr}</Badge>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={demoUrl}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
            >
              {content.hero.ctaDemo}
            </Link>
            <a
              href={NPM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              {content.hero.ctaNpm}
            </a>
            <a
              href={GITHUB_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 font-semibold transition-colors"
            >
              {content.hero.ctaGithub}
            </a>
          </div>
        </section>

        <section className="mb-16">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-8">
            <style>{`
              .tcy-preview-scope .tcy {
                -webkit-text-combine: horizontal;
                text-combine-upright: all;
              }
              .tcy-preview-vertical {
                writing-mode: vertical-rl;
                font-size: 1.75rem;
                line-height: 2;
                height: 18rem;
                font-family: "Noto Serif JP", "Yu Mincho", serif;
              }
            `}</style>
            <div className="tcy-preview-scope flex justify-center">
              <p className="tcy-preview-vertical text-slate-900 dark:text-slate-100">
                <Tcy>{PREVIEW_SAMPLE}</Tcy>
              </p>
            </div>
          </div>
        </section>

        <Section heading={content.problem.heading}>
          <Prose>{content.problem.body}</Prose>
        </Section>

        <Section heading={content.family.heading}>
          <Prose>{content.family.description}</Prose>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {content.family.coreLabel}
            </p>
            <Link
              to={adapterMap.core.href(locale)}
              className="block rounded-xl border-2 border-primary-200 dark:border-primary-800 bg-gradient-to-br from-primary-50 to-white dark:from-primary-950 dark:to-slate-900 p-6 hover:border-primary-400 dark:hover:border-primary-500 transition-colors"
            >
              <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                <p className="font-mono text-base text-primary-700 dark:text-primary-300 break-all">
                  {coreItem.name}
                </p>
                <Badge>{coreItem.version}</Badge>
              </div>
              <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-2">
                {coreItem.role}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                <InlineMd text={coreItem.description} />
              </p>
            </Link>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
              {content.family.adaptersLabel}
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {adapterItems.map((pkg) => {
                const meta = adapterMap[asAdapterKey(pkg.name)];
                return (
                  <Link
                    key={pkg.name}
                    to={meta.href(locale)}
                    className="group block rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-5 hover:border-primary-400 dark:hover:border-primary-500 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2 flex-wrap">
                      <p className="font-mono text-sm text-primary-700 dark:text-primary-300 break-all">
                        {pkg.name}
                      </p>
                      {pkg.isNew ? <NewBadge /> : null}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      {pkg.role}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">
                      <InlineMd text={pkg.description} />
                    </p>
                    <div className="flex items-center justify-between text-xs">
                      {pkg.tagline ? (
                        <span className="text-slate-500 dark:text-slate-400 italic">
                          {pkg.tagline}
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                        {content.family.viewLabel} →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </Section>

        <Section heading={content.shared.heading}>
          <Prose>{content.shared.description}</Prose>
          <SnippetBlock label="CSS" code={RECOMMENDED_CSS} language="css" />
        </Section>

        <Section heading={content.behavior.heading}>
          <ul className="space-y-2 list-disc list-inside text-slate-700 dark:text-slate-300">
            {content.behavior.items.map((item, i) => (
              <li key={i} className="leading-relaxed">
                <InlineMd text={item} />
              </li>
            ))}
          </ul>
        </Section>

        <Section heading={content.browser.heading}>
          <Prose>{content.browser.body}</Prose>
        </Section>

        <Section heading={content.versioning.heading}>
          <Prose>{content.versioning.body}</Prose>
        </Section>

        <Section heading={content.license.heading}>
          <Prose>{content.license.body}</Prose>
        </Section>

        <section className="mt-16 mb-8 rounded-xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-950 p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            {content.cta.heading}
          </h2>
          <p className="text-slate-700 dark:text-slate-300 mb-5">
            <InlineMd text={content.cta.body} />
          </p>
          <Link
            to={demoUrl}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors"
          >
            {content.cta.button}
          </Link>
        </section>
      </div>
    </div>
  );
}

function asAdapterKey(name: string): "react" | "vue" | "rehype" | "astro" {
  if (name.endsWith("-react")) return "react";
  if (name.endsWith("-vue")) return "vue";
  if (name.endsWith("-rehype")) return "rehype";
  return "astro";
}
