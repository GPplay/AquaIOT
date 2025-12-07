'use client';

import { SidebarProvider, Sidebar, SidebarInset, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { LayoutDashboard, Settings, Bell, Wifi, User } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/header";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { AlertsProvider, useAlerts } from "@/hooks/use-alerts.tsx";
import { Badge } from "@/components/ui/badge";
import { DevicesProvider } from "@/hooks/use-devices";

function LayoutWithProviders({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { unreadCount } = useAlerts();

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
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 justify-center p-0">{unreadCount}</Badge>
                )}
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


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    return (
        <AlertsProvider>
            <DevicesProvider>
                <LayoutWithProviders>{children}</LayoutWithProviders>
            </DevicesProvider>
        </AlertsProvider>
    )
}
