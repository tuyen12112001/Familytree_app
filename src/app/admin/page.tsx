'use client';

import { useState, useSyncExternalStore, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Edit2, Trash2, Lock, Upload, X, Eye, EyeOff, Info, ChevronDown } from 'lucide-react';
import { Person } from '@/types';
import { getYearOnly, parseDateParts, composeDateParts, type DateParts } from '@/lib/family-utils';

const ADMIN_PASSWORD = 'donghoNguyenVan';
const ADMIN_ACCESS_KEY = 'familytree-admin-access';
const ADMIN_ACCESS_EVENT = 'familytree-admin-access-change';

const subscribeToAdminAccess = (callback: () => void) => {
  if (typeof window === 'undefined') {
    return () => undefined;
  }

  const handleChange = () => callback();

  window.addEventListener('storage', handleChange);
  window.addEventListener(ADMIN_ACCESS_EVENT, handleChange);

  return () => {
    window.removeEventListener('storage', handleChange);
    window.removeEventListener(ADMIN_ACCESS_EVENT, handleChange);
  };
};

const getAdminAccessSnapshot = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.sessionStorage.getItem(ADMIN_ACCESS_KEY) === 'granted';
};

// Lược đồ xác thực Zod
const personFormSchema = z.object({
  fullName: z.string().min(1, 'Tên không được để trống'),
  gender: z.enum(['male', 'female', 'other']),
  birthPlace: z.string().optional(),
  biography: z.string().optional(),
  fatherId: z.string().optional(),
  motherId: z.string().optional(),
});

type PersonFormData = z.infer<typeof personFormSchema>;

// Giá trị rỗng để làm trắng hoàn toàn biểu mẫu khi thêm người mới
const EMPTY_FORM_VALUES = {
  fullName: '',
  gender: undefined,
  birthPlace: '',
  biography: '',
  fatherId: '',
  motherId: '',
} as const;

const EMPTY_DATE_PARTS: DateParts = { year: '', month: '', day: '' };

