"use client";

import { useState } from "react";
import Link from "next/link";

export default function SetupDBPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const setupDatabase = async () => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const response = await fetch("/api/test-db/setup");
      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error("Error setting up database:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Thiết lập cơ sở dữ liệu</h1>

      <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-800">
          <strong>Lưu ý:</strong> Chức năng này sẽ tạo cơ sở dữ liệu và các bảng
          cần thiết nếu chúng chưa tồn tại. Nó cũng sẽ thêm dữ liệu mẫu vào các
          bảng.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={setupDatabase}
          disabled={loading}
          className={`px-4 py-2 rounded ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
        >
          {loading ? "Đang thiết lập..." : "Thiết lập cơ sở dữ liệu"}
        </button>

        <Link
          href="/test-db"
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded"
        >
          Quay lại trang kiểm tra
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Lỗi!</p>
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div
          className={`p-4 mb-4 rounded ${
            result.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          <p className="font-bold">
            {result.success ? "Thành công!" : "Thất bại!"}
          </p>
          <p>{result.message}</p>
          {result.error && <p className="mt-2">Lỗi: {result.error}</p>}
        </div>
      )}
    </div>
  );
}
