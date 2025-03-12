"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TestDBPage() {
  const [dbStatus, setDbStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/test-db");
        const data = await response.json();
        setDbStatus(data);
      } catch (error) {
        console.error("Error checking database:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    checkDatabase();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Kiểm tra kết nối cơ sở dữ liệu
      </h1>

      <div className="mb-6">
        <Link
          href="/test-db/setup"
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded"
        >
          Thiết lập cơ sở dữ liệu
        </Link>
      </div>

      {loading ? (
        <div className="text-center">
          <p>Đang kiểm tra kết nối cơ sở dữ liệu...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Lỗi!</p>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          <div
            className={`p-4 mb-4 rounded ${
              dbStatus?.success
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            <p className="font-bold">
              {dbStatus?.success ? "Thành công!" : "Thất bại!"}
            </p>
            <p>{dbStatus?.message}</p>
            {dbStatus?.error && <p className="mt-2">Lỗi: {dbStatus.error}</p>}
          </div>

          {dbStatus?.tables && (
            <div className="mt-6">
              <h2 className="text-2xl font-bold mb-4">Trạng thái các bảng</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(dbStatus.tables).map(
                  ([tableName, tableInfo]) => (
                    <div
                      key={tableName}
                      className={`p-4 rounded ${
                        tableInfo.exists
                          ? "bg-green-50 border border-green-200"
                          : "bg-red-50 border border-red-200"
                      }`}
                    >
                      <h3 className="text-lg font-bold mb-2">{tableName}</h3>
                      {tableInfo.exists ? (
                        <p>Số bản ghi: {tableInfo.count}</p>
                      ) : (
                        <p className="text-red-600">
                          Bảng không tồn tại: {tableInfo.error}
                        </p>
                      )}
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
