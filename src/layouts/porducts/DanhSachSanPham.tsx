import React, { useEffect, useState, useCallback } from "react";
import { ShoppingCart, User, Search, ShoppingBag } from "lucide-react";
import SachModel from "../../models/SachModel";
import SachProps from "./components/SachProps";
import { layToanBoSach, laySachVoiBoLoc } from "../../api/SachApi";
import { PhanTrang } from "../../utils/PhanTrang";
import { useParams } from "react-router-dom";

const DanhSachSanPham: React.FC = () => {
  const [danhSachQuyenSach, setDanhSachQuyenSach] = useState<SachModel[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [baoLoi, setBaoLoi] = useState<string | null>(null);

  // State cho phân trang
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [soLuongMoiTrang] = useState(6);
  const [tongSoTrang, setTongSoTrang] = useState(0);
  const [tongSoPhanTu, setTongSoPhanTu] = useState(0);

  // State cho tìm kiếm và lọc
  const [tuKhoaTimKiem, setTuKhoaTimKiem] = useState(""); // Giá trị trong input
  const [tuKhoaTimKiemThucTe, setTuKhoaTimKiemThucTe] = useState(""); // Giá trị thực sự để tìm kiếm
  const [danhMucDuocChon, setDanhMucDuocChon] = useState("Tất cả");
  const [dangTimKiem, setDangTimKiem] = useState(false);

  // Lấy mã thể loại từ URL params
  const { maTheLoai } = useParams();
  let maTheLoaiNumber = 0;
  try {
    maTheLoaiNumber = parseInt(maTheLoai + "");
  } catch (error) {
    maTheLoaiNumber = 0;
    console.log("Error parsing maTheLoai:", error);
  }

  if (Number.isNaN(maTheLoaiNumber)) maTheLoaiNumber = 0;

  const categories = [
    { ten: "Tất cả", ma: 0 },
    { ten: "Kinh doanh", ma: 1 },
    { ten: "Tâm lý học", ma: 2 },
    { ten: "Văn học", ma: 3 },
    { ten: "Khoa học", ma: 4 },
    { ten: "Lịch sử", ma: 5 },
  ];

  // Function để tải dữ liệu
  const taiDuLieu = async () => {
    try {
      setDangTaiDuLieu(true);
      setBaoLoi(null);

      // Xác định mã thể loại để tìm kiếm
      let maTheLoaiTimKiem = 0;
      if (maTheLoaiNumber > 0) {
        maTheLoaiTimKiem = maTheLoaiNumber;
      } else if (danhMucDuocChon !== "Tất cả") {
        const danhMucTimThay = categories.find(cat => cat.ten === danhMucDuocChon);
        maTheLoaiTimKiem = danhMucTimThay ? danhMucTimThay.ma : 0;
      }

      // Gọi API với phân trang
      const response = await laySachVoiBoLoc(
        maTheLoaiTimKiem > 0 ? maTheLoaiTimKiem : undefined,
        tuKhoaTimKiemThucTe, // Sử dụng từ khóa thực tế
        trangHienTai - 1, // API dùng index từ 0
        soLuongMoiTrang,
        "tenSach,asc" // Sắp xếp theo tên sách
      );

      setDanhSachQuyenSach(response.saches);
      setTongSoTrang(response.totalPages);
      setTongSoPhanTu(response.totalElements);
      
      // Cập nhật danh mục được chọn nếu có mã thể loại từ URL
      if (maTheLoaiNumber > 0) {
        const danhMucTimThay = categories.find(cat => cat.ma === maTheLoaiNumber);
        if (danhMucTimThay) {
          setDanhMucDuocChon(danhMucTimThay.ten);
        }
      }

    } catch (error: any) {
      setBaoLoi(error.message);
      console.error("Lỗi khi tải dữ liệu:", error);
    } finally {
      setDangTaiDuLieu(false);
    }
  };

  // Effect để tải dữ liệu khi component mount hoặc khi các dependency thay đổi
  useEffect(() => {
    taiDuLieu();
  }, [trangHienTai, tuKhoaTimKiemThucTe, danhMucDuocChon, maTheLoaiNumber]);

  // Xử lý thay đổi trang
  const xuLyDoiTrang = (trangMoi: number) => {
    setTrangHienTai(trangMoi);
    // Cuộn lên đầu trang
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Xử lý thay đổi danh mục
  const xuLyDoiDanhMuc = (danhMuc: string) => {
    setDanhMucDuocChon(danhMuc);
    setTrangHienTai(1); // Reset về trang đầu
  };

  // Xử lý thay đổi input tìm kiếm
  const xuLyThayDoiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTuKhoaTimKiem(e.target.value);
  };

  // Xử lý tìm kiếm khi nhấn nút
  const xuLyTimKiem = () => {
    setTuKhoaTimKiemThucTe(tuKhoaTimKiem);
    setTrangHienTai(1); // Reset về trang đầu
  };

  // Xử lý nhấn Enter trong input
  const xuLyNhanEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      xuLyTimKiem();
    }
  };

  // Xử lý xóa tìm kiếm
  const xuLyXoaTimKiem = () => {
    setTuKhoaTimKiem("");
    setTuKhoaTimKiemThucTe("");
    setTrangHienTai(1);
  };

  if (dangTaiDuLieu) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải dữ liệu...</span>
        </div>
        <h3 className="mt-3">Đang tải dữ liệu</h3>
      </div>
    );
  }

  if (baoLoi) {
    return (
      <div className="container text-center py-5">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Gặp lỗi!</h4>
          <p>{baoLoi}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="hero-section bg-primary text-white py-5"
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="display-4 fw-bold mb-4">
                Khám phá thế giới tri thức
              </h1>
              <p className="lead mb-4">
                Hàng ngàn đầu sách chất lượng với giá tốt nhất. Giao hàng nhanh
                chóng toàn quốc.
              </p>
              <div className="d-flex gap-3">
                <button className="btn btn-warning btn-lg px-4">
                  <ShoppingBag className="me-2" size={20} />
                  Mua ngay
                </button>
                <button className="btn btn-outline-light btn-lg px-4">
                  Xem thêm
                </button>
              </div>
            </div>
            <div className="col-lg-6">
              <img
                src="https://images.unsplash.com/photo-1682987210469-b53ffcec1bba?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw3fHxib29rcyUyMGJvb2tzdG9yZSUyMGxpYnJhcnklMjByZWFkaW5nfGVufDB8fHx8MTc1MDczMzU5NXww&ixlib=rb-4.1.0&fit=fillmax&h=400&w=600"
                alt="Bookstore"
                className="img-fluid rounded shadow"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container my-5">
        {/* Thanh tìm kiếm */}
        <div className="row mb-4">
          <div className="col-md-6 mx-auto">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                value={tuKhoaTimKiem}
                onChange={xuLyThayDoiInput}
                onKeyPress={xuLyNhanEnter}
              />
              <button
                className="btn btn-primary"
                type="button"
                onClick={xuLyTimKiem}
                title="Tìm kiếm"
              >
                <Search size={20} />
              </button>
              {tuKhoaTimKiem && (
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={xuLyXoaTimKiem}
                  title="Xóa tìm kiếm"
                >
                  ×
                </button>
              )}
            </div>
            {tuKhoaTimKiemThucTe && (
              <small className="text-muted mt-1 d-block">
                Đang tìm kiếm: "{tuKhoaTimKiemThucTe}"
              </small>
            )}
          </div>
        </div>

        {/* Danh mục */}
        <div className="row mb-4">
          <div className="col-12 text-center">
            <h2 className="fw-bold mb-3">Danh mục sách</h2>
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.ma}
                  className={`btn ${
                    cat.ten === danhMucDuocChon
                      ? "btn-primary"
                      : "btn-outline-primary"
                  } mb-2`}
                  onClick={() => xuLyDoiDanhMuc(cat.ten)}
                >
                  {cat.ten}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Thông tin kết quả */}
        <div className="row mb-3">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center">
              <h3 className="fw-bold">
                {danhMucDuocChon === "Tất cả"
                  ? "Tất cả sách"
                  : `Sách ${danhMucDuocChon}`}
              </h3>
              <span className="text-muted">
                Hiển thị {((trangHienTai - 1) * soLuongMoiTrang) + 1}-
                {Math.min(trangHienTai * soLuongMoiTrang, tongSoPhanTu)} 
                trong tổng số {tongSoPhanTu} kết quả
              </span>
            </div>
          </div>
        </div>

        {/* Danh sách sách */}
        <div className="row mb-4">
          {danhSachQuyenSach.length > 0 ? (
            danhSachQuyenSach.map((sach) => (
              <SachProps key={sach.maSach} book={sach} />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <h4>Không tìm thấy sách nào</h4>
              <p className="text-muted">
                {tuKhoaTimKiemThucTe 
                  ? `Không tìm thấy sách nào với từ khóa "${tuKhoaTimKiemThucTe}"`
                  : "Hãy thử thay đổi từ khóa tìm kiếm hoặc danh mục"
                }
              </p>
            </div>
          )}
        </div>

        {/* Component phân trang */}
        {tongSoTrang > 1 && (
          <div className="row">
            <div className="col-12">
              <PhanTrang
                trangHienTai={trangHienTai}
                tongSoTrang={tongSoTrang}
                onChangePage={xuLyDoiTrang}
              />
            </div>
          </div>
        )}

        {/* Phần thông tin về BookStore */}
        <div className="row bg-light rounded p-4 mt-5">
          <div className="col-md-6">
            <h4 className="fw-bold mb-3">Tại sao chọn BookStore?</h4>
            <ul className="list-unstyled">
              <li className="mb-2">✓ Giao hàng miễn phí đơn từ 300k</li>
              <li className="mb-2">✓ Đảm bảo sách chính hãng 100%</li>
              <li className="mb-2">✓ Hỗ trợ 24/7</li>
              <li className="mb-2">✓ Đổi trả dễ dàng trong 7 ngày</li>
            </ul>
          </div>
          <div className="col-md-6">
            <img
              src="https://images.unsplash.com/photo-1623771702034-4ff478ad8e10?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHw4fHxib29rcyUyMGJvb2tzdG9yZSUyMGxpYnJhcnklMjByZWFkaW5nfGVufDB8fHx8MTc1MDczMzU5NXww&ixlib=rb-4.1.0&fit=fillmax&h=250&w=400"
              alt="Reading"
              className="img-fluid rounded"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DanhSachSanPham;