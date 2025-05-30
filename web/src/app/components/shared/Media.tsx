import Image from "next/image";
import {getStrapiMedia} from "@/app/library/common/api-helpers";

interface MediaProps {
  file: {
    data: {
      id: string;
      url: string;
      name: string;
      alternativeText: string;
    };
  };
}

export default function Media({data}: { data: MediaProps }) {
  const imgUrl = getStrapiMedia(data.file.data.url);
  return (
    <div className="flex items-center justify-center mt-8 lg:mt-0 h-72 sm:h-80 lg:h-96 xl:h-112 2xl:h-128">
      <Image
        src={imgUrl || ""}
        alt={data.file.data.alternativeText || "none provided"}
        className="object-cover w-full h-full rounded-lg overflow-hidden"
        width={400}
        height={400}
      />
    </div>
  );
}