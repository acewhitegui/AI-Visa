import Head from "next/head";
import React from "react";

export default function layout({children}: { children: React.ReactNode }) {
  return (
    <>
      <Head>
        <meta name="description"
              content="Choose the perfect plan for your YouTube video conversion needs. Affordable pricing with premium features."/>
        <meta property="og:title" content="YouTube to MP4 Converter Pricing Plans"/>
        <meta property="og:description"
              content="Flexible subscription options for all users. Convert videos in HD quality with premium features."/>
      </Head>
      <div>{children}</div>
    </>
  )
}
