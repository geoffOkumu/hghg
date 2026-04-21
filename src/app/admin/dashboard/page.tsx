"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { format } from "date-fns";

interface Stats {
  totalSubscribers: number;
  activeSubscribers: number;
  totalArticles: number;
  publishedArticles: number;
  totalViews: number;
  totalEmailsSent: number;
  recentSubscribers: Array<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
  }>;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <LoadingSpinner size="lg" />;

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load dashboard data.</p>
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Subscribers",
      value: stats.totalSubscribers,
      subtext: `${stats.activeSubscribers} active`,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      label: "Total Articles",
      value: stats.totalArticles,
      subtext: `${stats.publishedArticles} published`,
      color: "text-blue-600",
      bg: "bg-blue-50",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      subtext: "All time",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      label: "Emails Sent",
      value: stats.totalEmailsSent,
      subtext: "Successfully delivered",
      color: "text-orange-600",
      bg: "bg-orange-50",
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">
          Welcome to the Holy Ghost House of God admin panel.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <div
              className="flex items-start gap-4"
              aria-label={`${stat.label}: ${stat.value}`}
            >
              <div
                className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center shrink-0 ${stat.color}`}
                aria-hidden="true"
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900" aria-hidden="true">{stat.value}</p>
                <p className="text-sm font-medium text-gray-600" aria-hidden="true">{stat.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{stat.subtext}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Subscribers */}
      <Card>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Subscribers
        </h2>
        {stats.recentSubscribers.length === 0 ? (
          <p className="text-gray-500 text-sm">No subscribers yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2 font-medium text-gray-500">
                    Name
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">
                    Email
                  </th>
                  <th className="text-left py-3 px-2 font-medium text-gray-500">
                    Joined
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.recentSubscribers.map((sub) => (
                  <tr key={sub.id} className="border-b border-gray-100">
                    <td className="py-3 px-2 text-gray-900">
                      {sub.firstName} {sub.lastName}
                    </td>
                    <td className="py-3 px-2 text-gray-600">{sub.email}</td>
                    <td className="py-3 px-2 text-gray-500">
                      {format(new Date(sub.createdAt), "MMM d, yyyy")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
