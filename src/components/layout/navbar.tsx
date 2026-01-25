'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Trophy, UserRoundPen } from 'lucide-react';
import { cn } from '@/utils/helpers/cn';

const navItems = [
  {
    name: 'Home',
    href: '/',
    icon: House,
  },
  {
    name: 'Honors',
    href: '/honors',
    icon: Trophy,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: UserRoundPen,
  },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed -bottom-0.5 left-1/2 -translate-x-1/2 w-full max-w-lg z-50">
      <div
        className={cn(
          'h-21 px-8 pt-5 pb-5',
          'rounded-t-[35px] bg-white/70',
          'shadow-[0px_-3px_10px_0px_rgba(0,0,0,0.15)]',
          'backdrop-blur-xl'
        )}
      >
        <div className="flex items-center justify-around gap-6 h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center gap-1',
                  'w-22 h-fit py-1.5',
                  'transition-colors'
                )}
              >
                <Icon
                  className={cn(
                    'w-6 h-6',
                    active ? 'text-blue-500' : 'text-black'
                  )}
                />
                <span
                  className={cn(
                    'font-sf-medium text-sm leading-5 tracking-[-0.02em] text-center',
                    active ? 'text-blue-500' : 'text-black'
                  )}
                >
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}