"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
            💯 Knowledge Tracing Leaderboard
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link 
                  href="/" 
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive("/") ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
                  }`}
                >
                  Leaderboard
                </Link>
                <Link 
                  href="/about" 
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive("/about") ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
                  }`}
                >
                  About
                </Link>
                <Link 
                  href="/submit" 
                  className={`px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 ${
                    isActive("/submit") ? "bg-gray-100 dark:bg-gray-800 font-medium" : ""
                  }`}
                >
                  Submit
                </Link>
              </div>
            </div>
          </div>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </nav>
  );
} 