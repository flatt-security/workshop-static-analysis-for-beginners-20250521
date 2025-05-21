"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

interface NavBarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
    tenantName: string;
  };
}

export function NavBar({ user }: NavBarProps) {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">
            {user.tenantName} - TODO App
          </h1>
          <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            {user.role}
          </span>
        </div>
        <nav className="flex items-center space-x-4">
          <Link
            href="/dashboard"
            className={`px-3 py-2 text-sm font-medium ${
              isActive("/dashboard")
                ? "text-blue-600"
                : "text-gray-700 hover:text-blue-600"
            }`}
          >
            Dashboard
          </Link>
          {(user.role === "OWNER" || user.role === "MANAGER") && (
            <Link
              href="/users"
              className={`px-3 py-2 text-sm font-medium ${
                isActive("/users")
                  ? "text-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              User Management
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => signOut({ callbackUrl: "/auth/login" })}
          >
            Logout
          </Button>
        </nav>
      </div>
    </header>
  );
}
