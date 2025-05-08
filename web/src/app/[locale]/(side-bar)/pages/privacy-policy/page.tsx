"use server"
import {getPageBySlug} from "@/app/library/services/page_service";
import {Page, Props} from "@/app/library/objects/props";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";

export default async function Privacy({params}: Props) {
  const {locale} = await params;
  const slug = "privacy-policy";

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