import type {NextRequest} from 'next/server';
import {NextResponse} from 'next/server';
import createMiddleware from 'next-intl/middleware';
import {match as matchLocale} from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import {routing} from "@/i18n/routing";
import {auth} from "@/auth";


const intlMiddleware = createMiddleware(routing);

function getLocale(request: NextRequest): string | undefined {
  // Negotiator expects plain object so we need to transform headers
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  // Use negotiator and intl-localematcher to get best locale
  const languages = new Negotiator({headers: negotiatorHeaders}).languages();
  const locales = routing.locales;
  try {
    return matchLocale(languages, locales, routing.defaultLocale);
  } catch {
    // Invalid accept-language header
    return routing.defaultLocale;
  }
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // // `/_next/` and `/api/` are ignored by the watcher, but we need to ignore files in `public` manually.
  // // If you have one
  if (
    [
      '/img',
      '/favicon.ico',
      '/sitemap.xml',
      '/robots.txt',
      '/manifest.json',
      '/ywaaadgec7nyqjjx9gsvyqujc5gc6j58.txt', // ahref index now
      '/llms.txt',
      '/llms-full.txt'
    ].includes(pathname)
  )
    return;

  // Check if there is any supported locale in the pathname
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(new URL(`/${locale}/${pathname}`, request.url));
  }

  // For protected routes, use the auth middleware
  const isAuthRoute = pathname.includes('/dashboard');
  if (isAuthRoute) {
    const session = await auth();
    if (!session) {
      // Get the locale from the pathname
      const locale = pathname.split('/')[1];
      return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
    }
  }

  // Then run the internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!_next|any-converters/api|api|img).*)'],
};