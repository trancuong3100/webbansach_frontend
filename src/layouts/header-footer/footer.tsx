import { Book } from "lucide-react";
import React from "react";

function Footer() {
  return (
    
      
       <footer className="bg-dark text-white py-4">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <h5 className="fw-bold mb-3">
                <Book className="me-2" size={20} />
                BookStore
              </h5>
              <p>Nhà sách trực tuyến uy tín với hàng ngàn đầu sách chất lượng.</p>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold">Danh mục</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white-50 text-decoration-none">Văn học</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Kinh doanh</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Khoa học</a></li>
              </ul>
            </div>
            <div className="col-md-2">
              <h6 className="fw-bold">Hỗ trợ</h6>
              <ul className="list-unstyled">
                <li><a href="#" className="text-white-50 text-decoration-none">Liên hệ</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">FAQ</a></li>
                <li><a href="#" className="text-white-50 text-decoration-none">Chính sách</a></li>
              </ul>
            </div>
            <div className="col-md-4">
              <h6 className="fw-bold">Liên hệ</h6>
              <p className="mb-1">📧 info@bookstore.vn</p>
              <p className="mb-1">📞 1900-xxxx</p>
              <p>📍 Hà Nội, Việt Nam</p>
            </div>
          </div>
          <hr className="my-3" />
          <div className="text-center">
            <p className="mb-0">&copy; 2024 BookStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
  
  );
}

export default Footer;