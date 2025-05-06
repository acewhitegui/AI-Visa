import {AccountLinks} from "@/app/components/ui/navbar/AccountLinks";
import {Link} from "@/i18n/routing";
import {LanguageIcon} from "@heroicons/react/24/outline";
import {LanguageSelect} from "@/app/components/ui/navbar/LanguageSelect";
import React from "react";

export function DesktopAccountSection({
                                        session,
                                        t,
                                        userMenuOpen,
                                        setUserMenuOpen,
                                        handleSignOut,
                                        locale,
                                        sortedLanguages,
                                        handleLanguageChange,
                                      }: any) {
  return (
    <div className="items-center flex-shrink-0 hidden lg:flex">
      {session?.user ? (
        <div className="relative">
          <button
            onClick={() => setUserMenuOpen((open: boolean) => !open)}
            className="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded mr-4"
          >
            {t("my-account")}
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <AccountLinks
                onClose={() => setUserMenuOpen(false)}
                onSignOut={handleSignOut}
              />
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-violet-700 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded mr-4"
        >
          {t("login")}
        </Link>
      )}
      <LanguageIcon className="h-8 pr-2 text-white"/>
      <LanguageSelect
        locale={locale}
        languages={sortedLanguages}
        onChange={handleLanguageChange}
      />
    </div>
  );
}

export function MobileAccountSection({
                                       session,
                                       t,
                                       closeMenu,
                                       handleSignOut,
                                       locale,
                                       sortedLanguages,
                                       handleLanguageChange,
                                     }: any) {
  return (
    <>
      <div className="py-6">
        {session?.user ? (
          <div className="w-full">
            <AccountLinks
              onClose={closeMenu}
              onSignOut={handleSignOut}
              isMobile
            />
          </div>
        ) : (
          <Link
            href="/login"
            onClick={closeMenu}
            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-100 hover:bg-gray-900"
          >
            {t("login")}
          </Link>
        )}
      </div>
      <div className="py-6 flex items-center">
        <LanguageIcon className="h-8 pr-2 text-white"/>
        <LanguageSelect
          locale={locale}
          languages={sortedLanguages}
          onChange={handleLanguageChange}
        />
      </div>
    </>
  );
}