"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Article {
  id: string;
  title: string;
  status: string;
  sendNewsletter: boolean;
  newsletterSent: boolean;
  publishedAt: string | null;
  createdAt: string;
  _count: { views: number; emailLogs: number };
}

interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: pagination.page.toString(), limit: "20" });
        if (statusFilter) params.set("status", statusFilter);

        const res = await fetch(`/api/admin/articles?${params}`);
        const data = await res.json();
        if (!cancelled) {
          setArticles(data.articles);
          setPagination(data.pagination);
        }
      } catch {
        if (!cancelled) toast.error("Failed to fetch articles");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, refreshKey]);

  const refreshArticles = () => setRefreshKey((k) => k + 1);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete article");
        return;
      }

      toast.success("Article deleted");
      refreshArticles();
    } catch {
      toast.error("Failed to delete article");
    }
  };

  const handleSendNewsletter = async (id: string) => {
    if (!confirm("Send newsletter for this article to all subscribers?")) return;

    try {
      const res = await fetch(`/api/admin/articles/${id}/send-newsletter`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to send newsletter");
        return;
      }

      toast.success(data.message);
      refreshArticles();
    } catch {
      toast.error("Failed to send newsletter");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-500 mt-1">
            Manage your articles and newsletters.
          </p>
        </div>
        <Link href="/admin/articles/new">
          <Button>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Article
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {["", "draft", "published"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
              statusFilter === status
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-white text-gray-600 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            {status === "" ? "All" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : articles.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">No articles found.</p>
            <Link href="/admin/articles/new" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium mt-2 inline-block transition-colors duration-150">
              Create your first article →
            </Link>
          </div>
        </Card>
      ) : (
        <Card className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Views</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Newsletter</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {articles.map((article) => (
                  <tr key={article.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-900">{article.title}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          article.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{article._count.views}</td>
                    <td className="py-3 px-4">
                      {article.newsletterSent ? (
                        <span className="text-green-600 text-xs font-medium">Sent ({article._count.emailLogs})</span>
                      ) : article.sendNewsletter ? (
                        <span className="text-yellow-600 text-xs font-medium">Pending</span>
                      ) : (
                        <span className="text-gray-400 text-xs">Disabled</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-500">
                      {format(new Date(article.createdAt), "MMM d, yyyy")}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/articles/${article.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            Edit
                          </Button>
                        </Link>
                        {article.status === "published" && !article.newsletterSent && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleSendNewsletter(article.id)}
                          >
                            Send
                          </Button>
                        )}
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleDelete(article.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
