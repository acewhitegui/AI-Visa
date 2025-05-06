import React from "react";
import {Metadata} from "next";
import {generatePageMetadata, generatePageStaticParams, PageLayout} from "@/app/components/layouts/page_layout";

const SLUG = "terms-of-service";

export default async function layout({params, children}: {
  params: Promise<{
    locale: string;
  }>;
  children: React.ReactNode
}) {
  return PageLayout({params, children, slug: SLUG});
}

export async function generateStaticParams() {
  return generatePageStaticParams();
}

export async function generateMetadata({params}: {
  params: Promise<{
    locale: string;
  }>
}): Promise<Metadata> {
  return generatePageMetadata({params, slug: SLUG});
}
