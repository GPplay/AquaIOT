'use client';

import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, Settings, Bell, Wifi, User } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/header";
import Link from "next/link";
import { usePathname } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path || (path !== '/dashboard' && pathname.startsWith(path));

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image src="/logo.png" alt="AquaGuard Logo" width={32} height={32} />
            <h1 className="font-headline text-xl font-semibold text-primary">AquaGuard</h1>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} href="/dashboard" isActive={pathname === '/dashboard'} tooltip="Panel de Control">
                <LayoutDashboard />
                Panel de Control
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} href="/dashboard/sensors" isActive={isActive('/dashboard/sensors')} tooltip="Dispositivos ESP">
                <Wifi />
                Dispositivos ESP
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} href="/dashboard/alerts" isActive={isActive('/dashboard/alerts')} tooltip="Alertas">
                <Bell />
                Alertas
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} href="/dashboard/profile" isActive={isActive('/dashboard/profile')} tooltip="Perfil">
                <User />
                Perfil
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton as={Link} href="/dashboard/settings" isActive={isActive('/dashboard/settings')} tooltip="Configuración">
                <Settings />
                Configuración
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
