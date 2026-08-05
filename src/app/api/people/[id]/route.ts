import { NextRequest, NextResponse } from 'next/server';
import { getPerson, updatePerson, deletePerson } from '@/lib/server/people-store';

interface Params {
  id: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const person = await getPerson(id);
    if (!person) {
      return NextResponse.json(
        { error: 'Không tìm thấy thành viên' },
        { status: 404 }
      );
    }
    return NextResponse.json(person);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi lấy thông tin' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const result = await updatePerson(id, data);

    if (!result) {
      return NextResponse.json(
        { error: 'Không tìm thấy thành viên' },
        { status: 404 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi cập nhật' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const { id } = await params;
    const success = await deletePerson(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Không tìm thấy thành viên' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Xóa thành công' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Lỗi khi xóa' },
      { status: 500 }
    );
  }
}
