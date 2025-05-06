import {getStrapiMedia} from "@/app/library/common/api-helpers";

interface Media {
  id: number;
  alternativeText: string | null;
  caption: string | null;
  url: string;
  mime: string;
  width?: number | `${number}` | undefined
  height?: number | `${number}` | undefined
}

interface Poster {
  url: string;
}


export default function CustomVideo(props: any) {
  const media: Media = props.media
  const poster: Poster = props.poster
  const fullVideoUrl = getStrapiMedia(media.url)
  const fullPosterUrl = getStrapiMedia(poster?.url)

  return (
    <video
      className={props.className}
      poster={fullPosterUrl}
      controls={props.controls}
      autoPlay={props.autoPlay}
    >
      <source src={fullVideoUrl} type={media.mime}/>
    </video>
  )
}

