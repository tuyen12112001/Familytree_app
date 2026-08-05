'use client';

import { BookOpen } from 'lucide-react';

export default function ChroniclePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-800 to-stone-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <BookOpen className="w-14 h-14 mx-auto text-amber-400" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-100 mb-3">
            Diễn Nghĩa Gia Phả
          </h1>
          <p className="text-stone-400 text-base max-w-xl mx-auto">
            Phần diễn nghĩa được chép lại từ cuốn sổ gia phả dược cụ Nguyễn Văn Nhớn ghi chép và lưu giữ.
          </p>
        </div>

        {/* Chronicle Content */}
        <div className="space-y-8">

          {/* Section — Diễn nghĩa */}
          <div className="bg-amber-950 rounded-lg shadow-lg border border-amber-800 p-8">
            <h2 className="text-xl font-bold text-amber-300 mb-5 pb-3 border-b border-amber-700 tracking-wide uppercase">
              Diễn nghĩa
            </h2>
            <div className="prose max-w-none leading-loose">
              <p className="italic text-amber-100 font-medium text-base mb-4">
                Niên hiệu Duy Tân thứ bốn là năm Canh Tuất tức là năm 1909 tháng 9 ngày 10.
                Nguyễn Văn Nhớn vì dựng quyển tộc phả sau này.
              </p>
              <p className="italic text-amber-100 font-medium text-base leading-loose">
                Tượng nghe, chúng đạo đời Đời đế đời Vương chẳng gì trước hơn đạo hiếu,
                ôi hiếu ấy là chưng trước trăm nết, chưng gốc Miên Thiện là chưng Kinh đời vậy,
                là chưng nghĩa đất vậy, là chưng nết dân vậy, làm người con cháu ấy phụng thờ tiên tổ,
                nhớ đạo hiếu báo gốc Tìm lấy sáng đấng tổ Đấng tiên để đồi sau truyền chưng con con cháu cháu
                Đời đời Phụng dữ hương hỏa chẳng dứt vậy, lại nói đạo hiếu cùng giời đất Đời có đời xưa đời nay,
                Nhà chưng có ghi chép cũng như nước có sách sử vậy, Tượng người có chưng đấng Tổ, Tóm chưng có Tôn
                ví như cây một gốc vậy, mà nghìn cành muôn lá, nước có một nguồn vậy. Mà muôn phái nghìn ròng,
                thực khó chia rõ vậy, bằng những chứng truyền nghe, mà chẳng ghi kỹ rõ ràng, Thời đời đời lâu xa,
                sao hay xét rõ sự thực chưng tự tôn, trộm xem ròng nhà nho, chút biết đạo ông thánh,
                trọng nghĩa ở điều ấy chọn dựng quyển gia phả này, rồi thứ kỹ biên, Khiến người đời sau ta mắt trông
                gia phả ấy, biết chưng tuổi sống của đấng Tổ đấng Tiên, lấy ghi tuổi thọ, biết chưng tên chữ của đấng Tổ
                đấng Tôn, lấy Nghiêm đấng Kiêng, biết chưng tên hèm của đấng Tổ đấng Tôn, lấy rõ tế cáo, biết chưng phần mộ
                của đấng Tổ đấng Tôn, lấy kỹ ghi nhận, biết chưng sinh manh đấng Tổ đấng Tôn lấy chia rõ người thân người sơ,
                nhân hậu một mạch, công đức lưu truyền, hương hỏa ức niên, không bao giờ mất, chưng rõ mối dòng tự Đấng chiêu,
                Đấng mục Hậu luân di tốt, trên có bá dẫn chứng thửa trước, dưới có Thửa rực chưng Thửa sau, chưng đấng cao Tằng Tổ Khảo
                Ta dựng đắp nền móng, Thực làm chung nhà chứa Thiện, chưng con cháu Tằng, cháu Huyền Ta, đắp bền cõi gốc chưng hưởng phúc thừa,
                từ sau ngành trưởng ngành thứ ghi giữ mỗi ngành một bản, theo thứ bền biên, lấy hậu thừa truyền, chưng Họ nhà ta từ bốn đời về
                trước nguyên ủy chưa tường, nay được nghe lời nói sót của đấng Tam đại Tổ, nguyên quán ở xã Bình Cách, tục gọi là cụ Đội Còi,
                sinh được đấng nhị Đại Tổ gọi là Nguyễn Tiền di cư sang ở Phong lôi, giờ về trước giỗ chạp, mất truyền, nay định lấy mỗi năm
                ngày 15 tháng 7 kính tế tiên tổ rất nên long trọng.
              </p>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-12 text-center text-sm text-stone-500">
          <p>Tư liệu được lưu giữ và số hóa bởi dòng họ Nguyễn Văn</p>
        </div>
      </div>
    </div>
  );
}
