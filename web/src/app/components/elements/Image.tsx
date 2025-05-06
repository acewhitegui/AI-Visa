import Image from "next/image"
import React from "react";
import {getStrapiMedia} from "@/app/library/common/api-helpers";


interface MediaPros {
  width?: number | `${number}` | undefined
  height?: number | `${number}` | undefined
}


export default function NextImage(data: any, props?: MediaPros) {
  const {url, alternativeText, width, height} = data.media

  const loader: ({src, width}: { src: string; width: number }) => string = ({src}: {
    src: string,
    width: number
  }) => {
    return getStrapiMedia(src)
  }

  // The image has a fixed width and height
  if (props?.width && props?.height) {
    return (
      <Image loader={loader} src={url} alt={alternativeText || ""} {...props} />
    )
  }

  // The image is responsive
  return (
    <Image
      loader={loader}
      layout="responsive"
      width={width}
      height={height}
      objectFit="contain"
      src={url}
      alt={alternativeText || ""}
    />
  )
}