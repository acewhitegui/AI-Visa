"use client"
import React, {useCallback, useEffect, useState} from "react";
import {Article, ArticlePageData, Category, Meta} from "@/app/library/objects/props";
import {getArticleList} from "@/app/library/services/article-service";
import {env} from "next-runtime-env";
import Loader from "@/app/components/ui/Loader";
import Image from "next/image";
import {motion} from "framer-motion";
import {readingTime, supportedLanguages, SupportedLanguages} from "reading-time-estimator";
import {formatDate, formatDateOnlyMonth} from "@/app/library/common/utils";
import {Link} from "@/i18n/routing";

export default function ArticleList({locale, categories}: { locale: string, categories: Array<Category> }) {
  const [meta, setMeta] = useState<Meta | undefined>();
  const [data, setData] = useState<Article[]>([]);
  const [isLoading, setLoading] = useState(true);
  // Extract unique categories
  const categoryStrList = ["All", ...new Set(categories.map(category => category.name))];
  // Add state for selected category
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [hoveredArticleId, setHoveredArticleId] = useState<number>();

  const fetchData = useCallback(async (page: number, pageSize: number) => {
    setLoading(true);
    try {
      const resp: ArticlePageData = await getArticleList(locale, selectedCategory, page, pageSize)
      if (page === 0) {
        setData(resp.data);
      } else {
        setData((prevData: Article[]) => [...prevData, ...resp.data]);
      }
      setMeta(resp.meta);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [locale, selectedCategory]);

  function loadMorePosts(): void {
    const nextPosts = meta!.pagination.page + meta!.pagination.pageSize;
    fetchData(nextPosts, Number(env("NEXT_PUBLIC_PAGE_LIMIT")));
  }

  useEffect(() => {
    fetchData(0, Number(env("NEXT_PUBLIC_PAGE_LIMIT")));
  }, [fetchData]);

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-[300px]">
      <Loader/>
    </div>
  );

  const firstArticle = data[0];
  const loweredLocale = locale.toLowerCase();

  return (
    <>
      {/* Category Filter */}
      <section
        className="mb-12 py-4"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {categoryStrList.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </section>

      {/* Featured Article */}
      {data.length > 0 && (
        <motion.section
          className="mb-20"
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          transition={{duration: 0.6, delay: 0.2}}
        >
          <h2 className="sr-only">Featured Article</h2>
          <motion.article
            className="bg-white rounded-xl overflow-hidden shadow-xl transition-all duration-300 border border-gray-100"
            whileHover={{
              scale: 1.02,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
          >
            <div className="md:flex">
              <div className="md:w-1/2 overflow-hidden">
                <motion.div
                  whileHover={{scale: 1.05}}
                  transition={{duration: 0.5}}
                  className="h-full"
                >
                  <Image
                    src={firstArticle.cover.url}
                    alt={firstArticle.title}
                    className="h-full w-full object-contain transition-transform duration-700"
                    width={800}
                    height={600}
                  />
                </motion.div>
              </div>
              <div className="md:w-1/2 px-8 py-5 flex flex-col justify-center">
                <span
                  className="text-indigo-600 text-sm font-semibold uppercase bg-indigo-50 px-3 py-1 rounded-full mr-auto"
                >
                  {firstArticle.category.name ? firstArticle.category.name : ''}
                </span>
                <motion.h3
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.3, delay: 0.4}}
                  className="mt-4 text-3xl font-bold leading-tight text-gray-900"
                >
                  <Link title={firstArticle.title} href={`/articles/${firstArticle.slug}`}
                        className="hover:text-indigo-600 transition-colors" locale={locale}>
                    {firstArticle.title}
                  </Link>
                </motion.h3>
                <motion.p
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.3, delay: 0.5}}
                  className="mt-5 text-gray-600 leading-relaxed"
                >
                  {firstArticle.excerpt}
                </motion.p>
                <motion.div
                  initial={{opacity: 0, y: 10}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.3, delay: 0.6}}
                  className="mt-8 flex items-center"
                >
                  <div className="flex-shrink-0">
                    <span className="sr-only">{firstArticle.author.name}</span>
                    <div
                      className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold shadow-sm">
                      {firstArticle.author.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">{firstArticle.author.name}</p>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime="2023-11-15">{formatDateOnlyMonth(firstArticle.publishedAt, locale)}</time>
                      <span aria-hidden="true">&middot;</span>
                      <span>{readingTime(JSON.stringify(firstArticle.description, null, 2), 125, supportedLanguages.includes(loweredLocale as any) ? loweredLocale as SupportedLanguages : "en").text}</span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.article>
        </motion.section>
      )}

      {/* Article Grid */}
      <motion.section
        className="mb-16"
        initial={{opacity: 0, y: 20}}
        animate={{opacity: 1, y: 0}}
        transition={{duration: 0.6, delay: 0.3}}
      >
        <h2 className="text-2xl font-bold mb-10 border-b pb-4">More Articles</h2>
        {data.length <= 1 ? (
          <motion.p
            className="text-center text-gray-600 py-10 bg-gray-50 rounded-lg"
            initial={{opacity: 0}}
            animate={{opacity: 1}}
            transition={{duration: 0.5}}
          >
            No additional articles found in this category.
          </motion.p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.slice(1).map((article) => (
              <motion.article
                key={article.id}
                className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100"
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5}}
                whileHover={{y: -5}}
                onMouseEnter={() => setHoveredArticleId(article.id)}
                onMouseLeave={() => setHoveredArticleId(-1)}
              >
                <Link href={`/articles/${article.slug}`} title={article.title}
                      className="block relative overflow-hidden"
                      locale={locale}>
                  <motion.div
                    animate={{
                      scale: hoveredArticleId === article.id ? 1.05 : 1
                    }}
                    transition={{duration: 0.5}}
                  >
                    <Image
                      src={article.cover.url}
                      alt={article.title}
                      className="w-full h-56 object-cover"
                      width={400}
                      height={300}
                    />
                  </motion.div>
                  <div
                    className="absolute top-0 right-0 m-3 px-3 py-1 bg-white bg-opacity-90 text-xs font-medium rounded-full text-indigo-600 shadow-sm">
                    {article.category ? article.category.name : ''}
                  </div>
                </Link>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    <Link href={`/articles/${article.slug}`} title={article.title}
                          className="hover:text-indigo-600 transition-colors" locale={locale}>
                      {article.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm line-clamp-5">{article.excerpt}</p>
                  <div className="flex items-center justify-between border-t pt-4 mt-4">
                    <span className="text-sm text-gray-500">
                      <time dateTime={article.publishedAt}>
                        {formatDate(article.publishedAt, locale)}
                      </time>
                    </span>
                    <span className="text-sm font-medium text-indigo-600">By {article.author.name}</span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </motion.section>

      {/* Load More Button */}
      {meta && meta.pagination.page + meta.pagination.pageSize < meta.pagination.total && (
        <motion.div
          className="mt-12 text-center"
          initial={{opacity: 0, y: 10}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.4, delay: 0.2}}
        >
          <motion.button
            onClick={loadMorePosts}
            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
            disabled={isLoading}
            whileHover={{scale: 1.05}}
            whileTap={{scale: 0.95}}
          >
            {isLoading ? 'Loading...' : 'Load More Articles'}
          </motion.button>
        </motion.div>
      )}
    </>
  )
}