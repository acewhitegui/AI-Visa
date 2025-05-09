import PropTypes from "prop-types"

export const linkPropTypes = PropTypes.shape({
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  url: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  newTab: PropTypes.bool,
})

export const mediaPropTypes = PropTypes.shape({
  data: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    attributes: PropTypes.shape({
      alternativeText: PropTypes.string,
      mime: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    }),
  }),
})

export const buttonLinkPropTypes = PropTypes.shape({
  theme: PropTypes.string,
  text: PropTypes.string.isRequired,
  newTab: PropTypes.bool,
})

export type Navigation = {
  id: number;
  documentId: string;
  title: string;
  path: string;
  type: string;
  related?: any
  items: Navigation[]
}

export type Language = {
  code: string;
  name: string;
  displayName: string;
}

export type SEO = {
  metaTitle: string;
  metaDescription: string;
  shareImage: StrapiMedia;
}

export type StrapiLink = {
  id: number;
  url: string;
  newTab: boolean;
  text: string;
}

export type StrapiMedia = {
  id: number;
  name: string;
  url: string;
  mime: string;
  width: number;
  height: number;
  alternativeText: string;
  caption: string;
}
export type Product = {
  id: number;
  documentId: string;
  title: string;
  description: any;
  icon: StrapiMedia;
  slug: string;
  blocks: any[];
  seo: SEO;
  url: string; // for how to schema
}

export type Conversation = {
  conversation_id: string;
  name: string;
  answers: any;
  step: number;
}

export type Question = {
  documentId: string;
  title: string;
  showDefault: boolean;
  choices: Choice[];
}

export type Choice = {
  id: number;
  title: string;
  question: Question;
  action: string;
}

export type Answer = {
  question_id: string;
  choice_id: number
}

export type Material = {
  id: number;
  documentId: string;
  title: string;
  type: string;
  limits: number;
}

export type UploadFile = {
  file_id: string;
  name: string;
  conversation_id: string;
  material_id: string;
  type: string;
  url: string;
}

export type Message = {
  message_id: string;
  conversation_id: string;
  created_at: string;
  updated_at: string;
  answer: string;
}

export type CaseStudy = {
  id: number;
  locale: string;
  title: string;
  completedAt: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  slug: string;
  cover: StrapiMedia;
  authorsBio: {
    name: string;
    avatar: {
      url: string;
    };
  };
  blocks: any[];
  website: StrapiLink;
  publishedAt: string;
}

export type ArticlePageData = {
  data: Article[];
  meta: Meta
}

export type Article = {
  id: number;
  title: string;
  excerpt: string;
  author: Author;
  updatedAt: string;
  publishedAt: string;
  category: Category;
  cover: StrapiMedia;
  slug: string;
  description: any;
  blocks: any[];
  seo: SEO;
}

export type Category = {
  id: number;
  documentId: string;
  name: string;
  slug: string;
}

export type Author = {
  id: number;
  name: string;
  email: string;
  profile: StrapiLink
}

export type Page = {
  id: number;
  locale: string;
  title: string;
  description: any;
  slug: string;
  blocks: any[];
  seo: SEO;
}

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export type Meta = {
  pagination: Pagination;
}

export type SitemapItem = {
  path: string;
  priority: number;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never' | undefined;
}