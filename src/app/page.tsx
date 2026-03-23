'use client';

import Link from 'next/link';
import { Trees, Search, Users } from 'lucide-react';

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
            Dòng họ Nguyễn Văn là một trong những dòng họ lâu đời và rộng lớn tại Việt Nam. Website này được 
            tạo ra để giúp các thành viên trong gia đình có thể xem, tìm kiếm và quản lý thông tin về 
            các thành viên trong dòng họ một cách dễ dàng và hiệu quả.
          </p>
          <p className="text-slate-600 leading-relaxed">
            Bạn có thể xem cây gia phả, tìm kiếm thành viên, xem thông tin chi tiết của từng người, 
            và thêm thông tin mới vào hệ thống.
          </p>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Feature 1 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4">
              <Trees className="w-6 h-6 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Cây Gia Phả
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

          {/* Feature 2 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Tìm Kiếm
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

          {/* Feature 3 */}
          <div className="flex h-full flex-col bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Quản Lý thành viên
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
