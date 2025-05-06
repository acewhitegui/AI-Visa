import {StrapiMedia} from "@/app/library/objects/props";
import {getStrapiMedia} from "@/app/library/common/api-helpers";

export default function Video({
                                media,
                                poster,
                                className,
                                controls = true,
                                autoPlay = false,
                              }: {
  media: StrapiMedia,
  poster: StrapiMedia,
  className: string,
  controls?: boolean,
  autoPlay?: boolean
}) {
  const fullVideoUrl = getStrapiMedia(media.url)
  const fullPosterUrl = getStrapiMedia(poster?.url)

  return (
    <video
      className={className}
      poster={fullPosterUrl}
      controls={controls}
      autoPlay={autoPlay}
    >
      <source src={fullVideoUrl} type={media.mime}/>
    </video>
  )
}
