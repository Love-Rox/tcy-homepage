import { localePath, type Locale } from "@/lib/locale";
import footerEn from "@private/lang/components/global/en/footer.json";
import footerJa from "@private/lang/components/global/ja/footer.json";

const data = { en: footerEn, ja: footerJa };

export const Footer = ({ lang = "ja" }: { lang?: Locale }) => {
  const content = data[lang];
  const link = (suffix: string) => localePath(lang, suffix);

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <p className="font-mono text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
              tate-chu-yoko
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {content.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {content.sections.packages}
            </h3>
            <ul className="space-y-2">
              {(["", "react", "vue", "rehype", "astro"] as const).map((slug) => (
                <li key={slug || "core"}>
                  <a
                    href={link(slug)}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 font-mono"
                  >
                    {slug ? `tcy-${slug}` : "tcy-core"}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">
              {content.sections.community}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={link("demo")}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {content.links.demo}
                </a>
              </li>
              <li>
                <a
                  href={link("blog")}
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {content.links.blog}
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/Love-Rox/tate-chu-yoko"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://love-rox.cc"
                  className="text-sm text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                >
                  {content.links.rox}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">{content.copyright}</p>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {content.builtWith}{" "}
            <a
              href="https://waku.gg"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Waku
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
