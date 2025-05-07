// Define Props type for better type safety
export type Props = {
  params: Promise<{ locale: string }>;
};

export type ArticleProps = {
  params: Promise<{ locale: string; slug: string }>;

}

export type PromsPros = Promise<{
  locale: string;
  id?: string;
}>

export type ArticlePromsPros = Promise<{
  locale: string;
  slug: string;
}>

