import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  const categories = [
    { ten: "Kinh doanh", ma: 1 },
    { ten: "Tâm lý học", ma: 2 },
    { ten: "Văn học", ma: 3 },
    { ten: "Khoa học", ma: 4 },
    { ten: "Lịch sử", ma: 5 },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Bookstore
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Trang chủ
              </Link>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Thể loại sách
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <Link className="dropdown-item" to="/san-pham">
                  Tất cả sách
                </Link>
                <div className="dropdown-divider"></div>
                {categories.map((category) => (
                  <Link 
                    key={category.ma}
                    className="dropdown-item" 
                    to={`/san-pham/${category.ma}`}
                  >
                    {category.ten}
                  </Link>
                ))}
              </div>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown2"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Quy định bán hàng
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown2">
                <a className="dropdown-item" href="#">
                  Chính sách vận chuyển
                </a>
                <a className="dropdown-item" href="#">
                  Chính sách đổi trả
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Điều khoản sử dụng
                </a>
              </div>
            </li>
            <li className="nav-item">
              <a href="#" className="nav-link">
                Liên hệ
              </a>
            </li>
          </ul>
          
          <form className="form-inline my-2 my-lg-0 mr-3">
            <input
              className="form-control mr-sm-2"
              type="search"
              placeholder="Tìm kiếm"
              aria-label="Search"
            />
            <button
              className="btn btn-outline-success my-2 my-sm-0"
              type="submit"
            >
              Search
            </button>
          </form>
          
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-shopping-cart"></i>
                <span className="d-lg-none ml-2">Giỏ hàng</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                <i className="fas fa-user"></i>
                <span className="d-lg-none ml-2">Tài khoản</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;