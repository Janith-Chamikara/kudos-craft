'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Users, BarChart, Settings, MessageSquare } from 'lucide-react';

const sidebarItems = [
  { icon: Home, label: 'Overview', href: '/dashboard' },
  { icon: Users, label: 'Workspaces', href: '/dashboard/workspaces' },
  {
    icon: MessageSquare,
    label: 'Testimonials',
    href: '/dashboard/testimonials',
  },
  { icon: BarChart, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="md:w-64 bg-card border-r">
      <nav className="p-4">
        <ul className="space-y-2">
          {sidebarItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-2 rounded-lg hover:bg-accent ${
                  pathname === item.href ? 'bg-accent' : ''
                }`}
              >
                <item.icon className="h-5 w-5 md:mr-3" />
                <span className="hidden md:block">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
