import Image from "next/image";
import {BlocksContent, BlocksRenderer} from "@strapi/blocks-react-renderer";
import {Link} from "@/i18n/routing";
import {StrapiMedia} from "@/app/library/objects/types";
import {getStrapiMedia} from "@/app/library/common/api-helpers";
import {renderButtonStyle} from "@/app/library/common/button-helpers";
import React from "react";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}


interface HeroProps {
  locale: string,
  data: {
    id: string;
    title: string;
    description: BlocksContent;
    picture: StrapiMedia;
    buttons: Button[];
  };
}

export default function Hero({data, locale}: HeroProps) {
  const url = data.picture?.url;

  return (
    <section className="bg-gradient-to-r from-gray-800 to-black  py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{data.title}</h1>
        <div className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          <BlocksRenderer content={data.description}/>
        </div>
        <div
          className="flex flex-col space-y-4 text-center sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4">
          {data.buttons.map((button: Button, index: number) => (
            <Link
              title={button.text}
              locale={locale}
              key={index}
              href={button.url}
              target={button.newTab ? "_blank" : "_self"}
              className={renderButtonStyle(button.type)}
            >
              {button.text}
            </Link>
          ))}
        </div>
        {
          url && <div
                className=" justify-center p-0 mt-4 hidden lg:flex lg:visible lg:p-6 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
                <Image
                    src={getStrapiMedia(url) || ""}
                    alt={
                      data.picture.alternativeText || "none provided"
                    }
                    className="object-contain"
                    width={600}
                    height={600}
                    loading="eager"
                />
            </div>
        }
      </div>
    </section>
  );
}
