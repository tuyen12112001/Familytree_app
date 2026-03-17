'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, User } from 'lucide-react';
import { mockPeople, searchPeople } from '@/data/mock-family';
import { Person } from '@/types';
import { formatDate } from '@/lib/family-utils';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Person[]>([]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim()) {
      setResults(searchPeople(searchQuery));
    } else {
      setResults([]);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tìm Kiếm Thành Viên</h1>
        <p className="text-slate-600">Tìm kiếm thành viên trong dòng họ Nguyễn</p>
      </div>

      {/* Search Box */}
      <div className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Nhập tên thành viên..."
            value={query}
            onChange={e => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
          />
        </div>
      </div>

      {/* Results */}
      {query.trim() ? (
        <div>
          {results.length > 0 ? (
            <div>
              <p className="text-sm text-slate-600 mb-4">
                Tìm thấy <strong>{results.length}</strong> kết quả
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(person => (
                  <Link
                    key={person.id}
                    href={`/people/${person.id}`}
                    className="block p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow hover:border-amber-300 bg-white"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center flex-shrink-0">
                        <User className="w-6 h-6 text-amber-700" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 text-lg">{person.fullName}</h3>
                        <p className="text-sm text-slate-600">
                          Sinh: {new Date(person.birthDate).getFullYear()}
                          {person.deathDate && ` - Mất: ${new Date(person.deathDate).getFullYear()}`}
                        </p>
                        {person.birthPlace && (
                          <p className="text-sm text-slate-500">📍 {person.birthPlace}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <SearchIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Không tìm thấy thành viên nào</p>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-16">
          <SearchIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-600 text-lg">Nhập tên để bắt đầu tìm kiếm</p>
        </div>
      )}
    </div>
  );
}
