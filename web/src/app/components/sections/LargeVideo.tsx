import Video from "@/app/components/elements/Video";
import {StrapiMedia} from "@/app/library/objects/props";

interface LargeVideo {
  title: string
  description: string
  video: StrapiMedia
  poster: StrapiMedia
}

const LargeVideo = ({data}: { data: LargeVideo }) => {
  return (
    <section className=" align-middle text-center pt-12 pb-16">
      <div className="container justify-center mx-auto">
        <h2 className="title mb-6">{data.title}</h2>
        <p className="text-lg mb-10">{data.description}</p>
        {/* Video wrapper */}
        <div className="w-full lg:w-9/12 mx-auto overflow-hidden shadow-2xl">
          <Video
            media={data.video}
            poster={data.poster}
            className="w-full max-h-full"
          />
        </div>
      </div>
    </section>
  )
}

export default LargeVideo
