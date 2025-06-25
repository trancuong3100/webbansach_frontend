import React from "react";
import HinhAnhModel from "../models/HinhAnhModel";
import { my_request } from "./Request";


// Sửa function layToanBoAnhCuaMotBoSach
export async function layToanBoAnhCuaMotBoSach(maSach: number): Promise<HinhAnhModel[]> {
  const result: HinhAnhModel[] = [];
  
  try {
    const endpoint: string = `http://localhost:8080/books/${maSach}/danhSachHinhAnh`;
    const response = await my_request(endpoint);
    
    // Kiểm tra xem response có dữ liệu không
    if (response && response._embedded && response._embedded.hinhAnhs) {
      const responseData = response._embedded.hinhAnhs;
      console.log(responseData);
      
      for (const key in responseData) {
        // Tạo object thay vì dùng constructor nếu HinhAnhModel là interface
        const hinhAnh: HinhAnhModel = {
          maHinhAnh: responseData[key].maHinhAnh,
          laIcon: responseData[key].laIcon,
          tenHinhAnh: responseData[key].tenHinhAnh,
          duongDan: responseData[key].duongDan,
          duLieuAnh: responseData[key].duLieuAnh
        };
        
        result.push(hinhAnh);
      }
    }
  } catch (error) {
    console.error('Lỗi khi lấy hình ảnh:', error);
  }
  
  return result;
}