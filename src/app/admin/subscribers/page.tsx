"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Pagination } from "@/components/ui/Pagination";
import { format } from "date-fns";
import toast from "react-hot-toast";

interface Subscriber {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  active: boolean;
  createdAt: string;
  lists: Array<{ list: { id: string; name: string } }>;
}

interface PaginationInfo {
  page: number;
  totalPages: number;
  total: number;
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    totalPages: 1,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: "20",
        });
        if (search) params.set("search", search);

        const res = await fetch(`/api/admin/subscribers?${params}`);
        const data = await res.json();
        if (!cancelled) {
          setSubscribers(data.subscribers);
          setPagination(data.pagination);
        }
      } catch {
        if (!cancelled) toast.error("Failed to fetch subscribers");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [search, currentPage, refreshKey]);

  const refreshSubscribers = () => {
    setCurrentPage(1);
    setRefreshKey((k) => k + 1);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subscriber?")) return;

    try {
      const res = await fetch(`/api/admin/subscribers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        toast.error("Failed to delete subscriber");
        return;
      }

      toast.success("Subscriber deleted");
      refreshSubscribers();
    } catch {
      toast.error("Failed to delete subscriber");
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddLoading(true);

    try {
      const res = await fetch("/api/admin/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: newFirstName,
          lastName: newLastName,
          email: newEmail,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to add subscriber");
        return;
      }

      toast.success("Subscriber added!");
      setShowAddModal(false);
      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
      refreshSubscribers();
    } catch {
      toast.error("Failed to add subscriber");
    } finally {
      setAddLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
          <p className="text-gray-500 mt-1">
            Manage your newsletter subscribers. Total: {pagination.total}
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Subscriber
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
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
      ) : subscribers.length === 0 ? (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500">
              {search ? "No subscribers found matching your search." : "No subscribers yet."}
            </p>
          </div>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Email
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Status
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-500">
                      Joined
                    </th>
                    <th className="text-right py-3 px-4 font-medium text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {subscribers.map((sub) => (
                    <tr
                      key={sub.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <span className="font-medium text-gray-900">
                          {sub.firstName} {sub.lastName}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{sub.email}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            sub.active
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {sub.active ? "Active" : "Unsubscribed"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">
                        {format(new Date(sub.createdAt), "MMM d, yyyy")}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end">
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDelete(sub.id)}
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
          <Pagination
            currentPage={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}

      {/* Add Subscriber Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add Subscriber"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="First Name"
            placeholder="John"
            value={newFirstName}
            onChange={(e) => setNewFirstName(e.target.value)}
            required
          />
          <Input
            label="Last Name"
            placeholder="Doe"
            value={newLastName}
            onChange={(e) => setNewLastName(e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1" loading={addLoading}>
              Add Subscriber
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={() => setShowAddModal(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
