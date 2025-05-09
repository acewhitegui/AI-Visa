import {Link} from "@/i18n/routing";
import Image from "next/image"
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {getTranslations} from "next-intl/server";
import {Product} from "@/app/library/objects/types";

interface ProductsProps {
  locale: string;
  data: {
    id: string;
    title: string;
    anchor: string;
    products: Product[];
  };
}

export default async function Products({data, locale}: ProductsProps) {

  const t = await getTranslations({locale: locale, namespace: "products"});


  const {title, anchor, products} = data;
  return (
    <section id={anchor} className="py-16 bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <Link href={"/products/" + product.slug} key={product.id} locale={locale} title={product.title}>
              <div
                className="bg-gray-700 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-6 h-full flex flex-col">
                <div className="mb-4">
                  <Image src={product.icon.url} alt={product.icon.alternativeText} width={24}
                         height={24}/>
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <div className="mb-2">
                  <BlocksRenderer content={product.description}/>
                </div>
                <div className="text-violet-400 font-medium">{t("try-now")} →</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}