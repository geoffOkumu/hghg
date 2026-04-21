import Link from "next/link";
import { format } from "date-fns";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string | null;
  publishedAt: string | null;
  viewCount: number;
}

export function ArticleCard({
  id,
  title,
  excerpt,
  publishedAt,
  viewCount,
}: ArticleCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 ease-in-out">
      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
        {publishedAt && (
          <time dateTime={publishedAt}>
            {format(new Date(publishedAt), "MMMM d, yyyy")}
          </time>
        )}
        <span aria-hidden="true">·</span>
        <span>{viewCount} views</span>
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">
        <Link
          href={`/articles/${id}`}
          className="hover:text-indigo-600 transition-colors duration-150"
        >
          {title}
        </Link>
      </h2>
      {excerpt && (
        <p className="text-gray-600 line-clamp-3 mb-4">{excerpt}</p>
      )}
      <Link
        href={`/articles/${id}`}
        className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors duration-150"
      >
        Read More
        <svg
          className="ml-1 w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </Link>
    </article>
  );
}
