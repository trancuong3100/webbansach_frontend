import { BrowserRouter, Route, Routes } from "react-router-dom";
import { layToanBoSach } from "./api/SachApi";
import "./App.css";
import Footer from "./layouts/header-footer/footer";
import NavBar from "./layouts/header-footer/NavBar";
import DanhSachSanPham from "./layouts/porducts/DanhSachSanPham";
import BookDetailPage from "./layouts/porducts/BookDetailPage";

function App() {
  return (
    <>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<DanhSachSanPham />}/> 
          <Route path="/product-detail" element={<BookDetailPage />}/> 
        </Routes>
        <Footer />
      </BrowserRouter>
    </>
  );
}

export default App;
