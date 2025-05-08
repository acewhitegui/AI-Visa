import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import "@/app/assets/css/globals.css";
import {getMessages, setRequestLocale} from "next-intl/server";
import {getGlobal} from "@/app/library/services/global_service";
import {PublicEnvScript} from "next-runtime-env";
import {SessionProvider} from "next-auth/react";
import {auth} from "@/auth";
import {notFound} from "next/navigation";
import {routing} from "@/i18n/routing";
import {getStrapiURL} from "@/app/library/common/api-helpers";
import {FALLBACK_SEO, HOST, LOGO_URL} from "@/app/library/common/constants";
import {getAlternate} from "@/app/library/common/i18n-helpers";
import {logger} from "@/app/library/common/logger";
import {Props} from "@/app/library/objects/props";

export default async function RootLayout({
                                           children,
                                           params
                                         }: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {

  const {locale} = await params;

  if (!isValidLocale(locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const global = await getGlobal(locale);
  if (!global) return null;

  // Fetch required data in parallel for better performance
  const [messages] = await Promise.all([
    getMessages()
  ]);

  const session = await auth()

  return (
    <html lang={locale}>
    <head>
      <title></title>
      <PublicEnvScript/>
    </head>
    <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={session}>
        <main className="min-h-screen w-full">
          {children}
        </main>
      </SessionProvider>
    </NextIntlClientProvider>
    </body>
    </html>
  );
}

/**
 * Validates if the locale is supported
 */
function isValidLocale(locale: any): boolean {
  return routing.locales.includes(locale);
}

/**
 * Page metadata generator
 */
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const {locale} = await params;

  if (!isValidLocale(locale)) {
    logger.warn(`Invalid locale: ${locale}`);
    return FALLBACK_SEO;
  }

  const meta = await getGlobal(locale);
  if (!meta.data) return FALLBACK_SEO;

  const {seo, favicon} = meta.data;

  const metaTitle = seo?.metaTitle || FALLBACK_SEO.title;
  const metaDesc = seo?.metaDescription || FALLBACK_SEO.description;
  const openGraph = {
    title: metaTitle,
    description: metaDesc,
    images: [LOGO_URL],
    url: "https://anyconverters.com/en",
    type: "website",
  };

  return {
    metadataBase: new URL(HOST),
    title: metaTitle,
    description: metaDesc,
    icons: {
      icon: favicon?.url ? [new URL(favicon.url, getStrapiURL())] : [],
    },
    alternates: getAlternate(),
    openGraph: openGraph,
    twitter: {
      site: '@anyconverters',
      ...openGraph
    },
  };
}

export async function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

