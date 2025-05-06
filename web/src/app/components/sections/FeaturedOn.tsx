import {env} from "next-runtime-env";
import Image from "next/image";
import {Link} from "@/i18n/routing";
import {StrapiMedia} from "@/app/library/objects/props";

interface FeatureOnProps {
  locale: string,
  data: {
    title: string;
    logos: LogoItem[]
  }
}

interface LogoItem {
  id: string;
  title?: string;
  logo: StrapiMedia;
  url?: string
}

export default function featuredOn({data, locale}: FeatureOnProps) {
  const {logos} = data;

  return (
    <section className="featured-on container mx-auto my-4 lg:my-16">
      <div className="container flex flex-col mx-auto">
        <div className="grid grid-cols-2 justify-center pb-2 lg:flex lg:flex-row">
          {
            logos.map(logoItem => (
              (<Link
                title="Any Concverters Homepage"
                locale={locale}
                key={logoItem.id}
                href={logoItem.url ? logoItem.url : ""}
                aria-label={logoItem.title}
                className="items-center px-12"
                target="_blank"
              >
                {<Image className="w-auto h-16 m-2 object-contain"
                        src={`${env("NEXT_PUBLIC_STRAPI_API_URL")}${logoItem.logo.url}`}
                        alt="logo"
                        width={logoItem.logo.width}
                        height={logoItem.logo.height}
                        loading="lazy"/>}
              </Link>)
            ))
          }
        </div>
      </div>
    </section>
  );
}
