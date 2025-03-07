'use client'
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import useFetchUser from "@/hooks/use-fetch-user"
import { createClient } from "@/lib/supabase/client"

// Menu items.
const items = [
  {
    title: "업체정보 설정",
    url: "/",
  },
  {
    title: "신규 주문",
    url: "/order",
  },
  {
    title: "주문 기록",
    url: "/record",
  },
  {
    title: "배송 확인",
    url: "/confirm",
  },
  {
    title: "결제",
    url: "/pay",
  },
  {
    title: '비밀번호 변경',
    url: '/change-password'
  }
]

export function AppSidebar() {
  const { signOut } = useFetchUser()
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>FAABS ORDER</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <div className="cursor-pointer" onClick={signOut}>Log out</div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
