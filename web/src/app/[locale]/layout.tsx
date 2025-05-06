import type {Metadata} from "next";
import {NextIntlClientProvider} from "next-intl";
import "@/app/assets/css/globals.css";
import {getMessages, setRequestLocale} from "next-intl/server";
import Footer from "@/app/components/ui/Footer";
import Navbar from "@/app/components/ui/Navbar";
import {getLanguageList} from "@/app/library/services/language_service";
import {getFooterMenu, getGlobal, getNavbarMenu} from "@/app/library/services/global_service";
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

  const {navbar, footer} = global.data;
  // Fetch required data in parallel for better performance
  const [navbarMenu, footerMenu, languages, messages] = await Promise.all([
    getNavbarMenu(locale),
    getFooterMenu(locale),
    getLanguageList(),
    getMessages()
  ]);

  const session = await auth()

  return (
    <html lang={locale}>
    <head>
      <PublicEnvScript/>
    </head>
    <body>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <SessionProvider session={session}>
        <Navbar
          links={navbarMenu}
          locale={locale}
          languages={languages}
          logoUrl={navbar.navbarLogo.logoImg.url}
          logoText={navbar.navbarLogo.logoText}
        />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer
          logoText={footer.footerLogo.logoText}
          logoUrl={footer.footerLogo.logoImg.url}
          links={footerMenu}
          legalLinks={footer.legalLinks}
          socialLinks={footer.socialLinks}
        />
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

