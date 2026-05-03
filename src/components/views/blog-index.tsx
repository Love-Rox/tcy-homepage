import { Link } from "waku";
import { Meta } from "@/components/global/meta";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { BreadcrumbSchema } from "@/components/seo/structured-data";
import { getAllSlugs, loadMarkdownBySlug } from "@/lib/markdown-loader";
import { localePath, type Locale } from "@/lib/locale";

const indexCopy = {
  en: {
    title: "Blog",
    description: "Releases, design notes, and updates from the tate-chu-yoko packages.",
    by: "By",
  },
  ja: {
    title: "ブログ",
    description: "tate-chu-yoko パッケージのリリース・設計メモ・アップデート。",
    by: "著者:",
  },
} as const;

export default async function BlogIndexView({ locale }: { locale: Locale }) {
  const indexData = indexCopy[locale];
  const slugs = await getAllSlugs("blog", locale);

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const content = await loadMarkdownBySlug("blog", slug, locale);
      return content
        ? {
            slug,
            title: content.metadata.title,
            excerpt: content.metadata.excerpt || content.metadata.description || "",
            date: content.metadata.date || "",
            author: content.metadata.author || "Love-Rox",
          }
        : null;
    }),
  );

  const now = new Date();
  const validPosts = posts
    .filter((post): post is NonNullable<typeof post> => post !== null)
    .filter((post) => {
      if (!post.date) return true;
      const d = new Date(`${post.date}T00:00:00+09:00`);
      if (isNaN(d.getTime())) return true;
      return d <= now;
    });
  const sortedPosts = validPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={indexData.title}
        description={indexData.description}
        image={`/api/og?title=${encodeURIComponent(indexData.title)}`}
        url={localePath(locale, "blog")}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [{ label: indexData.title, href: localePath(locale, "blog") }],
          locale,
        )}
      />

      <Breadcrumbs items={[{ label: indexData.title }]} lang={locale} />

      <header className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {indexData.title}
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-300">{indexData.description}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {sortedPosts.map((post) => (
          <Link
            key={post.slug}
            to={localePath(locale, `blog/${post.slug}`)}
            className="block bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md hover:shadow-xl transition-all border border-slate-200 dark:border-slate-700 group hover:border-primary-500 dark:hover:border-primary-400"
          >
            <time className="text-sm text-slate-500 dark:text-slate-400">
              {new Date(post.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-2 mb-3 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
              {post.title}
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mb-4">{post.excerpt}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {indexData.by} {post.author}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
