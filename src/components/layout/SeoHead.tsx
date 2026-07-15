import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getBlogPostBySlug } from "../../data/usjetBlog";
import {
  buildArticleJsonLd,
  buildProductJsonLd,
  buildWebsiteJsonLd,
  canonicalHref,
  DEFAULT_PAGE_SEO,
  normalizeSeoPath,
  resolveStaticRouteSeo,
  type PageSeo,
} from "../../data/siteSeo";
import { getFleetDirectoryEntryBySlug } from "../../data/fleetDirectorySeo";

const PAGE_JSON_LD_ID = "usjet-page-jsonld";
const WEBSITE_JSON_LD_ID = "usjet-website-jsonld";

function upsertMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("name", name);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute("property", property);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertCanonical(href: string) {
  let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

function upsertJsonLd(id: string, data: Record<string, unknown> | Record<string, unknown>[]) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data);
}

function resolveDynamicSeo(pathname: string): PageSeo | null {
  const path = normalizeSeoPath(pathname);

  const blogMatch = path.match(/^\/blog\/([^/]+)$/);
  if (blogMatch) {
    const post = getBlogPostBySlug(blogMatch[1]);
    if (!post) {
      return {
        title: "Dispatch not found · USJET Blog",
        description: DEFAULT_PAGE_SEO.description,
        noindex: true,
      };
    }
    const url = canonicalHref(path);
    return {
      title: `${post.title} · USJET Blog`,
      description: post.excerpt,
      keywords: `USJET blog, ${post.title}, Ameer Karim, operator log`,
      ogType: "article",
      jsonLd: buildArticleJsonLd({
        title: post.title,
        description: post.excerpt,
        url,
        datePublished: post.publishedAt,
      }),
    };
  }

  const jetMatch = path.match(/^\/fleet-directory\/([^/]+)$/);
  if (jetMatch) {
    const entry = getFleetDirectoryEntryBySlug(jetMatch[1]);
    if (!entry) {
      return {
        title: "Jet Fighter call sign not found | USJET",
        description: DEFAULT_PAGE_SEO.description,
        noindex: true,
      };
    }
    const url = canonicalHref(path);
    return {
      title: entry.seoTitle.replace(" | USJET Jet Fighter", " | USJET"),
      description: entry.seoDescription,
      keywords: entry.keywords.join(", "),
      ogType: "website",
      jsonLd: buildProductJsonLd({
        name: `${entry.callsign} · ${entry.name}`,
        description: entry.seoDescription,
        url,
      }),
    };
  }

  const productMatch = path.match(/^\/product\/([^/]+)$/);
  if (productMatch) {
    const entry = getFleetDirectoryEntryBySlug(productMatch[1]);
    if (!entry) {
      return {
        title: "Product page not found | USJET",
        description: DEFAULT_PAGE_SEO.description,
        noindex: true,
      };
    }
    const url = canonicalHref(path);
    return {
      title: `${entry.name} Product · ${entry.aircraftOfficialName} | USJET`,
      description: entry.seoDescription,
      keywords: entry.keywords.join(", "),
      ogType: "product",
      jsonLd: buildProductJsonLd({
        name: `${entry.name} · ${entry.aircraftOfficialName}`,
        description: entry.seoDescription,
        url,
      }),
    };
  }

  return null;
}

function applyPageSeo(pathname: string) {
  const href = canonicalHref(pathname);
  const dynamic = resolveDynamicSeo(pathname);
  const seo: PageSeo = {
    ...DEFAULT_PAGE_SEO,
    ...(dynamic ?? resolveStaticRouteSeo(pathname)),
  };

  document.title = seo.title;
  upsertMetaByName("description", seo.description);
  if (seo.keywords) {
    upsertMetaByName("keywords", seo.keywords);
  }
  upsertMetaByName(
    "robots",
    seo.noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  );

  upsertCanonical(href);

  upsertMetaByProperty("og:type", seo.ogType ?? "website");
  upsertMetaByProperty("og:site_name", "USJET.AI");
  upsertMetaByProperty("og:url", href);
  upsertMetaByProperty("og:title", seo.title);
  upsertMetaByProperty("og:description", seo.description);
  upsertMetaByProperty("og:image", seo.ogImage ?? DEFAULT_PAGE_SEO.ogImage!);
  upsertMetaByProperty("og:image:alt", seo.ogImageAlt ?? DEFAULT_PAGE_SEO.ogImageAlt!);

  upsertMetaByName("twitter:card", "summary_large_image");
  upsertMetaByName("twitter:title", seo.title);
  upsertMetaByName("twitter:description", seo.description);
  upsertMetaByName("twitter:image", seo.ogImage ?? DEFAULT_PAGE_SEO.ogImage!);
  upsertMetaByName("twitter:image:alt", seo.ogImageAlt ?? DEFAULT_PAGE_SEO.ogImageAlt!);

  upsertJsonLd(WEBSITE_JSON_LD_ID, buildWebsiteJsonLd());
  if (seo.jsonLd) {
    upsertJsonLd(PAGE_JSON_LD_ID, seo.jsonLd);
  } else {
    document.getElementById(PAGE_JSON_LD_ID)?.remove();
  }
}

/**
 * Site-wide SEO controller: canonical, title, description, Open Graph, Twitter,
 * robots, and JSON-LD on every route change — including blog / fleet / product pages.
 */
export default function SeoHead() {
  const location = useLocation();

  useEffect(() => {
    applyPageSeo(location.pathname);
  }, [location.pathname]);

  return null;
}
