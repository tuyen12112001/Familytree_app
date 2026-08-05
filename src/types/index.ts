export type Gender = 'male' | 'female' | 'other';

export interface Person {
  id: string;
  fullName: string;
  gender: Gender;
  birthDate: string; // Năm-Tháng-Ngày
  deathDate?: string; // Năm-Tháng-Ngày
  birthPlace?: string;
  zodiac?: string; // Can Chi năm sinh (ví dụ: Giáp Tý, Ất Sửu...)
  biography?: string;
  avatarUrl?: string;
  fatherId?: string;
  motherId?: string;
  spouseIds: string[];
  childIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Relationship {
  id: string;
  personId: string;
  relationType: 'father' | 'mother' | 'spouse' | 'child';
  relatedPersonId: string;
  createdAt: string;
}

export interface FamilyTreeNode {
  id: string;
  person: Person;
  generation: number;
  x?: number;
  y?: number;
}
