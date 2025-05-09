"use server"
import {getPageBySlug} from "@/app/library/services/page_service";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {Page} from "@/app/library/objects/types";
import {Props} from "@/app/library/objects/props";

export default async function Terms({params}: Props) {
  const {locale} = await params;
  const slug = "terms-of-service";

  const page: Page = await getPageBySlug(locale, slug)

  const {title, description} = page;
  return (
    <section className="rich-text container mx-auto">
      <h1 className="flex justify-center py-10">
        <span>{title}</span>
      </h1>
      <BlocksRenderer content={description}/>
    </section>
  )
}