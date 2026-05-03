import "@/styles.css";

import type { ReactNode } from "react";
import { unstable_getContext } from "waku/server";
import { Footer } from "@/components/global/footer";
import { Header } from "@/components/global/header";
import {
  WebSiteSchema,
  OrganizationSchema,
  SoftwareApplicationSchema,
} from "@/components/seo/structured-data";
import { detectLocale } from "@/lib/locale";
import navJa from "@private/lang/components/global/ja/nav.json";
import navEn from "@private/lang/components/global/en/nav.json";

const navData = { ja: navJa, en: navEn };

const description = {
  ja: "Webの縦書きに、縦中横の手触りを。@love-rox/tcy-* パッケージファミリーの公式サイト。",
  en: "tate-chu-yoko: utilities and framework adapters for Japanese vertical typography on the web. Official site for the @love-rox/tcy-* package family.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const ctx = unstable_getContext() as { req?: { url?: string } } | undefined;
  const url = ctx?.req?.url ?? "/";
  const pathname = (() => {
    try {
      return new URL(url, "https://tcy.love-rox.cc").pathname;
    } catch {
      return "/";
    }
  })();
  const lang = detectLocale(pathname);
  const navItems = navData[lang].items;

  return (
    <html lang={lang}>
      <head>
        <meta name="description" content={description[lang]} />
        <link rel="icon" type="image/png" href="/images/favicon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <WebSiteSchema lang={lang} />
        <OrganizationSchema />
        <SoftwareApplicationSchema />
      </head>
      <body>
        <div className="font-m-plus-rounded-1c bg-primary-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 min-h-screen flex flex-col">
          <Header lang={lang} navItems={navItems} />
          <main className="*:min-h-64 lg:min-h-svh flex-1">{children}</main>
          <Footer lang={lang} />
        </div>
      </body>
    </html>
  );
}

export const getConfig = async () => {
  return { render: "dynamic" } as const;
};
