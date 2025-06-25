// models/ChiTietDonHangModel.ts

class ChiTietDonHangModel {
    chiTietDonHang: number;
    soLuong: number;
    giaBan: number;

    constructor(
        chiTietDonHang: number,
        soLuong: number,
        giaBan: number
    ) {
        this.chiTietDonHang = chiTietDonHang;
        this.soLuong = soLuong;
        this.giaBan = giaBan;
    }
}

export default ChiTietDonHangModel;
