import { BookmarkIcon, CompassIcon, ImportIcon } from 'lucide-react'

import { NavPrimary } from '@/components/web/nav-primary'
import { NavUser } from '@/components/web/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { Link, linkOptions } from '@tanstack/react-router'
import { useTheme } from '@/lib/theme-provider'
import { NavPrimaryProps, NavUserProps } from '@/lib/types'

const navItems: NavPrimaryProps['items'] = linkOptions([
  {
    title: 'Items',
    to: '/dashboard/items',
    icon: BookmarkIcon,
    activeOptions: {
      exact: false,
    },
  },
  {
    title: 'Import',
    to: '/dashboard/import',
    icon: ImportIcon,
    activeOptions: {
      exact: false,
    },
  },

  {
    title: 'Discover',
    to: '/dashboard/discover',
    icon: CompassIcon,
    activeOptions: {
      exact: false,
    },
  },
])

export function AppSidebar({ user }: NavUserProps) {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Link to="/" href="#">
              <img
                src="/logo.jpg"
                className="rounded-md"
                alt="Logo"
                width={200}
                height={200}
              />
            </Link>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavPrimary items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
