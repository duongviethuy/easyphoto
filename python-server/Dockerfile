# api/Dockerfile

# 1. Chọn hệ điều hành nền (Base Image)
FROM python:3.10-slim

# 2. Thiết lập thư mục làm việc bên trong container
WORKDIR /app

# 3. Cài đặt các thư viện hệ thống cần thiết cho OpenCV (xử lý ảnh)
# Mặc dù dùng bản headless, đôi khi nó vẫn cần các thư viện C++ cơ bản này
RUN apt-get update && apt-get install -y \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# 4. Copy file thư viện vào trước để tận dụng Docker Cache
COPY requirements.txt .

# 5. Cài đặt thư viện Python
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copy toàn bộ code vào
COPY . .

# 7. Mở cổng 8000
EXPOSE 8000

# 8. Lệnh chạy server
# reload: để khi con sửa code, server tự cập nhật
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]