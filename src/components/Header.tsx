'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Trees, Search, Settings } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path ? 'border-b-2 border-amber-600 text-amber-900' : 'text-slate-600 hover:text-slate-900';
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo/Title */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-amber-600 rounded-lg flex items-center justify-center">
              <Trees className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg text-slate-900 hidden sm:inline">
              Cây Gia Phả
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-1 py-2 px-3 text-sm font-medium transition-colors ${isActive(
                '/'
              )}`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Trang Chủ</span>
            </Link>

            <Link
              href="/tree"
              className={`flex items-center space-x-1 py-2 px-3 text-sm font-medium transition-colors ${isActive(
                '/tree'
              )}`}
            >
              <Trees className="w-4 h-4" />
              <span className="hidden sm:inline">Cây Gia Phả</span>
            </Link>

            <Link
              href="/search"
              className={`flex items-center space-x-1 py-2 px-3 text-sm font-medium transition-colors ${isActive(
                '/search'
              )}`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Tìm Kiếm</span>
            </Link>

            <Link
              href="/admin"
              className={`flex items-center space-x-1 py-2 px-3 text-sm font-medium transition-colors ${isActive(
                '/admin'
              )}`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Quản Trị</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
