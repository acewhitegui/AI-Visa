"use client";
import {Dialog} from "@headlessui/react";
import {Bars3Icon, XMarkIcon} from "@heroicons/react/24/outline";
import React, {useCallback, useMemo, useState} from "react";
import {useTranslations} from "next-intl";
import {usePathname, useRouter} from "@/i18n/routing";
import Logo from "@/app/components/ui/Logo";
import {signOut, useSession} from "next-auth/react";
import {DesktopNavLink, MobileNavLink, renderNavigationLinks} from "@/app/components/ui/navbar/NavLink";
import {Language, Navigation} from "@/app/library/objects/types";
import {DesktopAccountSection, MobileAccountSection} from "@/app/components/ui/navbar/AccountSections";

type NavbarProps = {
  links: Navigation[];
  locale: string;
  languages: Language[];
  logoUrl?: string | null;
  logoText?: string | null;
};

export default function Navbar({
                                 links,
                                 locale,
                                 languages,
                                 logoUrl,
                                 logoText,
                               }: NavbarProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const {data: session} = useSession();

  const sortedLanguages = useMemo(
    () => [...languages].sort((a, b) => a.name.localeCompare(b.name)),
    [languages]
  );

  const closeMenu = useCallback(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, []);

  const handleLanguageChange = useCallback(
    (code: string) => {
      const newPathname = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
      router.replace(newPathname, {locale: code});
      closeMenu();
    },
    [pathname, locale, router, closeMenu]
  );

  const handleSignOut = useCallback(async () => {
    try {
      await signOut({redirectTo: "/login", redirect: true});
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      closeMenu();
    }
  }, [closeMenu]);

  return (
    <div id="nav-bar" className="p-1 lg:p-4 sticky top-0 z-50 ">
      <div className="container flex justify-between h-12 lg:h-16 mx-auto px-0 sm:px-6">
        <Logo src={logoUrl} onClick={closeMenu}>
          {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
        </Logo>
        <ul className="items-stretch hidden space-x-3 lg:items-center lg:flex">
          {renderNavigationLinks(
            links,
            DesktopNavLink,
          )}
        </ul>
        <DesktopAccountSection
          session={session}
          t={t}
          userMenuOpen={userMenuOpen}
          setUserMenuOpen={setUserMenuOpen}
          handleSignOut={handleSignOut}
          locale={locale}
          sortedLanguages={sortedLanguages}
          handleLanguageChange={handleLanguageChange}
        />
        <button
          title="mobile navigation"
          className="p-1 lg:hidden"
          onClick={() => setMobileMenuOpen(true)}
        >
          <Bars3Icon className="h-7 w-7 text-gray-300" aria-hidden="true"/>
        </button>
        <Dialog
          as="div"
          className="lg:hidden"
          open={mobileMenuOpen}
          onClose={setMobileMenuOpen}
        >
          <div className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75"/>
          <Dialog.Panel
            className="fixed inset-y-0 rtl:left-0 ltr:right-0 z-50 w-full overflow-y-auto bg-gray-800 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-inset sm:ring-white/10">
            <div className="flex items-center justify-between">
              <div className="-m-1.5 p-1.5">
                <Logo src={logoUrl} onClick={closeMenu}>
                  {logoText && (
                    <h2 className="text-2xl font-bold text-white">{logoText}</h2>
                  )}
                </Logo>
              </div>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={closeMenu}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-700">
                <ul className="bg-background border border-border rounded-lg shadow-md p-4 w-64">
                  {renderNavigationLinks(
                    links,
                    MobileNavLink,
                    closeMenu
                  )}
                </ul>
                <MobileAccountSection
                  session={session}
                  t={t}
                  closeMenu={closeMenu}
                  handleSignOut={handleSignOut}
                  locale={locale}
                  sortedLanguages={sortedLanguages}
                  handleLanguageChange={handleLanguageChange}
                />
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </div>
    </div>
  );
}
