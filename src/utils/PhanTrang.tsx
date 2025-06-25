import React from "react";

interface PhanTrangProps {
  trangHienTai: number;
  tongSoTrang: number;
  onChangePage: (trang: number) => void;
}

export const PhanTrang: React.FC<PhanTrangProps> = ({
  trangHienTai,
  tongSoTrang,
  onChangePage,
}) => {
  // Tạo mảng các số trang để hiển thị
  const taoMangTrang = () => {
    const mang = [];
    const soTrangHienThi = 5; // Hiển thị tối đa 5 số trang
    let trangBatDau = Math.max(1, trangHienTai - 2);
    let trangKetThuc = Math.min(tongSoTrang, trangBatDau + soTrangHienThi - 1);

    // Điều chỉnh lại nếu gần cuối
    if (trangKetThuc - trangBatDau < soTrangHienThi - 1) {
      trangBatDau = Math.max(1, trangKetThuc - soTrangHienThi + 1);
    }

    for (let i = trangBatDau; i <= trangKetThuc; i++) {
      mang.push(i);
    }
    return mang;
  };

  const mangTrang = taoMangTrang();

  return (
    <nav aria-label="Phân trang">
      <ul className="pagination justify-content-center">
        {/* Nút Previous */}
        <li className={`page-item ${trangHienTai === 1 ? "disabled" : ""}`}>
          <button
            className="page-link"
            onClick={() => onChangePage(trangHienTai - 1)}
            disabled={trangHienTai === 1}
          >
            Previous
          </button>
        </li>

        {/* Trang đầu tiên */}
        {mangTrang[0] > 1 && (
          <>
            <li className="page-item">
              <button className="page-link" onClick={() => onChangePage(1)}>
                1
              </button>
            </li>
            {mangTrang[0] > 2 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
          </>
        )}

        {/* Các trang ở giữa */}
        {mangTrang.map((trang) => (
          <li
            key={trang}
            className={`page-item ${trang === trangHienTai ? "active" : ""}`}
          >
            <button
              className="page-link"
              onClick={() => onChangePage(trang)}
            >
              {trang}
              {trang === trangHienTai && (
                <span className="visually-hidden"></span>
              )}
            </button>
          </li>
        ))}

        {/* Trang cuối cùng */}
        {mangTrang[mangTrang.length - 1] < tongSoTrang && (
          <>
            {mangTrang[mangTrang.length - 1] < tongSoTrang - 1 && (
              <li className="page-item disabled">
                <span className="page-link">...</span>
              </li>
            )}
            <li className="page-item">
              <button
                className="page-link"
                onClick={() => onChangePage(tongSoTrang)}
              >
                {tongSoTrang}
              </button>
            </li>
          </>
        )}

        {/* Nút Next */}
        <li
          className={`page-item ${
            trangHienTai === tongSoTrang ? "disabled" : ""
          }`}
        >
          <button
            className="page-link"
            onClick={() => onChangePage(trangHienTai + 1)}
            disabled={trangHienTai === tongSoTrang}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
};