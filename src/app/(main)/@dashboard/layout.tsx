"use client";
import { Sidebar, SidebarBody, SidebarLink } from "./sidebar";
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
import EspressoPage from "./espresso/create/page";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    {
      label: "DASHBOARD",
      href: "/",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Espresso Setting",
      href: "/espresso",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "주문",
      href: "/order",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "취소 주문",
      href: "/order-cancel",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "상품 카테고리 설정",
      href: "/category",
      icon: (
        <IconBrandProducthunt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "상품 설정",
      href: "/product",
      icon: (
        <IconBrandProducthunt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "고객 리스트",
      href: "/user",
      icon: (
        <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "배송지 설정",
      href: "/depart",
      icon: (
        <IconSettings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [type, setType] = useState<number | null>(1);

  useEffect(() => {
    const type = localStorage.getItem("type") ?? "1";
    setType(Number(type));
  }, []);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "min-h-screen" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Logo />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={`sidebar${idx}`} link={link} />
              ))}
              {type === 2 && <SidebarLink link={{
                label: '주문확인',
                href: '/apply',
                icon: <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
              }} />}
            </div>
          </div>
          <Button onClick={() => signOut()}>LOG OUT</Button>
        </SidebarBody>
      </Sidebar>
      <div className="flex flex-1 h-full">
        <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full min-h-screen justify-between h-full overflow-y-auto">
          {children}
        </div>
      </div>
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

