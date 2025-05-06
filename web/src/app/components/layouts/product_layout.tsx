// app/components/layouts/ProductLayout.tsx
import React from "react";
import {Product, PromsPros} from "@/app/library/objects/props";
import type {Metadata} from "next";
import {FALLBACK_SEO, HOST, LOGO_URL} from "@/app/library/common/constants";
import {getAlternate} from "@/app/library/common/i18n-helpers";
import {routing} from "@/i18n/routing";
import {getProductBySlug} from "@/app/library/services/product_service";
import {ProductBlocks, ProductHero} from "@/app/components/ui/product";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/app/components/ui/shadcn/breadcrumb"

export async function ProductLayout({
                                      params,
                                      children,
                                      slug
                                    }: {
  params: PromsPros;
  children: React.ReactNode;
  slug: string;
}) {
  const {locale} = await params;
  const product: Product = await getProductBySlug(locale, slug);
  const {seo} = product;

  product.url = `${HOST}/${locale}/products/${slug}`

  return (
    <>
      <Breadcrumb className="container mx-auto py-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}`} title="Any Converters Homepage">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator/>
          <BreadcrumbItem>
            <BreadcrumbLink href={`/${locale}/products/${slug}`} title={product.title}>{product.title}</BreadcrumbLink>
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
                  "name": product.title,
                  "item": `${HOST}/${locale}/products/${slug}`
                },
              ]
            })
          }
        </script>
      </Breadcrumb>
      <ProductHero product={product}/>
      {children}
      <ProductBlocks product={product} locale={locale}/>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": seo?.metaTitle || product.title,
          "description": seo?.metaDescription || product.description,
          "url": `${HOST}/${slug}`,
          "applicationCategory": "WebApplication",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          },
          "operatingSystem": "Web"
        })}
      </script>
    </>
  )
}

export function generateProductStaticParams() {
  return routing.locales.map((locale: any) => ({locale}));
}

export async function generateProductMetadata({
                                                params,
                                                slug
                                              }: {
  params: PromsPros;
  slug: string;
}): Promise<Metadata> {
  const {locale} = await params;

  const product: Product = await getProductBySlug(locale, slug);
  if (!product) return FALLBACK_SEO;

  const baseUrl = `/products/${slug}`

  const {seo} = product

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
