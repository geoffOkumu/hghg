"use client";

import { useState, useEffect, useCallback } from "react";
import { ArticleCard } from "./ArticleCard";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface Article {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  _count: { views: number };
}

interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

export function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArticles = useCallback(async (page: number, searchQuery: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "6",
      });
      if (searchQuery) params.set("search", searchQuery);

      const res = await fetch(`/api/articles?${params}`);
      const data = await res.json();

      setArticles(data.articles);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Failed to fetch articles:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles(1, search);
  }, [fetchArticles, search]);

  const handlePageChange = (page: number) => {
    fetchArticles(page, search);
    window.scrollTo({ top: document.getElementById("articles")?.offsetTop || 0, behavior: "smooth" });
  };

  return (
    <section id="articles" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Latest Articles</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-full sm:w-64"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {search
                ? "No articles found matching your search."
                : "No articles published yet. Check back soon!"}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  id={article.id}
                  title={article.title}
                  excerpt={article.excerpt}
                  publishedAt={article.publishedAt}
                  viewCount={article._count.views}
                />
              ))}
            </div>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          </>
        )}
      </div>
    </section>
  );
}
