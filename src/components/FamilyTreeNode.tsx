'use client';

import { Person } from '@/types';
import { getYearOnly } from '@/lib/family-utils';
import { User } from 'lucide-react';

interface FamilyTreeNodeProps {
  person: Person;
  onClick?: () => void;
  isSelected?: boolean;
}

export default function FamilyTreeNode({ person, onClick, isSelected }: FamilyTreeNodeProps) {
  const birthYear = getYearOnly(person.birthDate);
  const deathYear = person.deathDate && person.deathDate !== "Còn sống" ? getYearOnly(person.deathDate) || null : null;
  const yearRange = deathYear ? `${birthYear} - ${deathYear}` : `b. ${birthYear}`;

  return (
    <div
      onClick={onClick}
      className={`
        px-3 py-2 rounded-lg border-2 bg-white cursor-pointer
        transition-all duration-200 shadow-sm hover:shadow-md
        ${isSelected 
          ? 'border-amber-600 ring-2 ring-amber-300 bg-amber-50' 
          : 'border-slate-200 hover:border-amber-400'
        }
      `}
    >
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mb-2 mx-auto">
        {person.avatarUrl ? (
          <img
            src={person.avatarUrl}
            alt={person.fullName}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <User className="w-6 h-6 text-amber-700" />
        )}
      </div>

      {/* Name */}
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-900 leading-tight">
          {person.fullName}
        </p>
        <p className="text-xs text-slate-500 mt-1">
          {yearRange}
        </p>
      </div>
    </div>
  );
}
