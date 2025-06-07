"use client";
import {
  IconBrandProducthunt,
  IconBrandTabler,
  IconSettings,
  IconUserBolt,
} from "@tabler/icons-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import useFetchUser, { signOut } from "@/hooks/use-fetch-user";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Cookies from 'js-cookie'
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar-emp";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <SidebarProvider>
        <AppSidebar />
        <div className="flex flex-1 h-full">
          <div className="p-2 md:p-10 rounded-tl-2xl border  dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full min-h-screen justify-between h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
const Logo = () => {
  return (
    <Link
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      // className="font-medium text-black dark:text-white whitespace-pre"
      >
        Faabs Business Admin
      </motion.span>
    </Link>
  );
};

