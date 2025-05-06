import ButtonLink from "@/app/components/elements/ButtonLink";
import {getButtonAppearance} from "@/app/library/common/button-helpers";
import React from "react";

interface Button {
  id: string;
  url: string;
  text: string;
  type: string;
  newTab: boolean;
}

interface BottomActionsProps {
  data: {
    id: string;
    title: string;
    locale: string;
    description: string;
    buttons: Button[];
  };
}


export default function BottomActions({data}: BottomActionsProps) {
  const {title, description, locale, buttons} = data;
  return (
    <section className="py-20 bg-gradient-to-r from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto">{description}</p>
        <div className="flex flex-row justify-center flex-wrap gap-4">
          {buttons.map((button: Button) => (
            <ButtonLink
              locale={locale}
              button={button}
              appearance={getButtonAppearance(button.type, "light")}
              compact={false}
              key={button.id}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
