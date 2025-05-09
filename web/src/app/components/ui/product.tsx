import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import React from "react";
import {Product} from "@/app/library/objects/types";
import componentResolver from "@/app/library/common/component-resolver";

export function ProductHero({product}: { product: Product }) {
  return (
    <section className="text-center mb-12">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{product?.title}</h1>
      {product && (
        <div className="text-xl text-gray-300 max-w-3xl mx-auto">
          <BlocksRenderer content={product.description}/>
        </div>
      )}
    </section>
  )
}

export function ProductBlocks({product, locale}: { product: Product; locale: string }) {
  return (
    product?.blocks.map((section: any, index: number) =>
      componentResolver(section, index, locale)
    )
  )
}