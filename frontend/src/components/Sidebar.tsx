"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true);

  const isActive = (path: string) => pathname === path;

  return (
    <nav
      className={`h-full bg-white shadow-sm relative transition-all duration-300 ease-in-out  ${
        isCollapsed ? "w-[4rem]" : "w-64"
      }`}
    >
      <div className="absolute right-0 top-5">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="bg-white cursor-pointer mr-4 rounded-full p-1.5 shadow-sm hover:bg-gray-50 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeftIcon className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>
      <div className="pt-28 px-4">
        <div className="space-y-4">
          <Link
            href="/"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
              isActive("/") && !isCollapsed ? "bg-blue-50 " : "hover:bg-gray-50"
            } ${isActive("/") ? "text-blue-600" : ""}`}
          >
            <CalendarDaysIcon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              Appointments
            </span>
          </Link>
          <Link
            href="/vetbot"
            className={`flex items-center gap-3 px-2 py-2 rounded-lg transition-colors ${
              isActive("/vetbot") && !isCollapsed
                ? "bg-blue-50 "
                : "hover:bg-gray-50"
            } ${isActive("/vetbot") ? "text-blue-600" : ""}`}
          >
            <ChatBubbleLeftRightIcon className="w-5 h-5 flex-shrink-0" />
            <span
              className={`transition-opacity duration-300 ${
                isCollapsed ? "opacity-0 w-0" : "opacity-100"
              }`}
            >
              VetBot
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
