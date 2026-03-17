'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { mockPeople } from '@/data/mock-family';

// Lược đồ xác thực Zod
const personFormSchema = z.object({
  fullName: z.string().min(1, 'Tên không được để trống'),
  gender: z.enum(['male', 'female', 'other']),
  birthDate: z.string().min(1, 'Ngày sinh không được để trống'),
  deathDate: z.string().optional(),
  birthPlace: z.string().optional(),
  biography: z.string().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
});

type PersonFormData = z.infer<typeof personFormSchema>;

export default function AdminPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
  });

  const onSubmit = (data: PersonFormData) => {
    console.log('Form submitted:', data);
    // Ở đây bạn thường sẽ gửi dữ liệu đến API
    alert(`${editingId ? 'Cập nhật' : 'Thêm'} thành viên: ${data.fullName}`);
    reset();
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (personId: string) => {
    setEditingId(personId);
    setShowForm(true);
  };

  const handleNew = () => {
    reset();
    setEditingId(null);
    setShowForm(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Quản Trị Gia Đình</h1>
          <p className="text-slate-600 mt-1">Quản lý thông tin thành viên gia đình</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Người Mới</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form (if open) */}
        {showForm && (
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">
                {editingId ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}
              </h2>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Họ Tên *
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập họ tên"
                    {...register('fullName')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Giới Tính *
                  </label>
                  <select
                    {...register('gender')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Chọn --</option>
                    <option value="male">Nam</option>
                    <option value="female">Nữ</option>
                    <option value="other">Khác</option>
                  </select>
                  {errors.gender && (
                    <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Ngày Sinh *
                  </label>
                  <input
                    type="date"
                    {...register('birthDate')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {errors.birthDate && (
                    <p className="text-red-500 text-xs mt-1">{errors.birthDate.message}</p>
                  )}
                </div>

                {/* Death Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Ngày Mất
                  </label>
                  <input
                    type="date"
                    {...register('deathDate')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Birth Place */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Nơi Sinh
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập nơi sinh"
                    {...register('birthPlace')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Biography */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Tiểu Sử
                  </label>
                  <textarea
                    placeholder="Nhập tiểu sử"
                    rows={4}
                    {...register('biography')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Father */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Cha
                  </label>
                  <select
                    {...register('fatherId')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Không có --</option>
                    {mockPeople
                      .filter(p => p.gender === 'male')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.fullName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Mother */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Mẹ
                  </label>
                  <select
                    {...register('motherId')}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Không có --</option>
                    {mockPeople
                      .filter(p => p.gender === 'female')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.fullName}
                        </option>
                      ))}
                  </select>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
                  >
                    {editingId ? 'Cập Nhật' : 'Thêm Mới'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 font-medium rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* People List */}
        <div className={showForm ? 'lg:col-span-2' : 'lg:col-span-3'}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockPeople.map(person => (
              <div
                key={person.id}
                className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900">{person.fullName}</h3>
                    <p className="text-sm text-slate-500">
                      {new Date(person.birthDate).getFullYear()}{person.deathDate && ` - ${new Date(person.deathDate).getFullYear()}`}
                    </p>
                    {person.birthPlace && (
                      <p className="text-xs text-slate-500 mt-1">📍 {person.birthPlace}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(person.id)}
                      className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
