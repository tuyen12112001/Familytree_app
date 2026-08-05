import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 });
    }

    // Kiểm tra loại file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Chỉ chấp nhận file ảnh (JPG, PNG, WEBP, GIF)' },
        { status: 400 }
      );
    }

    // Kiểm tra kích thước file (tối đa 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File quá lớn. Tối đa 5MB' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Tạo tên file duy nhất
    const ext = path.extname(file.name) || '.jpg';
    const uniqueName = `avatar-${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

    const avatarsDir = path.join(process.cwd(), 'public', 'avatars');

    // Tạo thư mục nếu chưa có
    if (!existsSync(avatarsDir)) {
      await mkdir(avatarsDir, { recursive: true });
    }

    const filePath = path.join(avatarsDir, uniqueName);
    await writeFile(filePath, buffer);

    const avatarUrl = `/avatars/${uniqueName}`;

    return NextResponse.json({ avatarUrl }, { status: 201 });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Lỗi khi tải ảnh lên' }, { status: 500 });
  }
}
