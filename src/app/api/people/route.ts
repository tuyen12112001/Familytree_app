import { NextRequest, NextResponse } from 'next/server';
import { getAllPeople, addPerson, updatePerson, getPerson } from '@/lib/server/people-store';

export async function GET() {
  try {
    const people = await getAllPeople();
    return NextResponse.json(people);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy danh sách' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate dữ liệu
    if (!data.fullName || !data.birthDate) {
      return NextResponse.json(
        { error: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      );
    }

    // Nếu có ID và ID đã tồn tại → cập nhật; ngược lại → thêm mới (giữ ID tự chọn nếu có)
    if (data.id && (await getPerson(data.id))) {
      const result = await updatePerson(data.id, data);
      return NextResponse.json(result);
    } else {
      // Thêm mới
      const newPerson = await addPerson(data);
      return NextResponse.json(newPerson, { status: 201 });
    }
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Lỗi khi xử lý yêu cầu' },
      { status: 500 }
    );
  }
}
