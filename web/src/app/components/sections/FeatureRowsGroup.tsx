import {StrapiMedia} from "@/app/library/objects/types";
import React from "react";
import Image from "next/image";


interface Link {
  id: number;
  url: string;
  newTab: boolean;
  text: string
}

interface Feature {
  id: string;
  title: string;
  description: string;
  newTab: boolean;
  media: StrapiMedia;
  link: Link
}


interface FeaturesProps {
  locale: string;
  data: {
    id: string;
    title: string;
    features: Feature[];
  };
}

const FeatureRowsGroup = ({data}: FeaturesProps) => {
  const {title, features} = data

  const featuresTotal = Object.keys(features).length;

  return (
    <section className="py-16 bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${featuresTotal} gap-8`}>
          {
            features.map((feature: Feature) => {
              return (
                <div key={feature.id} className="text-center p-6">
                  <div className="bg-gray-700 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    <Image src={feature.media.url} alt={feature.media.alternativeText} width={32}
                           height={32}/>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              )
            })
          }
        </div>
      </div>
    </section>
  )
}

export default FeatureRowsGroup
