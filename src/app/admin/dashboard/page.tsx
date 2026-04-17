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
      color: "text-violet-600",
      bg: "bg-violet-50",
    },
    {
      label: "Total Articles",
      value: stats.totalArticles,
      subtext: `${stats.publishedArticles} published`,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Total Views",
      value: stats.totalViews,
      subtext: "All time",
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      label: "Emails Sent",
      value: stats.totalEmailsSent,
      subtext: "Successfully delivered",
      color: "text-orange-600",
      bg: "bg-orange-50",
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
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-lg flex items-center justify-center`}>
                <span className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="text-xs text-gray-400">{stat.subtext}</p>
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
