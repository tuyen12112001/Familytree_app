'use client';

import Link from 'next/link';
import { Trees, Search, Users, BookOpen } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-6">
            <Trees className="w-16 h-16 mx-auto text-amber-600" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">
            Gia phả dòng họ Nguyễn Văn
          </h1>
          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Nơi tra cứu thông tin và tìm hiểu thêm về dòng họ nhà mình
          </p>
        </div>

        {/* About Section */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 mb-12 max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Về dòng họ Nguyễn Văn</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Dòng họ Nguyễn Văn ta là một trong những dòng họ lớn ở xóm 3, thôn Phong Lôi Tây, xã Đông Hợp, huyện Đông Hưng, tỉnh Thái Bình.
            Cụ tổ của dòng họ là cụ Nguyễn Tiền di cư từ xã Đông Xá sang ở Phong Lôi và dòng họ phát triển từ đấy. 
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Website này được tạo ra để cho con cháu trong dòng họ có thể xem, tra cứu và tìm hiểu thêm về tổ tiên, dòng họ. 
            Hơn nữa, đây cũng là nơi để con cháu chúng ta lưu giữ và tưởng nhớ về tổ tiên, dòng họ mình. 
          </p>
          <p className="text-slate-600 leading-relaxed text-right italic">
            Nguyễn Hoàng Tuyến
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Diễn nghĩa gia phả
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Phần diễn nghĩa được chép lại từ cuốn sổ gia phả dược cụ Nguyễn Văn Nhớ ghi chép và lưu giữ
            </p>
            <Link
              href="/chronicle"
              className="mt-auto text-amber-700 font-medium text-xl hover:text-amber-800"
            >
              Đọc diễn nghĩa →
            </Link>
          </div>

          {/* Feature 2 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Trees className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Cây gia phả
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Sơ đồ gia phả chi tiết về tổ tiên và con cháu trong dòng họ <span className="font-semibold">Nguyễn Văn</span>
            </p>
            <Link
              href="/tree"
              className="mt-auto text-amber-600 font-medium text-xl hover:text-amber-700"
            >
              Xem cây gia phả →
            </Link>
          </div>

          {/* Feature 3 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Tìm kiếm
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Tìm kiếm thành viên trong dòng họ <span className="font-semibold">Nguyễn Văn</span> theo tên hoặc thông tin khác
            </p>
            <Link
              href="/search"
              className="mt-auto text-blue-600 font-medium text-xl hover:text-blue-700"
            >
              Tìm kiếm ngay →
            </Link>
          </div>

          {/* Feature 4 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Quản lý thành viên
            </h3>
            <p className="text-slate-600 text-sm mb-4">
              Thêm, chỉnh sửa thông tin về các thành viên trong dòng họ <span className="font-semibold">Nguyễn Văn</span> để cập nhật dữ liệu mới nhất
            </p>
            <Link
              href="/admin"
              className="mt-auto text-green-600 font-medium text-xl hover:text-green-700"
            >
              Quản lý thông tin →
            </Link>
          </div>
        </div>

        {/* CTA Buttons */}
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tree"
            className="px-8 py-3 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 transition-colors text-center"
          >
            Bắt Đầu Xem Cây Gia Phả
          </Link>
          <Link
            href="/search"
            className="px-8 py-3 border-2 border-amber-600 text-amber-600 font-medium rounded-lg hover:bg-amber-50 transition-colors text-center"
          >
            Tìm Kiếm Thành Viên
          </Link>
        </div> */}
      </div>
    </div>
  );
}
