"use server"
import {ArticleProps} from "@/app/library/objects/props";
import {notFound} from 'next/navigation';
import Image from 'next/image';
import {getArticleBySlug} from "@/app/library/services/article-service";
import {BlocksRenderer} from "@strapi/blocks-react-renderer";
import {Link} from "@/i18n/routing";
import "@/app/assets/css/article.css"
import {formatDate} from "@/app/library/common/utils";
import {Article} from "@/app/library/objects/types";


export default async function ArticlePage({params}: ArticleProps) {
  const {locale, slug} = await params;
  const article: Article = await getArticleBySlug(locale, slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <article className="prose lg:prose-xl dark:prose-invert mx-auto">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{article.title}</h1>

          <div className="flex items-center space-x-4 mb-6">
            <div className="flex items-center">
              <div>
                <p className="font-medium">{article.author?.name}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                  <time dateTime={article.publishedAt}>
                    {formatDate(article.publishedAt, locale)}
                  </time>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Cover Image */}
        {article.cover && (
          <div className="relative w-full h-[400px] mb-8 rounded-lg overflow-hidden">
            <Image
              src={article.cover.url}
              alt={article.title}
              fill
              priority
              className="object-cover"
            />
          </div>
        )}
        {/* Article Content */}
        <div
          className="article-content rich-text"
        >
          <BlocksRenderer content={article.description}/>
        </div>
        {/* Author Bio */}
        {article.author?.profile && (
          <div className="mt-6 p-6 bg-gray-900 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">About the Author</h3>
            <Link className="text-primary" href={article.author?.profile.url}
                  title={article.author.profile.text}>{article.author.profile.text}</Link>
          </div>
        )}
      </article>
    </main>
  );
}