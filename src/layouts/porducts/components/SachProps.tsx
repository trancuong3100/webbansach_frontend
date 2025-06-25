import React, { useEffect, useState } from "react";
import { ShoppingCart, User, Search, Star, ShoppingBag } from "lucide-react";
import SachModel from "../../../models/SachModel";
import HinhAnhModel from "../../../models/HinhAnhModel";
import { layToanBoAnhCuaMotBoSach } from "../../../api/HinhAnhApi";

interface SachPropsInterFace {
  book: SachModel;
}

const SachProps: React.FC<SachPropsInterFace> = (props) => {
  const maSach: number = props.book.maSach;

  const [danhSachAnh, setDanhSachAnh] = useState<HinhAnhModel[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [baoLoi, setBaoLoi] = useState(null);

  

  useEffect(
    () => {
      layToanBoAnhCuaMotBoSach(maSach)
        .then(hinhAnhData => {
          setDanhSachAnh(hinhAnhData);
          setDangTaiDuLieu(false);
        })
        .catch((error) => {
          setDangTaiDuLieu(false);
          setBaoLoi(error.message);
        });
    },
    [] // Chi goi mot lan
  );

  

  if (dangTaiDuLieu) {
    return (
      <>
        <h1>Đăng tải dữ liệu</h1>
      </>
    );
  }

  if (baoLoi) {
    return (
      <>
        <h1>Gặp lỗi: {baoLoi}</h1>
      </>
    );
  }
  return (
    <div className="col-lg-4 col-md-4 col-sm-6 mb-4">
      <div className="card h-100 shadow-sm">
        <img
          src={danhSachAnh[0].duLieuAnh} // Add a default image
          className="card-img-top"
          alt={props.book.tenSach || "Book"}
          style={{ height: "250px", objectFit: "cover" }}
        />
        <div className="card-body d-flex flex-column">
          <h6 className="card-title fw-bold">{props.book.tenSach}</h6>
          <p className="card-text text-muted small mb-2">
            {props.book.tenTacGia}
          </p>
          <div className="d-flex align-items-center mb-2">
            <Star className="text-warning me-1" size={14} fill="currentColor" />
            <small className="text-muted">
              {props.book.trungBinhXepHang?.toFixed(1) || "N/A"}
            </small>
          </div>
          <div className="mt-auto">
            <p className="text-primary fw-bold mb-2">
              {props.book.giaBan?.toLocaleString() || "0"}đ
            </p>
            <button className="btn btn-primary w-100 btn-sm">
              <ShoppingCart size={16} className="me-1" />
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SachProps;
