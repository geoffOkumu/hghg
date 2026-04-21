"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import toast from "react-hot-toast";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [status, setStatus] = useState("draft");
  const [sendNewsletter, setSendNewsletter] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, excerpt, status, sendNewsletter }),
      });

      if (!res.ok) {
        const data = await res.json();
        toast.error(data.error || "Failed to create article");
        return;
      }

      toast.success(
        status === "published"
          ? sendNewsletter
            ? "Article published and newsletter sent!"
            : "Article published!"
          : "Draft saved!"
      );
      router.push("/admin/articles");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">New Article</h1>
        <p className="text-gray-500 mt-1">
          Write a new article. Use Markdown for formatting.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <Input
                label="Title"
                placeholder="Article title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Card>

            <Card>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="content">
                Content (Markdown)
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your article content here... Markdown is supported."
                className="w-full h-96 px-3 py-2 border border-gray-300 rounded shadow-sm text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono resize-y"
                required
              />
            </Card>

            <Card>
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="excerpt">
                Excerpt (optional)
              </label>
              <textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                placeholder="Short summary of the article (auto-generated from content if left blank)"
                className="w-full h-24 px-3 py-2 border border-gray-300 rounded shadow-sm text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-y"
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Publish Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded shadow-sm text-sm transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="sendNewsletter"
                    checked={sendNewsletter}
                    onChange={(e) => setSendNewsletter(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label
                    htmlFor="sendNewsletter"
                    className="text-sm text-gray-700"
                  >
                    Send newsletter on publish
                  </label>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                Actions
              </h3>
              <div className="space-y-2">
                <Button type="submit" className="w-full" loading={loading}>
                  {status === "published" ? "Publish Article" : "Save Draft"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={() => router.push("/admin/articles")}
                >
                  Cancel
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
