import { Person } from '@/types';

export const calculateAge = (birthDate: string, deathDate?: string): number => {
  const birth = new Date(birthDate);
  const end = deathDate ? new Date(deathDate) : new Date();
  
  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const getGenderDisplay = (gender: string): string => {
  const genderMap: Record<string, string> = {
    male: 'Nam',
    female: 'Nữ',
    other: 'Khác',
  };
  return genderMap[gender] || gender;
};

export const getYearOnly = (dateString: string): string => {
  const date = new Date(dateString);
  return date.getFullYear().toString();
};

export const calculateGeneration = (
  person: Person,
  peopleMap: Map<string, Person>
): number => {
  // Thế hệ 0 là thế hệ gốc
  // Tổ tiên có số thế hệ âm
  // Con cháu có số thế hệ dương
  
  const visited = new Set<string>();
  
  const getAncestorGeneration = (id: string): number => {
    if (visited.has(id)) return 0; // Avoid infinite loops
    visited.add(id);
    
    const p = peopleMap.get(id);
    if (!p) return 0;
    
    const fatherGen = p.fatherId ? getAncestorGeneration(p.fatherId) + 1 : 1;
    const motherGen = p.motherId ? getAncestorGeneration(p.motherId) + 1 : 1;
    
    return Math.max(fatherGen, motherGen);
  };
  
  return -getAncestorGeneration(person.id);
};

export const getRelationship = (
  person1: Person,
  person2: Person
): string | null => {
  if (person1.spouseIds.includes(person2.id)) {
    return person1.gender === 'male' ? 'Chồng' : 'Vợ';
  }
  
  if (person1.childIds.includes(person2.id)) {
    return person2.gender === 'male' ? 'Con trai' : 'Con gái';
  }
  
  if (person1.fatherId === person2.id) {
    return 'Cha';
  }
  
  if (person1.motherId === person2.id) {
    return 'Mẹ';
  }
  
  return null;
};
