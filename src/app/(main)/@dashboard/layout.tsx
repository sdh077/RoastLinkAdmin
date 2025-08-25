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
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, sidebarProps } from "@/components/app-sidebar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links: sidebarProps = [
    {
      label: "DASHBOARD",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: []
    },
    {
      label: "Espresso Setting",
      href: "/espresso",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: [{
        label: "은평",
        href: "/espresso/ep",
        icon: (
          <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        children: []
      },
      {
        label: "온선재",
        href: "/espresso/os",
        icon: (
          <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
        ),
        children: []
      },]
    },
    {
      label: "주문",
      href: "/order",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: [
        {
          label: "주문 내역",
          href: "/order",
          icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
          children: []
        },
        {
          label: "취소 주문 내역",
          href: "/order-cancel",
          icon: (
            <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
          children: []
        },
      ]
    },
    {
      label: "상품",
      href: "/",
      icon: (
        <IconBrandProducthunt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: [
        {
          label: "상품 카테고리 설정",
          href: "/category",
          icon: (
            <IconBrandProducthunt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
          children: []
        },
        {
          label: "상품 설정",
          href: "/product",
          icon: (
            <IconBrandProducthunt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
          ),
          children: []
        },
      ]
    },
    {
      label: "고객 리스트",
      href: "/user",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: []
    },
    {
      label: "직원 관리",
      href: "/employee",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: []
    },
    {
      label: "배송지 설정",
      href: "/depart",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      children: []
    },
  ];
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen p-4" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <SidebarProvider>
        <AppSidebar links={links} />
        <div className="flex flex-1 h-full">
          <div className="p-2 md:p-10 rounded-2xl border  dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full min-h-screen justify-between h-full overflow-y-auto">
            <SidebarTrigger />
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

