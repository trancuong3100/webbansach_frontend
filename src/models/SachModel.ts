class SachModel {
    maSach: number;
    tenSach?: string;
    tenTacGia?: string;
    ISBN?: string;
    moTa?: string;
    giaNiemYet?: number;
    giaBan?: number;
    soLuong?: number;
    trungBinhXepHang?: number;

    constructor(
        maSach: number,
        tenSach?: string,
        tenTacGia?: string,
        ISBN?: string,
        moTa?: string,
        giaNiemYet?: number,
        giaBan?: number,
        soLuong?: number,
        trungBinhXepHang?: number
    ) {
        this.maSach = maSach;
        this.tenSach = tenSach;
        this.tenTacGia = tenTacGia;
        this.ISBN = ISBN;
        this.moTa = moTa;
        this.giaNiemYet = giaNiemYet;
        this.giaBan = giaBan;
        this.soLuong = soLuong;
        this.trungBinhXepHang = trungBinhXepHang;
    }
}

export default SachModel;
