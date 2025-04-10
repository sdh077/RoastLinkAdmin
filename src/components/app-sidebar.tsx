'use client'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import { ChevronDown } from "lucide-react"
import { IconBrandTabler, IconBrandProducthunt, IconUserBolt, IconSettings } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { signOut } from "@/hooks/use-fetch-user";

export function AppSidebar() {
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
        },
      ]
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
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            FAABS COFFEE
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {type === 2 &&
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <a href={'/apply'}>
                  <IconUserBolt className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  <span>상담신청</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>}
          {links.map(link =>
            link.children ?
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton >
                  {link.label}
                </SidebarMenuButton>
                <SidebarMenuSub>
                  {link.children.map(item =>
                    <SidebarMenuSubItem key={item.label}>
                      <SidebarMenuSubButton asChild>
                        <a href={item.href}>
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  )}
                </SidebarMenuSub>
              </SidebarMenuItem>

              :
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton asChild>
                  <a href={link.href}>
                    {link.icon}
                    <span>{link.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button onClick={() => signOut()}>LOG OUT</Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
