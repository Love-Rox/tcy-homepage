import { Link } from "waku";
import { localePath, type Locale } from "@/lib/locale";

interface BlogPostProps {
  content: string;
  date: string;
  updatedDate?: string | undefined;
  author: string;
  lang: Locale;
  backLabel: string;
}

export const BlogPost = ({
  content,
  date,
  updatedDate,
  author,
  lang,
  backLabel,
}: BlogPostProps) => {
  return (
    <article className="max-w-3xl mx-auto">
      <Link
        to={localePath(lang, "blog")}
        className="inline-flex items-center text-primary-600 dark:text-primary-400 hover:underline mb-8"
      >
        {backLabel}
      </Link>

      <header className="mb-8">
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
          <time dateTime={date}>{date}</time>
          {updatedDate && (
            <span className="flex items-center gap-1">
              <span>•</span>
              <span>{lang === "ja" ? "更新:" : "Updated:"}</span>
              <time dateTime={updatedDate}>{updatedDate}</time>
            </span>
          )}
        </div>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          {lang === "ja" ? `著者: ${author}` : `By ${author}`}
        </p>
      </header>

      <div
        className="prose prose-slate dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </article>
  );
};
