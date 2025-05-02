"use client";
import { useAuth } from "@/context/AuthContext";
import { LayoutDashboard, LogOut } from "lucide-react";
import React from "react";
import Button from "../ui/Button";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

const Header = () => {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <LayoutDashboard className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                File Manager
              </span>
            </div>
          </div>

          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="flex items-center space-x-2 focus:outline-none">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-200">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </span>
              </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
              className="z-50 min-w-[200px] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-md shadow-md p-2"
              sideOffset={8}
              align="end"
            >
              <div className="px-2 py-1">
                <div className="text-base font-medium text-gray-800 dark:text-white">
                  {user?.name || "User"}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email || "user@example.com"}
                </div>
              </div>

              <DropdownMenu.Separator className="my-2 h-px bg-gray-200 dark:bg-gray-600" />

              <DropdownMenu.Item asChild>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full inline-flex items-center justify-start text-sm"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        </div>
      </div>
    </header>
  );
};

export default Header;
