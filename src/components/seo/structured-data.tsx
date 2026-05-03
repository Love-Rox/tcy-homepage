import type { Locale } from "@/lib/locale";

const SITE_URL = "https://tcy.love-rox.cc";
const SITE_NAME = "tate-chu-yoko";

export const WebSiteSchema = ({ lang }: { lang: Locale }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "tate-chu-yoko packages by Love-Rox",
    url: SITE_URL,
    inLanguage: lang,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const OrganizationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Love-Rox",
    url: "https://love-rox.cc",
    sameAs: ["https://github.com/Love-Rox"],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export const SoftwareApplicationSchema = () => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE_NAME,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Cross-platform (npm)",
    description:
      "tate-chu-yoko: utilities and framework adapters for Japanese vertical typography on the web (text-combine-upright).",
    url: SITE_URL,
    author: { "@type": "Organization", name: "Love-Rox" },
    license: "https://opensource.org/licenses/MIT",
    programmingLanguage: "TypeScript",
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface BreadcrumbItem {
  name: string;
  url: string;
}

export const BreadcrumbSchema = ({ items }: { items: BreadcrumbItem[] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

interface ArticleSchemaProps {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}

export const ArticleSchema = ({
  title,
  description,
  url,
  image,
  datePublished,
  dateModified,
  author = "Love-Rox",
}: ArticleSchemaProps) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    url: url.startsWith("http") ? url : `${SITE_URL}${url}`,
    ...(image ? { image: image.startsWith("http") ? image : `${SITE_URL}${image}` } : {}),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    author: { "@type": "Organization", name: author },
    publisher: { "@type": "Organization", name: "Love-Rox" },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
