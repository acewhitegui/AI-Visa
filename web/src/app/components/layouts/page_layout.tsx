import React from "react";
import {Page, PromsPros} from "@/app/library/objects/props";
import type {Metadata} from "next";
import {BLOG_SLUG, FALLBACK_SEO, HOST, LOGO_URL, SITE_NAME} from "@/app/library/common/constants";
import {getAlternate} from "@/app/library/common/i18n-helpers";
import {routing} from "@/i18n/routing";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/breadcrumb"
import {getPageBySlug} from "@/app/library/services/page_service";

export async function PageLayout({
                                   params,
                                   children,
                                   slug
                                 }: {
  params: PromsPros;
  children: React.ReactNode;
  slug: string;
}) {
  const {locale} = await params;
  const page: Page = await getPageBySlug(locale, slug);
  const {seo} = page;

  return (
    <>
      <Breadcrumb className="container mx-auto py-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`} title="Any Converters Homepage">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/pages/${slug}`} title={page.title}>{page.title}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
        <script type="application/ld+json">
          {
            JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": `${HOST}/${locale}`
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": page.title,
                  "item": `${HOST}/${locale}/pages/${slug}`
                },
              ]
            })
          }
        </script>
      </Breadcrumb>
      {children}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Blog",
          "name": seo?.metaTitle || page.title,
          "description": seo?.metaDescription || page.description,
          "url": `${HOST}/pages/${BLOG_SLUG}`,
          "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
              "@type": "ImageObject",
              "url": `${HOST}/img/logo.svg`
            }
          },
          "isPartOf": {
            "@type": "WebSite",
            "url": HOST,
            "name": SITE_NAME
          }
        })}
      </script>
    </>
  )
}

export function generatePageStaticParams() {
  return routing.locales.map((locale: any) => ({locale}));
}

export async function generatePageMetadata({
                                             params,
                                             slug
                                           }: {
  params: PromsPros;
  slug: string;
}): Promise<Metadata> {
  const {locale} = await params;

  const page: Page = await getPageBySlug(locale, slug);
  if (!page) return FALLBACK_SEO;

  const baseUrl = `/pages/${slug}`

  const {seo} = page

  const metaTitle = seo?.metaTitle || FALLBACK_SEO.title;
  const metaDesc = seo?.metaDescription || FALLBACK_SEO.description;
  const openGraph = {
    title: metaTitle,
    description: metaDesc,
    images: [LOGO_URL],
    url: `${HOST}/${locale}${baseUrl}`,
    type: 'website',
  };

  return {
    metadataBase: new URL(HOST),
    title: metaTitle,
    description: metaDesc,
    alternates: getAlternate(baseUrl),
    openGraph: openGraph,
    twitter: {
      site: '@anyconverters',
      ...openGraph
    },
  };
}
