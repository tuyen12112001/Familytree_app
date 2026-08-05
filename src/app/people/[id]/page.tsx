'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Person } from '@/types';
import { formatDate, calculateAge, getGenderDisplay } from '@/lib/family-utils';

export default function PersonPage() {
  const params = useParams();
  const router = useRouter();
  const personId = params.id as string;

  const [person, setPerson] = useState<Person | null>(null);
  const [allPeople, setAllPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // Fetch toàn bộ danh sách và tìm người theo ID
    fetch('/api/people')
      .then(res => res.json())
      .then((data: Person[]) => {
        setAllPeople(data);
        const found = data.find(p => p.id === personId);
        if (found) {
          setPerson(found);
        } else {
          setNotFound(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Lỗi khi tải dữ liệu:', err);
        setNotFound(true);
        setLoading(false);
      });
  }, [personId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-16">
          <p className="text-xl text-slate-400">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (notFound || !person) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại</span>
        </button>
        <div className="text-center py-16">
          <p className="text-xl text-slate-600">Không tìm thấy thành viên này</p>
        </div>
      </div>
    );
  }

  const peopleMap = new Map(allPeople.map(p => [p.id, p]));
  const age = calculateAge(person.birthDate, person.deathDate);
  const isDead = !!person.deathDate && person.deathDate !== "Còn sống";
  const father = person.fatherId ? peopleMap.get(person.fatherId) : null;
  const mother = person.motherId ? peopleMap.get(person.motherId) : null;
  const spouses = person.spouseIds.map(id => peopleMap.get(id)).filter(Boolean) as Person[];
  const children = person.childIds.map(id => peopleMap.get(id)).filter(Boolean) as Person[];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-amber-600 hover:text-amber-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Quay lại</span>
      </button>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8">
            {/* Name and Basic Info */}
            <div className="flex items-start space-x-6 mb-8">
              <div className="w-32 h-32 rounded-lg bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {person.avatarUrl ? (
                  <img
                    src={person.avatarUrl}
                    alt={person.fullName}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                ) : (
                  <User className="w-16 h-16 text-amber-700" />
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-slate-900">{person.fullName}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className="text-lg text-slate-600">{getGenderDisplay(person.gender)}</span>
                  <span className="text-lg text-slate-600">•</span>
                  <span className="text-lg text-slate-600">{age !== null ? `${age} tuổi` : 'Không rõ tuổi'}</span>
                </div>
                {isDead && (
                  <div className="mt-4 p-3 bg-slate-100 border border-slate-300 rounded">
                    <p className="text-sm font-medium text-slate-700">
                      Đã mất: {formatDate(person.deathDate!)}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Basic Information */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Thông Tin Cơ Bản</h2>
              <dl className="grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-semibold text-slate-500 uppercase">Ngày Sinh</dt>
                  <dd className="text-slate-900 font-medium text-lg mt-1">{formatDate(person.birthDate)}</dd>
                </div>
                {person.birthPlace && (
                  <div>
                    <dt className="text-sm font-semibold text-slate-500 uppercase">Nơi Sinh</dt>
                    <dd className="text-slate-900 font-medium text-lg mt-1">{person.birthPlace}</dd>
                  </div>
                )}
                {isDead && (
                  <div>
                    <dt className="text-sm font-semibold text-slate-500 uppercase">Ngày Mất</dt>
                    <dd className="text-slate-900 font-medium text-lg mt-1">
                      {formatDate(person.deathDate)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            {/* Biography */}
            {person.biography && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Tiểu Sử</h2>
                <p className="text-slate-600 leading-relaxed">{person.biography}</p>
              </div>
            )}
          </div>
        </div>

        {/* Family Info Sidebar */}
        <div>
          {/* Parents */}
          {(father || mother) && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Bố Mẹ</h3>
              <div className="space-y-3">
                {father && (
                  <Link
                    href={`/people/${father.id}`}
                    className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 flex items-center justify-center">
                      <span>👨</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{father.fullName}</p>
                      <p className="text-xs text-slate-500">{new Date(father.birthDate).getFullYear()}</p>
                    </div>
                  </Link>
                )}
                {mother && (
                  <Link
                    href={`/people/${mother.id}`}
                    className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-200 to-pink-300 flex items-center justify-center">
                      <span>👩</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{mother.fullName}</p>
                      <p className="text-xs text-slate-500">{new Date(mother.birthDate).getFullYear()}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Spouses */}
          {spouses.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {spouses.length === 1 ? 'Vợ/Chồng' : 'Những Người Yêu'}
              </h3>
              <div className="space-y-3">
                {spouses.map(spouse => (
                  <Link
                    key={spouse.id}
                    href={`/people/${spouse.id}`}
                    className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center">
                      <span>{spouse.gender === 'male' ? '👨' : '👩'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{spouse.fullName}</p>
                      <p className="text-xs text-slate-500">{new Date(spouse.birthDate).getFullYear()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Children */}
          {children.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                {children.length === 1 ? 'Con' : 'Con cái'} ({children.length})
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {children.map(child => (
                  <Link
                    key={child.id}
                    href={`/people/${child.id}`}
                    className="flex items-center space-x-3 p-3 border border-slate-200 rounded-lg hover:border-amber-300 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-200 to-green-300 flex items-center justify-center">
                      <span>{child.gender === 'male' ? '👦' : '👧'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-slate-900 truncate">{child.fullName}</p>
                      <p className="text-xs text-slate-500">{new Date(child.birthDate).getFullYear()}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
