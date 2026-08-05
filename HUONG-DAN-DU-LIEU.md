# Hướng dẫn quản lý dữ liệu dòng họ

Nguồn sự thật của dữ liệu là **`src/data/family-seed.json`** (file này được commit vào git).
`dev.db` chỉ là bản sao làm việc trên máy bạn, đã được `.gitignore` và luôn dựng lại được từ file JSON.

---

## 1. Việc bạn làm hằng ngày

Sau mỗi lần thêm/sửa/xoá thành viên trong trang `/admin`:

```bash
npm run export:seed
git add src/data/family-seed.json public/avatars
git commit -m "Cập nhật thông tin dòng họ"
```

Chỉ 3 dòng đó. Nếu quên chạy `export:seed` thì dữ liệu vừa nhập **chưa được lưu vào git**,
và sẽ mất nếu bạn xoá `dev.db` hoặc chuyển sang máy khác.

Mẹo kiểm tra nhanh trước khi commit: chạy `git diff src/data/family-seed.json`,
bạn sẽ thấy rõ từng người nào vừa được thêm hoặc sửa gì.

---

## 2. Việc một lần — đã làm xong

`public/avatars/` đã được `git add` (ảnh không nằm trong JSON, nên thiếu thư mục này
là ảnh đại diện sẽ hỏng ở máy khác). Bạn chỉ cần commit là xong.

`dev.db` thì không cần làm gì: nó chưa từng được commit và giờ đã nằm trong `.gitignore`,
nên git sẽ tự bỏ qua.

---

## 3. Thêm ảnh đại diện

Làm hết trong trang `/admin`, không cần tự copy file vào thư mục nào:

1. Mở form thêm/sửa thành viên, bấm **Chọn ảnh**.
2. Ảnh được tải lên và lưu vào `public/avatars/` với tên duy nhất kiểu
   `avatar-<timestamp>-<random>.jpg`. Giới hạn: JPG/PNG/WEBP/GIF, tối đa 5MB.
3. **Bấm Lưu.** Đây là bước dễ bỏ sót nhất: nếu chỉ upload rồi đóng form, file ảnh vẫn
   nằm trên đĩa nhưng không thành viên nào trỏ tới nó — thành ảnh mồ côi, vô hại nhưng là rác.
4. `npm run export:seed` → `avatarUrl` xuất hiện trong JSON.
5. Commit **cả hai** thứ:

```bash
git add src/data/family-seed.json public/avatars
```

Nhớ rằng JSON chỉ chứa **đường dẫn** tới ảnh chứ không chứa bản thân ảnh. Commit JSON mà
quên `public/avatars` thì ở máy khác đường dẫn sẽ trỏ vào hư không. Cứ add cả hai cùng lúc.

Muốn đổi ảnh thì chọn ảnh mới rồi Lưu — file cũ **không tự bị xoá**, nếu muốn dọn thì
tự xoá tay trong `public/avatars/`.

---

## 4. Khi mở dự án ở máy mới (hoặc muốn nạp lại JSON vào DB)

```bash
npm install
npx prisma migrate deploy   # tạo dev.db và bảng Person
npm run dev                 # DB trống → tự seed từ family-seed.json
```

Lưu ý: app **chỉ tự seed khi DB hoàn toàn trống**. Nếu máy đã có `dev.db` với dữ liệu cũ
mà bạn muốn nạp bản JSON mới nhất vào (ví dụ vừa `git pull` về), chạy:

```bash
npm run reseed
```

Lệnh này ghi đè theo từng ID nên an toàn khi chạy nhiều lần. Nhưng nó **không xoá** những
người có trong DB mà không có trong JSON — nếu muốn sạch tuyệt đối thì xoá `dev.db` rồi
làm lại 3 bước ở trên.

---

## 5. Cảnh báo "tham chiếu trỏ tới ID không tồn tại"

Khi chạy `export:seed` bạn có thể thấy danh sách cảnh báo kiểu:

```
- 01001001 (Nguyễn Văn Khoan) → con 02001001
```

Nghĩa là ông Khoan có khai một người con mang ID `02001001`, nhưng người đó **chưa được
nhập hồ sơ**. Hiện có 76 trường hợp như vậy, vốn đã có sẵn trong dữ liệu từ trước.

Đây không phải lỗi và không làm hỏng gì — chỉ là danh sách việc còn phải nhập tiếp.
Việc export vẫn thành công bình thường. Cảnh báo sẽ tự hết dần khi bạn nhập đủ các thành viên đó.
