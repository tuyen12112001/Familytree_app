import { Person } from '@/types';

// Ngày tháng có thể khuyết: phần chưa biết được ghi bằng ? hoặc *
// Ví dụ: 1949-??-?? (chỉ biết năm), ????-10-16 (chỉ biết ngày/tháng)
const UNKNOWN_PART = /^[?*]+$/;

export interface DateParts {
  year: string;
  month: string;
  day: string;
}

export const isPartialDate = (dateString?: string): boolean => {
  return !!dateString && /[?*]/.test(dateString);
};

export const parseDateParts = (dateString?: string): DateParts => {
  const empty: DateParts = { year: '', month: '', day: '' };
  if (!dateString || dateString === 'Còn sống') return empty;

  const segments = dateString.split('-');
  if (segments.length !== 3) return empty;

  const clean = (value: string, length: number) => {
    const trimmed = value.trim();
    if (!trimmed || UNKNOWN_PART.test(trimmed) || !/^\d+$/.test(trimmed)) return '';
    return trimmed.padStart(length, '0');
  };

  return {
    year: clean(segments[0], 4),
    month: clean(segments[1], 2),
    day: clean(segments[2], 2),
  };
};

export const composeDateParts = ({ year, month, day }: DateParts): string => {
  if (!year && !month && !day) return '';
  return [
    year ? year.padStart(4, '0') : '????',
    month ? month.padStart(2, '0') : '??',
    day ? day.padStart(2, '0') : '??',
  ].join('-');
};

export const isAliveOrUnknownDate = (dateString?: string): boolean => {
  return !dateString || dateString === "Còn sống" || isPartialDate(dateString);
};

export const calculateAge = (birthDate: string, deathDate?: string): number | null => {
  // Không biết năm sinh thì không tính được tuổi
  const birthYearMatch = birthDate.match(/^\d{4}/);
  if (!birthYearMatch) return null;
  const birthYear = parseInt(birthYearMatch[0]);

  const birth = new Date(`${birthYear}-01-01`);
  let end: Date;

  if (!deathDate || deathDate === "Còn sống") {
    end = new Date();
  } else if (isPartialDate(deathDate)) {
    // Nếu là ngày không đầy đủ, lấy năm từ deathDate
    const deathYearMatch = deathDate.match(/^\d{4}/);
    if (deathYearMatch) {
      const deathYear = parseInt(deathYearMatch[0]);
      end = new Date(`${deathYear}-01-01`);
    } else {
      end = new Date();
    }
  } else {
    end = new Date(deathDate);
  }

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age--;
  }

  return Math.max(0, age);
};

export const formatDate = (dateString?: string): string => {
  if (!dateString || dateString === "Còn sống") {
    return "Còn sống";
  }

  // Ngày khuyết: chỉ hiển thị những phần đã biết
  if (isPartialDate(dateString)) {
    const { year, month, day } = parseDateParts(dateString);
    const m = month ? String(parseInt(month, 10)) : '';
    const d = day ? String(parseInt(day, 10)) : '';

    if (!year && !m && !d) return 'Không rõ';
    if (year && m && d) return `Ngày ${d} tháng ${m} năm ${year}`;
    if (year && m) return `Tháng ${m} năm ${year}`;
    if (year && d) return `Ngày ${d} năm ${year} (không rõ tháng)`;
    if (year) return `Năm ${year}`;
    if (m && d) return `Ngày ${d} tháng ${m} (không rõ năm)`;
    if (m) return `Tháng ${m} (không rõ năm)`;
    return `Ngày ${d} (không rõ tháng, năm)`;
  }

  const date = new Date(dateString);

  // Kiểm tra xem có phải là date hợp lệ không
  if (isNaN(date.getTime())) {
    return dateString;
  }

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
  if (!dateString || dateString === "Còn sống") {
    return "";
  }
  
  // Nếu ngày có **, lấy năm từ đó
  const yearMatch = dateString.match(/^\d{4}/);
  if (yearMatch) {
    return yearMatch[0];
  }
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "";
  }
  
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
