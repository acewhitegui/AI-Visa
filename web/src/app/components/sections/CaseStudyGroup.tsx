"use client"

import Image from "next/image";
import {useState} from "react";
import {useTranslations} from "next-intl";
import {Link} from "@/i18n/routing";
import {StopIcon} from "@heroicons/react/24/solid";
import CustomLink from "@/app/components/elements/CustomLink";
import {formatDateOnlyMonth, getStrapiMedia} from "@/app/library/common/api-helpers";
import {CaseStudy} from "@/app/library/objects/types";


interface CaseStudiesProps {
  id: string;
  title: string;
  locale: string;
  caseStudies: CaseStudy[];
}


export default function CaseStudyGroup({data}: { data: CaseStudiesProps }) {
  const {title, caseStudies, locale} = data;
  const t = useTranslations("case-study");
  const [expanded, setExpanded] = useState(false)

  caseStudies.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

  return (
    <section className="case-study-group container mx-auto p-8  space-y-6 lg:mt-8">
      <h1 className="text-center mb-4 lg:mb-12 text-4xl lg:text-5xl font-bold leading-none">{title}</h1>
      <div className="lg:grid lg:grid-cols-2">
        {
          caseStudies && caseStudies.map((caseStudy: CaseStudy) => {
              const imageUrl = getStrapiMedia(caseStudy.cover.url)

              const hasWebsite = caseStudy.website !== null && caseStudy.website !== undefined

              return (
                <div key={caseStudy.id}
                     className="certification flex flex-row py-2 lg:p-2 mb-4 lg:mb-8 border-y-1  lg:border lg:mr-8 lg:rounded-lg border-gray-200">
                  <div className="min-w-24 max-w-24 lg:min-w-40 lg:max-w-40 mr-4 p-2 lg:p-4">
                    <Image
                      src={imageUrl}
                      alt={caseStudy.cover.name || 'Certification badge'}
                      className="object-contain w-full"
                      width={caseStudy.cover.width}
                      height={caseStudy.cover.height}
                    />
                  </div>
                  <div className="flex flex-col max-w-70 lg:max-w-4xl">
                    <div
                      className="text-xl lg:text-2xl font-medium lg:font-semibold my-2 lg:mb-2">{caseStudy.title}
                    </div>
                    <div className="mb-0 lg:mb-2">
                      <span className="mr-2">{t("completed")}: </span>
                      <span className="">{formatDateOnlyMonth(caseStudy.completedAt, caseStudy.locale)}</span>
                    </div>
                    <div className="flex flex-row line-clamp-2">

                      <button className="text-violet-700 hover:text-violet-800 whitespace-nowrap"
                              onClick={() => setExpanded(!expanded)}
                              style={{cursor: 'pointer'}}>
                        {expanded ? t("hide-desc") : t("show-desc")}
                      </button>
                      {
                        hasWebsite && <div className="flex justify-center items-center mx-2">
                              <StopIcon color="gray" width={12} height={12}/>
                          </div>
                      }
                      {
                        hasWebsite && <div className="text-violet-700 hover:text-violet-800">
                              <CustomLink link={caseStudy.website} locale={locale}>
                                  <span className="underline line-clamp-2">{caseStudy.website.text}</span>
                              </CustomLink>
                          </div>
                      }
                    </div>
                    <div className="rich-text">
                      {expanded && <p>{caseStudy.description}</p>}
                    </div>
                  </div>
                </div>
              )
            }
          )
        }
      </div>
      <div className="flex flex-row justify-center">
        <Link title="More Cases about Any Converters"
              className="text-xl font-normal text-violet-700 underline hover:text-violet-800" href="/case-study"
              locale={locale}>
          <span>{t("more-cases")}</span>
        </Link>
      </div>
    </section>
  );
}

