"use client";
import {usePathname} from "next/navigation";
import {CgWebsite} from "react-icons/cg";
import {FaDiscord} from "react-icons/fa";
import {AiFillFacebook, AiFillLinkedin, AiFillTwitterCircle, AiFillYoutube} from "react-icons/ai";
import {Link} from "@/i18n/routing";
import Logo from "@/app/components/ui/Logo";
import React from "react";
import {useTranslations} from "next-intl";
import {Navigation} from "@/app/library/objects/props";

interface FooterLink {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
  social?: string;
}

function FooterLink({path, title}: Navigation) {
  const pathname = usePathname();
  return (
    <li className="flex">
      <Link
        href={path}
        title={title}
        className={`hover: ${
          pathname === path && ""
        }}`}
      >
        {title}
      </Link>
    </li>
  );
}

function RenderSocialIcon({social}: { social: string | undefined }) {
  switch (social) {
    case "WEBSITE":
      return <CgWebsite/>;
    case "LINKEDIN":
      return <AiFillLinkedin/>
    case "FACEBOOK":
      return <AiFillFacebook/>
    case "TWITTER":
      return <AiFillTwitterCircle/>;
    case "YOUTUBE":
      return <AiFillYoutube/>;
    case "DISCORD":
      return <FaDiscord/>;
    default:
      return null;
  }
}

export default function Footer({
                                 logoText,
                                 logoUrl,
                                 links,
                                 legalLinks,
                                 socialLinks,
                               }: {
  logoText: string | null;
  logoUrl: string | null | undefined;
  links: Array<Navigation>;
  legalLinks: Array<FooterLink>;
  socialLinks: Array<FooterLink>;
}) {

  const t = useTranslations('common');

  return (
    <footer className="py-6 bg-gray-900">
      <div className="container px-6 mx-auto space-y-6 divide-y divide-gray-400 md:space-y-12 divide-opacity-50">
        <div className="grid grid-cols-12 mb-2 pb-2">
          <div className="pb-6 col-span-full md:pb-0 md:col-span-4 pr-24">
            <Logo src={logoUrl}>
              {logoText && <h2 className="text-2xl font-bold">{logoText}</h2>}
            </Logo>
          </div>

          <div className="col-span-6 text-left md:col-span-3">
            <p className="pb-1 text-lg font-medium">{t("menu")}</p>
            <ul>
              {links.map((link: Navigation) => (
                <FooterLink key={link.id} {...link} />
              ))}
            </ul>
          </div>
        </div>
        <div className="grid justify-center lg:justify-between">
          <div className="flex">
            <span className="mr-2">
              ©{new Date().getFullYear()} WHITEDIT, LTD.
            </span>
            <ul className="flex">
              {legalLinks.map((link: FooterLink) => (
                <li key={link.id}>
                  <Link
                    title={link.text}
                    href={link.url}
                    className="text-gray-700 hover:text-gray-900 mr-2"
                    key={link.id}
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="flex justify-center pb-4 space-x-4 lg:pt-0 lg:col-end-13">
            {socialLinks.map((link: FooterLink) => {
              return (
                <a
                  key={link.id}
                  rel="noopener noreferrer"
                  href={link.url}
                  title={link.text}
                  target={link.newTab ? "_blank" : "_self"}
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                >
                  <RenderSocialIcon social={link.social}/>
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
