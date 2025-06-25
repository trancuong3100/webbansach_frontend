import React from "react";
import SachModel from "../models/SachModel";
import { my_request } from "./Request";

export async function layToanBoSach(): Promise<SachModel[]> {
  const result: SachModel[] = [];
  
  const endpoint: string = "http://localhost:8080/books";
  const response = await my_request(endpoint);
  
  const responseData = response._embedded.saches;
  console.log(responseData);
  
  for (const key in responseData) {
    result.push({
      maSach: responseData[key].maSach,
      tenSach: responseData[key].tenSach,
      tenTacGia: responseData[key].tenTacGia,
      ISBN: responseData[key].ISBN,
      moTa: responseData[key].moTa,
      giaNiemYet: responseData[key].giaNiemYet,
      giaBan: responseData[key].giaBan,
      soLuong: responseData[key].soLuong,
      trungBinhXepHang: responseData[key].trungBinhXepHang,
    });
  }
  
  return result;
}

// Function mới để lấy sách theo mã thể loại
export async function laySachTheoTheLoai(
  maTheLoai: number,
  page: number = 0,
  size: number = 20,
  sort: string = ""
): Promise<{
  saches: SachModel[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}> {
  const result: SachModel[] = [];
  
  // Xây dựng URL với các tham số
  let endpoint = `http://localhost:8080/books/search/findByDanhSachTheLoai_MaTheLoai?maTheLoai=${maTheLoai}&page=${page}&size=${size}`;
  
  if (sort) {
    endpoint += `&sort=${sort}`;
  }
  
  const response = await my_request(endpoint);
  
  // Lấy dữ liệu sách
  const responseData = response._embedded?.saches || [];
  console.log("Sách theo thể loại:", responseData);
  
  for (const key in responseData) {
    result.push({
      maSach: responseData[key].maSach,
      tenSach: responseData[key].tenSach,
      tenTacGia: responseData[key].tenTacGia,
      ISBN: responseData[key].ISBN,
      moTa: responseData[key].moTa,
      giaNiemYet: responseData[key].giaNiemYet,
      giaBan: responseData[key].giaBan,
      soLuong: responseData[key].soLuong,
      trungBinhXepHang: responseData[key].trungBinhXepHang,
    });
  }
  
  // Trả về kết quả kèm thông tin phân trang
  return {
    saches: result,
    totalElements: response.page?.totalElements || 0,
    totalPages: response.page?.totalPages || 0,
    currentPage: response.page?.number || 0,
  };
}

// Function để lấy sách với tìm kiếm và lọc theo thể loại
export async function laySachVoiBoLoc(
  maTheLoai?: number,
  tuKhoa?: string,
  page: number = 0,
  size: number = 20,
  sort: string = ""
): Promise<{
  saches: SachModel[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
}> {
  let endpoint = "http://localhost:8080/books";
  
  // Nếu có mã thể loại, dùng API tìm theo thể loại
  if (maTheLoai && maTheLoai > 0) {
    endpoint = `http://localhost:8080/books/search/findByDanhSachTheLoai_MaTheLoai?maTheLoai=${maTheLoai}&page=${page}&size=${size}`;
  } else {
    // Nếu không có mã thể loại, lấy tất cả sách
    endpoint = `http://localhost:8080/books?page=${page}&size=${size}`;
  }
  
  if (sort) {
    endpoint += `&sort=${sort}`;
  }
  
  const response = await my_request(endpoint);
  const responseData = response._embedded?.saches || [];
  
  let result: SachModel[] = [];
  
  for (const key in responseData) {
    result.push({
      maSach: responseData[key].maSach,
      tenSach: responseData[key].tenSach,
      tenTacGia: responseData[key].tenTacGia,
      ISBN: responseData[key].ISBN,
      moTa: responseData[key].moTa,
      giaNiemYet: responseData[key].giaNiemYet,
      giaBan: responseData[key].giaBan,
      soLuong: responseData[key].soLuong,
      trungBinhXepHang: responseData[key].trungBinhXepHang,
    });
  }
  
  // Nếu có từ khóa tìm kiếm, lọc kết quả
  if (tuKhoa && tuKhoa.trim() !== "") {
    const tuKhoaLowerCase = tuKhoa.toLowerCase();
    result = result.filter(
      (sach) =>
        sach.tenSach?.toLowerCase().includes(tuKhoaLowerCase) ||
        sach.tenTacGia?.toLowerCase().includes(tuKhoaLowerCase)
    );
  }
  
  return {
    saches: result,
    totalElements: response.page?.totalElements || result.length,
    totalPages: response.page?.totalPages || Math.ceil(result.length / size),
    currentPage: response.page?.number || 0,
  };
}


// Thêm vào file SachAPI.js (hoặc file tương tự)
export async function laySachTheoMa(maSach: number): Promise<SachModel | null> {
  try {
    const endpoint: string = `http://localhost:8080/books/${maSach}`;
    const response = await my_request(endpoint);
    
    if (response) {
      return {
        maSach: response.maSach,
        tenSach: response.tenSach,
        tenTacGia: response.tenTacGia,
        ISBN: response.ISBN,
        moTa: response.moTa,
        giaNiemYet: response.giaNiemYet,
        giaBan: response.giaBan,
        soLuong: response.soLuong,
        trungBinhXepHang: response.trungBinhXepHang,
      };
    }
    return null;
  } catch (error) {
    console.error('Lỗi khi lấy sách theo mã:', error);
    return null;
  }
}