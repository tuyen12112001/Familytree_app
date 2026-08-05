import { Person } from '@/types';
import { removeVietnameseAccents } from '@/lib/string-utils';
import familySeed from './family-seed.json';

// Dữ liệu gốc của dòng họ, dùng để seed database khi dev.db còn trống.
// KHÔNG sửa tay file family-seed.json: nhập/sửa thành viên trong trang /admin,
// sau đó chạy `npm run export:seed` để ghi lại snapshot từ dev.db.
//
// Về ID: gồm 8 chữ số [ab][c][d][e][fgh], trong đó:
// - 2 chữ số đầu tiên [ab] đại diện cho thế hệ (00-F0, 01-F1, 02-F2,...)
// - 1 chữ số tiếp theo [c] đại diện cho giới tính (0-Nam, 1-Nữ, 2-Khác)
// - 1 chữ số tiếp theo [d] đại diện cho quan hệ với dòng họ
//         (0-thành viên trong họ,
//         1-con rể,
//         2-con dâu,
//         3- người ngoài họ nhưng có liên kết (con nuôi, tái hôn,...))
// - 1 chữ số tiếp theo [e] đại diện cho chi (0-chi trưởng, 1-chi thứ nhất, 2-chi thứ hai,...)
// - 3 chữ số cuối cùng [fgh] đại diện cho thứ tự, vai vế trong thế hệ (001, 002,...)
export const mockPeople: Person[] = familySeed as unknown as Person[];

export const getPeopleMap = () => {
  const map = new Map<string, Person>();
  mockPeople.forEach(person => map.set(person.id, person));
  return map;
};

export const getPersonById = (id: string): Person | undefined => {
  return mockPeople.find(person => person.id === id);
};

export const searchPeople = (query: string): Person[] => {
  const normalizedQuery = removeVietnameseAccents(query).toLowerCase();
  return mockPeople.filter(person =>
    removeVietnameseAccents(person.fullName).toLowerCase().includes(normalizedQuery)
  );
};