// Ngày/tháng/năm nhập rời: phần nào không biết thì để "Không rõ"
function DatePartsFields({
  idPrefix,
  value,
  onChange,
}: {
  idPrefix: string;
  value: DateParts;
  onChange: (next: DateParts) => void;
}) {
  const selectClass =
    'w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500';

  return (
    <div className="grid grid-cols-3 gap-2">
      <div>
        <label htmlFor={`${idPrefix}-day`} className="block text-xs text-slate-600 mb-0.5">
          Ngày
        </label>
        <select
          id={`${idPrefix}-day`}
          value={value.day}
          onChange={(e) => onChange({ ...value, day: e.target.value })}
          className={selectClass}
        >
          <option value="">Không rõ</option>
          {Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0')).map((d) => (
            <option key={d} value={d}>
              {parseInt(d, 10)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-month`} className="block text-xs text-slate-600 mb-0.5">
          Tháng
        </label>
        <select
          id={`${idPrefix}-month`}
          value={value.month}
          onChange={(e) => onChange({ ...value, month: e.target.value })}
          className={selectClass}
        >
          <option value="">Không rõ</option>
          {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
            <option key={m} value={m}>
              {parseInt(m, 10)}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-year`} className="block text-xs text-slate-600 mb-0.5">
          Năm
        </label>
        <input
          id={`${idPrefix}-year`}
          type="number"
          min={1}
          max={9999}
          placeholder="Không rõ"
          value={value.year}
          onChange={(e) => onChange({ ...value, year: e.target.value })}
          className={selectClass}
        />
      </div>
    </div>
  );
}

// Các thành phần của mã ID 8 chữ số: [ab][c][d][e][fgh]
interface IdParts {
  gen: string;      // thế hệ (2 số đầu)
  genderDigit: string; // giới tính (số thứ 3) - tự động theo trường Giới Tính
  rel: string;      // quan hệ với dòng họ (số thứ 4)
  branch: string;   // chi (số thứ 5)
  order: string;    // thứ tự trong thế hệ (3 số cuối)
}

const DEFAULT_ID_PARTS: IdParts = { gen: '0', genderDigit: '0', rel: '0', branch: '0', order: '' };

function parseIdParts(id: string): IdParts | null {
  const m = id.match(/^(\d{2})(\d)(\d)(\d)(\d{3})$/);
  if (!m) return null;
  return {
    gen: String(parseInt(m[1], 10)),
    genderDigit: m[2],
    rel: m[3],
    branch: m[4],
    order: String(parseInt(m[5], 10)),
  };
}

function composeId(parts: IdParts): string {
  const orderNum = parseInt(parts.order, 10);
  if (!parts.order || isNaN(orderNum) || orderNum < 1) return '';
  return (
    String(parseInt(parts.gen, 10)).padStart(2, '0') +
    parts.genderDigit +
    parts.rel +
    parts.branch +
    String(orderNum).padStart(3, '0')
  );
}

export default function AdminPage() {
  const isAuthorized = useSyncExternalStore(
    subscribeToAdminAccess,
    getAdminAccessSnapshot,
    () => false
  );
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAlive, setIsAlive] = useState(false);
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>('');
  const [avatarPreview, setAvatarPreview] = useState<string>('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showIdGuide, setShowIdGuide] = useState(false);
  const [idParts, setIdParts] = useState<IdParts>(DEFAULT_ID_PARTS);
  const [idError, setIdError] = useState('');
  const [birthParts, setBirthParts] = useState<DateParts>(EMPTY_DATE_PARTS);
  const [deathParts, setDeathParts] = useState<DateParts>(EMPTY_DATE_PARTS);
  const [spouseIds, setSpouseIds] = useState<string[]>([]);
  const [dateError, setDateError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<PersonFormData>({
    resolver: zodResolver(personFormSchema),
  });

  // Số giới tính trong ID tự động theo trường Giới Tính
  const watchedGender = watch('gender');
  const genderDigit = watchedGender === 'male' ? '0' : watchedGender === 'female' ? '1' : watchedGender === 'other' ? '2' : idParts.genderDigit;
  const composedId = composeId({ ...idParts, genderDigit });

  // Con cái được suy ra từ trường Cha/Mẹ của người khác, không nhập trực tiếp
  const derivedChildren = editingId
    ? people.filter(p => p.fatherId === editingId || p.motherId === editingId)
    : [];

  // Fetch dữ liệu từ API khi trang load
  useEffect(() => {
    if (isAuthorized) {
      fetchPeople();
    }
  }, [isAuthorized]);

  const fetchPeople = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('/api/people');
      if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
      const data = await response.json();
      setPeople(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview ngay lập tức
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    // Upload lên server
    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || 'Lỗi khi tải ảnh lên');
        setAvatarPreview('');
        return;
      }
      const { avatarUrl: url } = await res.json();
      setAvatarUrl(url);
    } catch {
      setError('Lỗi khi tải ảnh lên');
      setAvatarPreview('');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl('');
    setAvatarPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: PersonFormData) => {
    try {
      // Kiểm tra mã ID
      if (!composedId) {
        setIdError('Vui lòng chọn đầy đủ các thành phần của mã ID (thứ tự phải từ 1 trở lên).');
        return;
      }
      const idTakenBy = people.find(p => p.id === composedId);
      if (idTakenBy && idTakenBy.id !== editingId) {
        setIdError(`Mã ID ${composedId} đã thuộc về ${idTakenBy.fullName}. Vui lòng chọn thứ tự khác.`);
        return;
      }
      setIdError('');

      // Ngày sinh/mất có thể khuyết, chỉ cần biết ít nhất một phần
      const birthDate = composeDateParts(birthParts);
      if (!birthDate) {
        setDateError('Cần biết ít nhất một phần của ngày sinh (ngày, tháng hoặc năm).');
        return;
      }
      setDateError('');

      const finalData = {
        ...data,
        birthDate,
        deathDate: isAlive ? "Còn sống" : composeDateParts(deathParts) || undefined,
        avatarUrl: avatarUrl || undefined,
        spouseIds,
        ...(editingId
          ? { id: editingId, ...(composedId !== editingId && { newId: composedId }) }
          : { id: composedId }),
      };

      const response = await fetch('/api/people', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => null);
        throw new Error(errBody?.error || 'Lỗi khi lưu dữ liệu');
      }

      // Tải lại danh sách (ID có thể đã thay đổi kéo theo tham chiếu ở thành viên khác)
      await fetchPeople();

      reset(EMPTY_FORM_VALUES);
      setShowForm(false);
      setEditingId(null);
      setIsAlive(false);
      setBirthParts(EMPTY_DATE_PARTS);
      setDeathParts(EMPTY_DATE_PARTS);
      setSpouseIds([]);
      setAvatarUrl('');
      setAvatarPreview('');
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };

  const handleEdit = (personId: string) => {
    const person = people.find(p => p.id === personId);
    if (person) {
      const alive = person.deathDate === "Còn sống";
      setIsAlive(alive);
      setBirthParts(parseDateParts(person.birthDate));
      setDeathParts(alive ? EMPTY_DATE_PARTS : parseDateParts(person.deathDate));
      setSpouseIds(person.spouseIds ?? []);
      setDateError('');
      setAvatarUrl(person.avatarUrl || '');
      setAvatarPreview(person.avatarUrl || '');
      setIdParts(parseIdParts(person.id) ?? DEFAULT_ID_PARTS);
      setIdError('');
      reset({
        fullName: person.fullName,
        gender: person.gender,
        birthPlace: person.birthPlace,
        biography: person.biography,
        fatherId: person.fatherId,
        motherId: person.motherId,
      });
    }
    setEditingId(personId);
    setShowForm(true);
  };

  const handleDelete = async (personId: string) => {
    if (!window.confirm('Bạn chắc chắn muốn xóa thành viên này?')) {
      return;
    }

    try {
      const response = await fetch(`/api/people/${personId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Lỗi khi xóa');

      setPeople(people.filter(p => p.id !== personId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Lỗi không xác định');
    }
  };

  const handleNew = () => {
    reset(EMPTY_FORM_VALUES);
    setEditingId(null);
    setIsAlive(false);
    setBirthParts(EMPTY_DATE_PARTS);
    setDeathParts(EMPTY_DATE_PARTS);
    setSpouseIds([]);
    setDateError('');
    setAvatarUrl('');
    setAvatarPreview('');
    setIdParts(DEFAULT_ID_PARTS);
    setIdError('');
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(true);
  };

  const handlePasswordSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (password === ADMIN_PASSWORD) {
      window.sessionStorage.setItem(ADMIN_ACCESS_KEY, 'granted');
      window.dispatchEvent(new Event(ADMIN_ACCESS_EVENT));
      setPassword('');
      setPasswordError('');
      return;
    }

    setPasswordError('Mật khẩu không đúng. Vui lòng thử lại.');
  };

  if (!isAuthorized) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-100 text-amber-600">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Khu vực quản lý</h1>
              <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
                Nhập mật khẩu để chỉnh sửa thông tin thành viên gia đình.
              </p>
            </div>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-password" className="mb-1 block text-sm font-semibold text-slate-900 dark:text-white">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                    if (passwordError) {
                      setPasswordError('');
                    }
                  }}
                  placeholder="Nhập mật khẩu quản trị"
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 pr-10 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}

            <button
              type="submit"
              className="w-full rounded-lg bg-amber-600 px-4 py-2 font-medium text-white transition-colors hover:bg-amber-700"
            >
              Mở phần quản lý
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Quản Trị Gia Đình</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">Quản lý thông tin thành viên gia đình</p>
        </div>
        <button
          onClick={handleNew}
          className="flex items-center space-x-2 px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Thêm Người Mới</span>
        </button>
      </div>

      {/* ID Guide */}
      <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 overflow-hidden">
        <button
          type="button"
          onClick={() => setShowIdGuide(!showIdGuide)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-blue-100 transition-colors"
        >
          <div className="flex items-center gap-2 text-blue-800 font-medium">
            <Info className="w-5 h-5 flex-shrink-0" />
            <span>Quy tắc đánh mã ID thành viên (8 chữ số)</span>
          </div>
          <ChevronDown className={`w-5 h-5 text-blue-600 transition-transform ${showIdGuide ? 'rotate-180' : ''}`} />
        </button>
        {showIdGuide && (
          <div className="px-4 pb-4 text-sm text-blue-900">
            <p className="mb-2">
              Mỗi ID gồm 8 chữ số theo cấu trúc{' '}
              <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">[ab][c][d][e][fgh]</code>:
            </p>
            <ul className="space-y-1.5 list-none">
              <li>
                <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">ab</code>{' '}
                — 2 số đầu: <strong>thế hệ</strong> (00 = F0, 01 = F1, 02 = F2,...)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">c</code>{' '}
                — số thứ 3: <strong>giới tính</strong> (0 = Nam, 1 = Nữ, 2 = Khác)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">d</code>{' '}
                — số thứ 4: <strong>quan hệ với dòng họ</strong> (0 = thành viên trong họ, 1 = con rể, 2 = con dâu, 3 = người ngoài họ có liên kết như con nuôi, tái hôn,...)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">e</code>{' '}
                — số thứ 5: <strong>chi</strong> (0 = chi trưởng, 1 = chi thứ nhất, 2 = chi thứ hai,...)
              </li>
              <li>
                <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">fgh</code>{' '}
                — 3 số cuối: <strong>thứ tự, vai vế trong thế hệ</strong> (001, 002,...)
              </li>
            </ul>
            <p className="mt-3 text-blue-700">
              Ví dụ: <code className="px-1.5 py-0.5 bg-blue-100 rounded font-mono font-semibold">01120001</code>{' '}
              = thế hệ F1, nữ, con dâu, chi trưởng, thứ tự 001.
            </p>
          </div>
        )}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                {editingId ? 'Chỉnh Sửa Thành Viên' : 'Thêm Thành Viên Mới'}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                aria-label="Đóng"
                className="p-1.5 text-slate-500 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* Avatar Upload */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Ảnh Chân Dung
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      {avatarPreview ? (
                        <Image
                          src={avatarPreview}
                          alt="Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-2xl text-slate-400">👤</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 flex-1">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingAvatar}
                        className="flex items-center gap-2 px-3 py-1.5 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
                      >
                        <Upload className="w-4 h-4" />
                        {uploadingAvatar ? 'Đang tải...' : 'Chọn ảnh'}
                      </button>
                      {avatarPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="flex items-center gap-2 px-3 py-1.5 border border-red-200 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <X className="w-4 h-4" />
                          Xóa ảnh
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                  <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP, GIF. Tối đa 5MB.</p>
                </div>

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

                {/* ID Builder */}
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <label className="block text-sm font-semibold text-slate-900 mb-2">
                    Mã ID Thành Viên *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-slate-600 mb-0.5">Thế hệ</label>
                      <select
                        value={idParts.gen}
                        onChange={(e) => { setIdParts({ ...idParts, gen: e.target.value }); setIdError(''); }}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {Array.from({ length: 21 }, (_, i) => (
                          <option key={i} value={String(i)}>
                            F{i} ({String(i).padStart(2, '0')})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-0.5">Giới tính (tự động)</label>
                      <input
                        type="text"
                        value={genderDigit === '0' ? '0 - Nam' : genderDigit === '1' ? '1 - Nữ' : '2 - Khác'}
                        readOnly
                        className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-0.5">Quan hệ dòng họ</label>
                      <select
                        value={idParts.rel}
                        onChange={(e) => { setIdParts({ ...idParts, rel: e.target.value }); setIdError(''); }}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="0">0 - Trong họ</option>
                        <option value="1">1 - Con rể</option>
                        <option value="2">2 - Con dâu</option>
                        <option value="3">3 - Ngoài họ có liên kết</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-600 mb-0.5">Chi</label>
                      <select
                        value={idParts.branch}
                        onChange={(e) => { setIdParts({ ...idParts, branch: e.target.value }); setIdError(''); }}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        <option value="0">0 - Chi trưởng</option>
                        {Array.from({ length: 9 }, (_, i) => (
                          <option key={i + 1} value={String(i + 1)}>
                            {i + 1} - Chi thứ {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs text-slate-600 mb-0.5">Thứ tự trong thế hệ (1-999)</label>
                      <input
                        type="number"
                        min={1}
                        max={999}
                        placeholder="VD: 1"
                        value={idParts.order}
                        onChange={(e) => { setIdParts({ ...idParts, order: e.target.value }); setIdError(''); }}
                        className="w-full px-2 py-1.5 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                  <p className="mt-2 text-sm">
                    <span className="text-slate-600">Mã ID: </span>
                    {composedId ? (
                      <code className="px-1.5 py-0.5 bg-white border border-amber-300 rounded font-mono font-semibold text-amber-700">
                        {composedId}
                      </code>
                    ) : (
                      <span className="text-slate-400 italic">Chưa đủ thông tin</span>
                    )}
                    {editingId && composedId && composedId !== editingId && (
                      <span className="ml-2 text-xs text-orange-600">
                        (đổi từ {editingId})
                      </span>
                    )}
                  </p>
                  {idError && <p className="text-red-500 text-xs mt-1">{idError}</p>}
                </div>

                {/* Birth Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Ngày Sinh *
                  </label>
                  <DatePartsFields
                    idPrefix="birth"
                    value={birthParts}
                    onChange={(next) => { setBirthParts(next); setDateError(''); }}
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Phần nào không biết thì để &quot;Không rõ&quot;. Cần biết ít nhất một phần.
                  </p>
                  {dateError && <p className="text-red-500 text-xs mt-1">{dateError}</p>}
                </div>

                {/* Death Date */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Ngày Mất
                  </label>
                  <div className="flex items-center gap-3 mb-2">
                    <input
                      type="checkbox"
                      id="isAlive"
                      checked={isAlive}
                      onChange={(e) => setIsAlive(e.target.checked)}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="isAlive" className="text-sm text-slate-700 cursor-pointer">
                      Còn sống
                    </label>
                  </div>
                  {!isAlive && (
                    <DatePartsFields
                      idPrefix="death"
                      value={deathParts}
                      onChange={setDeathParts}
                    />
                  )}
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
                    {people
                      .filter(p => p.gender === 'male')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.fullName} ({p.id})
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
                    {people
                      .filter(p => p.gender === 'female')
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.fullName} ({p.id})
                        </option>
                      ))}
                  </select>
                </div>

                {/* Spouses */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Vợ/Chồng
                  </label>
                  <select
                    value=""
                    onChange={(e) => {
                      const id = e.target.value;
                      if (id) setSpouseIds([...spouseIds, id]);
                    }}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Thêm vợ/chồng --</option>
                    {people
                      .filter(p => p.id !== editingId && !spouseIds.includes(p.id))
                      .map(p => (
                        <option key={p.id} value={p.id}>
                          {p.fullName} ({p.id})
                        </option>
                      ))}
                  </select>
                  {spouseIds.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {spouseIds.map(id => {
                        const spouse = people.find(p => p.id === id);
                        return (
                          <span
                            key={id}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800"
                          >
                            {spouse ? spouse.fullName : id}
                            <button
                              type="button"
                              onClick={() => setSpouseIds(spouseIds.filter(s => s !== id))}
                              aria-label={`Gỡ ${spouse?.fullName ?? id}`}
                              className="text-purple-500 hover:text-purple-800"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Quan hệ được đồng bộ 2 chiều: người kia cũng tự có tên thành viên này.
                  </p>
                </div>

                {/* Children (read-only, suy ra từ trường Cha/Mẹ) */}
                <div>
                  <label className="block text-sm font-semibold text-slate-900 mb-1">
                    Con Cái
                  </label>
                  {derivedChildren.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {derivedChildren.map(child => (
                        <span
                          key={child.id}
                          className="px-2 py-1 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800"
                        >
                          {child.fullName} ({child.id})
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 italic">Chưa có</p>
                  )}
                  <p className="text-xs text-slate-400 mt-1">
                    Không nhập ở đây. Muốn thêm con, hãy mở hồ sơ người con và chọn thành viên này ở ô Cha hoặc Mẹ.
                  </p>
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
      <div>
        {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}
          {loading ? (
            <div className="text-center py-8 text-slate-500">Đang tải dữ liệu...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {people.map(person => (
                <div
                  key={person.id}
                  className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        {person.avatarUrl ? (
                          <Image
                            src={person.avatarUrl}
                            alt={person.fullName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-lg">
                            {person.gender === 'male' ? '👨' : person.gender === 'female' ? '👩' : '👤'}
                          </span>
                        )}
                      </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{person.fullName}</h3>
                      <p className="text-xs font-mono text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 inline-block mt-0.5">
                        ID: {person.id}
                      </p>
                      <p className="text-sm text-slate-500">
                        {getYearOnly(person.birthDate)}{person.deathDate === "Còn sống" ? ' - Còn sống' : person.deathDate ? ` - ${getYearOnly(person.deathDate)}` : ''}
                      </p>
                      {person.birthPlace && (
                        <p className="text-xs text-slate-500 mt-1">📍 {person.birthPlace}</p>
                      )}
                    </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(person.id)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(person.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </div>
  );
}
