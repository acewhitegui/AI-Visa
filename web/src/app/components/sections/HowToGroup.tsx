import React from "react";
import {StrapiMedia} from "@/app/library/objects/props";
import Image from "next/image";

interface HowToProps {
  locale: string;
  url: string;
  data: {
    id: string;
    title: string;
    description: string;
    totalTime: string;
    step: Step[];
    image: StrapiMedia;
  };
}

interface Step {
  id: string;
  title: string;
  description: string;
  image: StrapiMedia;
}

export default function HowToGroup({data, url}: HowToProps) {
  // Format time for display (assuming totalTime is in minutes)
  const formatTime = (timeStr: string) => {
    const minutes = parseInt(timeStr, 10);
    if (isNaN(minutes)) return timeStr;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  return (
    <>
      <section className="how-to-guide container mx-auto">
        <h2 className="text-2xl font-bold mb-4">{data.title}</h2>
        {data.totalTime && (
          <div className="flex items-center mb-6 text-gray-600">
            <span className="mr-2">⏱️</span>
            <span>Total time: {formatTime(data.totalTime)}</span>
          </div>
        )}

        <div className="steps-container">
          {data.step.map((step, index) => (
            <div
              key={step.id}
              id={`step-${index + 1}`}
              className={`step-item mb-8 pb-6 flex flex-col md:flex-row ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center`}
            >
              <div className={`md:w-1/2 ${index % 2 === 0 ? 'md:pr-6' : 'md:pl-6'}`}>
                <h3 className="text-lg font-medium mb-2">
                  <span
                    className="bg-gray-700 text-white rounded-full w-8 h-8 inline-flex items-center justify-center mr-2">
                    {index + 1}
                  </span>
                  {step.title}
                </h3>
                <div className="step-description">
                  <p>{step.description}</p>
                </div>
              </div>

              {step.image?.url && (
                <div className="my-4 md:my-0 md:w-1/2">
                  <Image
                    src={step.image.url}
                    alt={step.title}
                    width={600}
                    height={400}
                    className="rounded-lg"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <script
        type="application/ld+json"
      >
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": data.title,
          "description": data.description,
          "totalTime": `PT${data.totalTime}M`,
          "image": data.image?.url || "",
          "step": data.step.map((step) => ({
            "@type": "HowToStep",
            "url": url,
            "name": step.title,
            "itemListElement": {
              "@type": "HowToDirection",
              "text": step.description
            },
            "image": step.image?.url || ""
          }))
        })}

      </script>
    </>
  );
}
