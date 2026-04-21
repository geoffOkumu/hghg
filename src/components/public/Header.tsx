"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-md flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">HG</span>
            </div>
            <span className="font-bold text-lg text-gray-900">
              Holy Ghost House of God
            </span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/"
              className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ease-in-out ${
                pathname === "/"
                  ? "text-indigo-700 bg-indigo-50"
                  : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
              }`}
              aria-current={pathname === "/" ? "page" : undefined}
            >
              Home
            </Link>
            <Link
              href="/admin/login"
              className="px-3 py-2 text-sm font-medium text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-all duration-200 ease-in-out"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
