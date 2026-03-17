'use client';

import { Person } from '@/types';
import { formatDate, getGenderDisplay, calculateAge, getRelationship } from '@/lib/family-utils';
import { X } from 'lucide-react';

interface PersonDetailPanelProps {
  person: Person;
  peopleMap: Map<string, Person>;
  onClose: () => void;
}

export default function PersonDetailPanel({
  person,
  peopleMap,
  onClose,
}: PersonDetailPanelProps) {
  const age = calculateAge(person.birthDate, person.deathDate);
  const isDead = !!person.deathDate;

  // Lấy thành viên gia đình
  const father = person.fatherId ? peopleMap.get(person.fatherId) : null;
  const mother = person.motherId ? peopleMap.get(person.motherId) : null;
  const spouses = person.spouseIds.map(id => peopleMap.get(id)).filter(Boolean) as Person[];
  const children = person.childIds.map(id => peopleMap.get(id)).filter(Boolean) as Person[];

  return (
    <div className="w-80 bg-white border-l border-slate-200 shadow-lg overflow-y-auto h-screen fixed right-0 top-16 z-40">
      {/* Header */}
      <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-amber-600 text-white p-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Hồ Sơ Cá Nhân</h2>
        <button
          onClick={onClose}
          className="p-1 hover:bg-amber-700 rounded transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Avatar */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl text-amber-700">👤</span>
          </div>

          {/* Basic Info */}
          <h1 className="text-2xl font-bold text-slate-900">{person.fullName}</h1>
          <p className="text-sm text-slate-500 mt-1">
            {getGenderDisplay(person.gender)} · {age} tuổi
          </p>
        </div>

        {/* Status */}
        {isDead && (
          <div className="bg-slate-100 border border-slate-300 rounded-lg p-3 mb-6 text-center">
            <p className="text-sm font-medium text-slate-700">
              Đã mất {formatDate(person.deathDate!)}
            </p>
          </div>
        )}

        {/* Basic Information */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
            Thông Tin Cơ Bản
          </h3>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-slate-500">Ngày sinh</dt>
              <dd className="text-slate-900 font-medium">{formatDate(person.birthDate)}</dd>
            </div>
            {person.birthPlace && (
              <div>
                <dt className="text-slate-500">Nơi sinh</dt>
                <dd className="text-slate-900 font-medium">{person.birthPlace}</dd>
              </div>
            )}
            {person.deathDate && (
              <div>
                <dt className="text-slate-500">Ngày mất</dt>
                <dd className="text-slate-900 font-medium">{formatDate(person.deathDate)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Biography */}
        {person.biography && (
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-2 uppercase tracking-wide">
              Tiểu Sử
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">{person.biography}</p>
          </div>
        )}

        {/* Family Information */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-3 uppercase tracking-wide">
            Quan Hệ Gia Đình
          </h3>
          <div className="space-y-3">
            {/* Parents */}
            {(father || mother) && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">Bố Mẹ</p>
                <div className="space-y-1">
                  {father && (
                    <p className="text-sm text-slate-700">
                      👨 <span className="font-medium">{father.fullName}</span>
                    </p>
                  )}
                  {mother && (
                    <p className="text-sm text-slate-700">
                      👩 <span className="font-medium">{mother.fullName}</span>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Spouses */}
            {spouses.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  {spouses.length === 1 ? 'Vợ/Chồng' : 'Vợ/Chồng'}
                </p>
                <div className="space-y-1">
                  {spouses.map(spouse => (
                    <p key={spouse.id} className="text-sm text-slate-700">
                      {spouse.gender === 'male' ? '👨' : '👩'}{' '}
                      <span className="font-medium">{spouse.fullName}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Children */}
            {children.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-500 mb-1">
                  {children.length === 1 ? 'Con' : 'Con cái'}
                </p>
                <div className="space-y-1">
                  {children.map(child => (
                    <p key={child.id} className="text-sm text-slate-700">
                      {child.gender === 'male' ? '👦' : '👧'}{' '}
                      <span className="font-medium">{child.fullName}</span>
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Full Profile Button */}
        <button className="w-full py-2 px-4 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors">
          Xem Hồ Sơ Đầy Đủ
        </button>
      </div>
    </div>
  );
}
