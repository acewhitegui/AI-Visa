import React from "react";
import {ArticlePromsPros, ArticleProps} from "@/app/library/objects/props";
import {Metadata} from "next";
import {getArticleBySlug} from "@/app/library/services/article-service";
import {BLOG_SLUG, FALLBACK_SEO, HOST, LOGO_URL, SITE_NAME} from "@/app/library/common/constants";
import {getAlternate} from "@/app/library/common/i18n-helpers";
import {fetchAPI} from "@/app/library/common/fetch-api";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/app/components/ui/shadcn/breadcrumb";
import {getPageBySlug} from "@/app/library/services/page_service";
import {Article, Page} from "@/app/library/objects/types";

export default async function layout({params, children}: { params: ArticlePromsPros; children: React.ReactNode }) {
  const {locale, slug} = await params;
  const article: Article = await getArticleBySlug(locale, slug);
  if (!article) return FALLBACK_SEO;

  const articlesPage: Page = await getPageBySlug(locale, BLOG_SLUG)

  const {seo} = article

  return (
    <>
      <Breadcrumb className="container mx-auto py-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`} title="Any Converters Homepage">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/pages/${BLOG_SLUG}`}
                            title={articlesPage.title}>{articlesPage.title}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/articles/${slug}`} title={article.title}>{article.title}</BreadcrumbLink>
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
                  "name": articlesPage.title,
                  "item": `${HOST}/${locale}/pages/${BLOG_SLUG}`
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": article.title,
                  "item": `${HOST}/${locale}/articles/${slug}`
                }
              ]
            })
          }
        </script>
      </Breadcrumb>
      <div>{children}</div>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": seo?.metaTitle || article.title,
          "description": seo?.metaDescription || article.description,
          "url": `${HOST}/articles/${slug}`,
          "datePublished": article.publishedAt,
          "dateModified": article.updatedAt,
          "author": {
            "@type": "Person",
            "name": article.author?.name || "Anonymous"
          },
          "publisher": {
            "@type": "Organization",
            "name": SITE_NAME,
            "logo": {
              "@type": "ImageObject",
              "url": `${HOST}/img/logo.svg`
            }
          },
          "image": article.cover?.url,
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${HOST}/articles/${slug}`
          }
        })}
      </script>
    </>
  )
}

export async function generateMetadata({params}: ArticleProps): Promise<Metadata> {
  const {locale, slug} = await params;

  const article: Article = await getArticleBySlug(locale, slug);
  if (!article) return FALLBACK_SEO;

  const {seo} = article

  const metaTitle = seo?.metaTitle || FALLBACK_SEO.title;
  const metaDesc = seo?.metaDescription || FALLBACK_SEO.description;

  const baseUrl = `/articles/${slug}`

  const openGraph = {
    title: metaTitle,
    description: metaDesc,
    images: [LOGO_URL, article.cover.url],
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

export async function generateStaticParams() {
  const token = process.env.STRAPI_API_TOKEN;
  const path = `/articles`;
  const options = {headers: {Authorization: `Bearer ${token}`}};
  const articleResponse = await fetchAPI(
    path,
    {
      locale: "*",
    },
    options
  );

  return articleResponse.data.map(
    (article: {
      locale: string;
      slug: string;
    }) => ({locale: article.locale, slug: article.slug})
  );
}
