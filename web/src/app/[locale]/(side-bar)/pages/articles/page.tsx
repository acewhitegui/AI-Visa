"use server"
import React from "react";
import {Props} from "@/app/library/objects/props";
import {getPageBySlug} from "@/app/library/services/page_service";
import {BLOG_SLUG, FALLBACK_SEO} from "@/app/library/common/constants";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {Page} from "@/app/library/objects/types";

export default async function BlogPage({params}: Props) {
  const {locale} = await params;
  const page: Page = await getPageBySlug(locale, BLOG_SLUG);
  if (!page) return FALLBACK_SEO;

  const {title, description} = page

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        <div
          className="rich-text"
        >
          <BlocksRenderer content={description}/>
        </div>
      </header>
    </div>
  );
}