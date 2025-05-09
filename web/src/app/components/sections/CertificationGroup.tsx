"use client"

import Image from "next/image";
import CustomLink from "@/app/components/elements/CustomLink";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {StopIcon} from "@heroicons/react/24/solid";
import {StrapiLink, StrapiMedia} from "@/app/library/objects/types";
import {BlocksContent, BlocksRenderer} from "@strapi/blocks-react-renderer";
import {formatDateOnlyMonth, getStrapiMedia} from "@/app/library/common/api-helpers";

interface Certification {
  id: string;
  title: string;
  locale: string;
  badge: StrapiMedia;
  provider: string;
  issued: string;
  description: BlocksContent;
  verifiedLink: StrapiLink;
}

interface CertificationsProps {
  id: string;
  title: string;
  locale: string;
  certifications: Certification[];
}


export default function CertificationGroup({data}: { data: CertificationsProps }) {
  const {title, locale, certifications} = data;
  const t = useTranslations("certification");
  const [expanded, setExpanded] = useState(false)

  return (
    <section className="certifications container mx-auto p-8  space-y-6 lg:mt-8">
      <h2 className="text-center mb-4 lg:mb-12 text-4xl lg:text-5xl font-bold leading-none">{title}</h2>
      <div className="lg:grid lg:grid-cols-2">
        {
          certifications && certifications.map((certification: Certification) => {
              const imageUrl = getStrapiMedia(certification.badge.url)

              return (
                <div key={certification.id}
                     className="certification flex flex-row py-2 lg:p-2 mb-4 lg:mb-8 border-y-1  lg:border lg:mr-8 lg:rounded-lg border-gray-200">
                  <div className="min-w-24 max-w-24 lg:min-w-40 lg:max-w-40 mr-4 p-2 lg:p-4">
                    <Image
                      src={imageUrl}
                      alt={certification.badge.name || 'Certification badge'}
                      className="object-contain w-full"
                      width={certification.badge.width}
                      height={certification.badge.height}
                    />
                  </div>
                  <div className="flex flex-col max-w-70 lg:max-w-4xl">
                    <div
                      className="text-xl lg:text-2xl font-medium lg:font-semibold my-2 lg:mb-2">{certification.title}</div>
                    <div className="mb-2">
                      <span className="mr-2">{t("provider")}: </span>
                      <span className="">{certification.provider}</span>
                    </div>
                    <div className="mb-0 lg:mb-2">
                      <span className="mr-2">{t("issued")}: </span>
                      <span className="">{formatDateOnlyMonth(certification.issued, certification.locale)}</span>
                    </div>
                    <div className="flex flex-row line-clamp-2">
                      <button className="text-violet-700 hover:text-violet-800 whitespace-nowrap"
                              onClick={() => setExpanded(!expanded)}
                              style={{cursor: 'pointer'}}>
                        {expanded ? t("hide-desc") : t("show-desc")}
                      </button>
                      <div className="flex justify-center items-center mx-2">
                        <StopIcon color="gray" width={12} height={12}/>
                      </div>
                      <div className="text-violet-700 hover:text-violet-800">
                        <CustomLink link={certification.verifiedLink} locale={locale}>
                          <span className="underline line-clamp-2">{t("verified-link")}</span>
                        </CustomLink>
                      </div>
                    </div>
                    <div className="rich-text">
                      {expanded && <BlocksRenderer content={certification.description}/>}
                    </div>
                  </div>
                </div>
              )
            }
          )
        }
      </div>
    </section>
  );
}

