import React from "react";
import {Steps} from "@/app/components/ui/steps/Steps";

export default async function StepsPage({params}: {
  params: Promise<{
    locale: string;
    productId: string;
    conversationId: string;
  }>
}) {
  const {locale, productId, conversationId} = await params;

  return (
    <div className="container mx-auto">
      <Steps locale={locale} productId={productId} conversationId={conversationId}/>
    </div>
  )
}