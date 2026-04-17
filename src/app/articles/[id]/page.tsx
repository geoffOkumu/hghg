"use client";

import { useState, useEffect, use } from "react";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

interface Article {
  id: string;
  title: string;
  content: string;
  publishedAt: string | null;
  _count: { views: number };
}

export default function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) {
          setError("Article not found");
          return;
        }
        const data = await res.json();
        setArticle(data);

        // Track view
        fetch(`/api/articles/${id}/views`, { method: "POST" }).catch(() => {});
      } catch {
        setError("Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {error || "Article not found"}
            </h1>
            <Link
              href="/"
              className="text-violet-600 hover:text-violet-700 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-500 hover:text-violet-600 mb-8"
          >
            <svg
              className="mr-1 w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Articles
          </Link>

          <header className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              {article.publishedAt && (
                <time dateTime={article.publishedAt}>
                  {format(new Date(article.publishedAt), "MMMM d, yyyy")}
                </time>
              )}
              <span>·</span>
              <span>{article._count.views} views</span>
            </div>
          </header>

          <div className="prose max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {article.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
