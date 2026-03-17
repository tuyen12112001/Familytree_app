export type Gender = 'male' | 'female' | 'other';

export interface Person {
  id: string;
  fullName: string;
  gender: Gender;
  birthDate: string; // YYYY-MM-DD
  deathDate?: string; // YYYY-MM-DD
  birthPlace?: string;
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
