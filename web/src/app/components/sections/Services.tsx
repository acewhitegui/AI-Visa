import Image from "next/image";
import {BlocksContent, BlocksRenderer} from "@strapi/blocks-react-renderer";
import {clsx} from "clsx";
import {Link} from "@/i18n/routing";
import {StrapiMedia} from "@/app/library/objects/types";
import Button from "@/app/components/elements/Button";
import {getStrapiMedia} from "@/app/library/common/api-helpers";
import {renderButtonStyle} from "@/app/library/common/button-helpers";

interface Service {
  locale: string;
  id: string;
  title: string;
  description: BlocksContent;
  picture: StrapiMedia;
  buttons: Button[];
}

interface ServicesProps {
  locale: string;
  data: {
    id: string;
    title: string;
    service: Service[];
  };
}


export default function Services({data, locale}: ServicesProps) {
  return (
    <section className="services p-8 mx-auto space-y-6 lg:mt-4">
      <h2 className="text-center mb-4 lg:mb-6 text-4xl lg:text-5xl font-bold leading-none">{data.title}</h2>
      {
        data.service.map((service: Service, index: number) => {
            const odd = index % 2 === 0
            service.locale = locale;
            return (
              <div key={service.id}
                   className={
                     clsx({
                       ['bg-gray-50 flex flex-col justify-center lg:space-x-32 mx-auto py-6 lg:py-12 lg:flex-row lg:justify-center']: odd,
                       ['flex flex-col justify-center lg:space-x-32 mx-auto sm:py-6 lg:py-12 lg:flex-row lg:justify-center']: !odd,
                     })
                   }>
                {odd ? (
                  <>
                    {getServiceDescription(service)}
                    {getServiceImage(service)}
                  </>
                ) : (
                  <>
                    {getServiceImage(service)}
                    {getServiceDescription(service)}
                  </>
                )
                }
              </div>
            )
          }
        )
      }
    </section>
  );
}


function getServiceImage(service: Service) {
  const imgUrl = getStrapiMedia(service.picture.url);
  return <div
    className="hidden lg:flex items-center justify-center p-6 mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
    <Image
      src={imgUrl || ""}
      alt={
        service.picture.alternativeText || "none provided"
      }
      className="object-contain w-96 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128 "
      width={service.picture.width}
      height={service.picture.height}
    />
  </div>;
}

function getServiceDescription(service: Service) {
  return <div
    className="flex flex-col justify-center p-2 lg:p-6 text-left rounded-lg lg:max-w-md xl:max-w-lg">
    <h3 className="text-4xl font-bold leading-none text-center lg:text-left lg:text-5xl lg:mb-8">{service.title}</h3>
    <section className="rich-text pt-4 lg:py-6">
      <BlocksRenderer content={service.description}/>
    </section>
    <div
      className="flex flex-col space-y-4 text-center sm:items-center sm:justify-center sm:flex-row sm:space-y-0 sm:space-x-4 lg:justify-start">
      {service.buttons.map((button: Button, index: number) => (
        <Link
          locale={service.locale}
          key={index}
          href={button.url}
          target={button.newTab ? "_blank" : "_self"}
          className={renderButtonStyle(button.type)}
        >
          {button.text}
        </Link>
      ))}
    </div>
  </div>;
}