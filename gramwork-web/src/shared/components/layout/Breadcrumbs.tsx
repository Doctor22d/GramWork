'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { Fragment } from 'react';

export function Breadcrumbs() {
  const pathname = usePathname();
  if (pathname === '/') return null;

  const segments = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center text-sm text-muted-foreground mb-4">
      <Link href="/" className="hover:text-foreground transition-colors flex items-center">
        <Home className="h-4 w-4" />
      </Link>
      
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`;
        const isLast = index === segments.length - 1;
        const name = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');

        return (
          <Fragment key={path}>
            <ChevronRight className="h-4 w-4 mx-1" />
            {isLast ? (
              <span className="font-medium text-foreground">{name}</span>
            ) : (
              <Link href={path} className="hover:text-foreground transition-colors">
                {name}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
