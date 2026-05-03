import { Meta } from "@/components/global/meta";
import { loadMarkdownBySlug } from "@/lib/markdown-loader";
import { BlogPost } from "@/components/blog/blog-post";
import { Breadcrumbs, generateBreadcrumbItems } from "@/components/common/breadcrumbs";
import { ArticleSchema, BreadcrumbSchema } from "@/components/seo/structured-data";
import { localePath, type Locale } from "@/lib/locale";

const indexCopy = {
  en: { title: "Blog", backToList: "← Back to all posts" },
  ja: { title: "ブログ", backToList: "← 一覧に戻る" },
} as const;

export default async function BlogPostView({ locale, slug }: { locale: Locale; slug: string }) {
  const indexData = indexCopy[locale];
  const content = await loadMarkdownBySlug("blog", slug, locale);
  const url = localePath(locale, `blog/${slug}`);

  if (!content) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
        <Meta
          title={`Not Found - ${indexData.title}`}
          description="The requested blog post could not be found."
          url={url}
          lang={locale}
        />
        <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          {locale === "ja" ? "記事が見つかりません" : "Post not found"}
        </h1>
      </div>
    );
  }

  const ogParams = new URLSearchParams({ title: content.metadata.title });
  ogParams.set("eyebrow", `${indexData.title} · ${locale.toUpperCase()}`);
  if (content.metadata.author) ogParams.set("author", content.metadata.author);
  const ogUrl = `/api/og?${ogParams.toString()}`;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 pt-24">
      <Meta
        title={`${content.metadata.title} - ${indexData.title}`}
        description={content.metadata.excerpt || content.metadata.description}
        image={ogUrl}
        url={url}
        lang={locale}
      />
      <BreadcrumbSchema
        items={generateBreadcrumbItems(
          [
            { label: indexData.title, href: localePath(locale, "blog") },
            { label: content.metadata.title, href: url },
          ],
          locale,
        )}
      />
      <ArticleSchema
        title={content.metadata.title}
        description={content.metadata.excerpt || content.metadata.description || ""}
        url={url}
        image={ogUrl}
        {...(content.metadata.date && { datePublished: content.metadata.date })}
        {...(content.metadata.updated && { dateModified: content.metadata.updated })}
        author={content.metadata.author || "Love-Rox"}
      />

      <Breadcrumbs
        items={[
          { label: indexData.title, href: localePath(locale, "blog") },
          { label: content.metadata.title },
        ]}
        lang={locale}
      />

      <BlogPost
        content={content.html}
        date={
          content.metadata.date
            ? new Date(content.metadata.date).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : ""
        }
        updatedDate={
          content.metadata.updated
            ? new Date(content.metadata.updated).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : undefined
        }
        author={content.metadata.author || "Love-Rox"}
        lang={locale}
        backLabel={indexData.backToList}
      />
    </div>
  );
}
