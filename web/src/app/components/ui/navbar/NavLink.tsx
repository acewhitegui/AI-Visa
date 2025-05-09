import {Link, usePathname} from "@/i18n/routing";
import React from "react";
import {Navigation} from "@/app/library/objects/types";


interface MobileNavLinkProps extends Navigation {
  closeMenu: () => void;
}

export function DesktopNavLink({path, title}: Navigation) {
  const pathname = usePathname();
  const isActive = pathname === path;
  return (
    <li className="flex my-2">
      <Link
        href={path}
        title={title}
        className={`flex items-center mx-4 -mb-1 border-b-2 border-transparent transition-all duration-300 hover:border-violet-500 ${
          isActive ? "text-violet-700 border-violet-700 font-bold" : "hover:text-violet-600"
        }`}
      >
        {title}
      </Link>
    </li>
  );
}

export function MobileNavLink({path, title, closeMenu}: MobileNavLinkProps) {
  const pathname = usePathname();
  const isActive = path === pathname;
  return (
    <li className="">
      <Link
        href={path}
        title={title}
        onClick={closeMenu}
        className={`-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 transition-colors duration-200 ${
          isActive ? "bg-primary text-white" : "hover:bg-gray-100"
        }`}
        aria-current={isActive ? "page" : undefined}
      >
        {title}
      </Link>
    </li>
  );
}

export function renderNavigationLinks(
  links: Navigation[],
  NavLinkComponent: React.ComponentType<any>,
  closeMenu?: () => void
) {
  return links.map((link) => (
    <li key={link.id} className="relative group list-none">
      <button
        className=" px-4 py-2 font-semibold rounded transition-colors duration-200 hover:text-violet-600 focus:outline-none flex items-center">
        {link.title}
        <svg className="ml-2 h-4 w-4 fill-current transition-transform duration-200 group-hover:rotate-180"
             viewBox="0 0 20 20">
          <path d="M6 8l4 4 4-4"/>
        </svg>
      </button>
      <div
        className="absolute left-2 z-10 hidden pt-2 group-hover:block group-focus:block min-w-55 transform origin-top scale-95 group-hover:scale-100 transition-all duration-200">
        <ul className="rounded-md shadow-xl py-2 list-none overflow-hidden bg-background border border-gray-100">
          {
            link.items.map((item) =>
              (
                <NavLinkComponent
                  key={item.id}
                  {...item}
                  {...(closeMenu ? {closeMenu} : {})}
                />
              )
            )
          }
        </ul>
      </div>
    </li>
  ));
}