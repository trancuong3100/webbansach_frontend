import React, { useState, useEffect, JSX } from 'react';
import { Star, Heart, ShoppingCart, Minus, Plus, Share2, ArrowLeft } from 'lucide-react';

// Import models
import SachModel from '../../models/SachModel';
import HinhAnhModel from '../../models/HinhAnhModel';

// Import API functions
import { laySachTheoMa } from '../../api/SachApi';
import { layToanBoAnhCuaMotBoSach } from '../../api/HinhAnhApi';

const BookDetailPage: React.FC = () => {
  // Fix state type definitions
  const [book, setBook] = useState<SachModel | null>(null);
  const [images, setImages] = useState<HinhAnhModel[]>([]);
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('description');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Get book ID from URL params (mock implementation)
  const maSach = 1; // In real app, get this from URL params or props

  useEffect(() => {
    const loadBookData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load book data and images in parallel
        const [bookData, imageData] = await Promise.all([
          laySachTheoMa(maSach),
          layToanBoAnhCuaMotBoSach(maSach)
        ]);

        setBook(bookData);
        setImages(imageData || []); // Ensure images is always an array
      } catch (err) {
        console.error('Lỗi khi tải dữ liệu:', err);
        setError("Không thể tải thông tin sách. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    loadBookData();
  }, [maSach]);

  const formatPrice = (price: number | undefined): string => {
    if (!price) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const calculateDiscount = (): number => {
    if (book?.giaNiemYet && book?.giaBan && book.giaNiemYet > book.giaBan) {
      return Math.round(((book.giaNiemYet - book.giaBan) / book.giaNiemYet) * 100);
    }
    return 0;
  };

  const renderStars = (rating: number | undefined): JSX.Element[] => {
    const stars: JSX.Element[] = [];
    const safeRating = rating || 0;
    const fullStars = Math.floor(safeRating);
    const hasHalfStar = safeRating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-5 h-5 fill-amber-400/50 text-amber-400" />);
    }

    const remainingStars = 5 - Math.ceil(safeRating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-5 h-5 text-gray-300" />);
    }

    return stars;
  };

  const handleQuantityChange = (delta: number): void => {
    const newQuantity = quantity + delta;
    const maxQuantity = book?.soLuong || 0;
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity);
    }
  };

  const renderImage = (imageData: HinhAnhModel | null): string | null => {
    if (!imageData) return null;
    
    if (imageData.duLieuAnh) {
      return `data:image/jpeg;base64,${imageData.duLieuAnh}`;
    }
    if (imageData.duongDan) {
      return imageData.duongDan;
    }
    return null;
  };

  const getMainImage = (): HinhAnhModel | null => {
    if (!images || images.length === 0) return null;
    
    const iconImage = images.find(img => img.laIcon);
    return iconImage || images[selectedImage] || images[0];
  };

 const handleAddToCart = (): void => {
  if (book && book.soLuong && book.soLuong > 0) {
    // Implement add to cart logic here
    console.log(`Thêm ${quantity} cuốn "${book.tenSach}" vào giỏ hàng`);
  }
};

const handleBuyNow = (): void => {
  if (book && book.soLuong && book.soLuong > 0) {
    // Implement buy now logic here
    console.log(`Mua ngay ${quantity} cuốn "${book.tenSach}"`);
  }
};

  const handleGoBack = (): void => {
    // Implement navigation back logic
    window.history.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin sách...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Có lỗi xảy ra</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy sách</h2>
          <p className="text-gray-600">Sách bạn đang tìm kiếm không tồn tại.</p>
        </div>
      </div>
    );
  }

  const mainImage = getMainImage();
  const discount = calculateDiscount();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button 
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Quay lại</span>
        </button>

        {/* Breadcrumb */}
        <nav className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Sách</span>
            <span>/</span>
            <span className="text-gray-900 font-medium">{book.tenSach}</span>
          </div>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] bg-white rounded-lg shadow-lg overflow-hidden">
              {mainImage && renderImage(mainImage) ? (
                <img
                  src={renderImage(mainImage)!}
                  alt={book.tenSach || 'Ảnh sách'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                  <div className="text-center text-gray-600">
                    <div className="text-6xl mb-4">📚</div>
                    <p className="text-lg font-medium">{book.tenSach}</p>
                  </div>
                </div>
              )}
            </div>
            
            {images && images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(0, 4).map((image, index) => (
                  <div 
                    key={image.maHinhAnh || index} 
                    className={`aspect-[3/4] bg-white rounded border-2 cursor-pointer transition-colors ${
                      selectedImage === index ? 'border-blue-500' : 'border-transparent hover:border-blue-300'
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    {renderImage(image) ? (
                      <img
                        src={renderImage(image)!}
                        alt={image.tenHinhAnh || `Ảnh ${index + 1}`}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center rounded">
                        <span className="text-gray-400 text-xs">Ảnh {index + 1}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.tenSach}</h1>
              <p className="text-xl text-gray-600">
                Tác giả: <span className="font-medium">{book.tenTacGia || 'Chưa xác định'}</span>
              </p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {renderStars(book.trungBinhXepHang)}
              </div>
              <span className="text-lg font-medium text-gray-900">
                {book.trungBinhXepHang || 0}
              </span>
              <span className="text-gray-500">(248 đánh giá)</span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-red-600">
                  {formatPrice(book.giaBan)}
                </span>
                {discount > 0 && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(book.giaNiemYet)}
                    </span>
                    <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm font-medium">
                      -{discount}%
                    </span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">Đã bao gồm VAT</p>
            </div>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                (book.soLuong || 0) > 0 ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              <span className="font-medium">
                {(book.soLuong || 0) > 0 ? `Còn ${book.soLuong} sản phẩm` : 'Hết hàng'}
              </span>
            </div>

            {/* ISBN */}
            {book.ISBN && (
              <div className="text-sm text-gray-600">
                <span className="font-medium">ISBN:</span> {book.ISBN}
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Số lượng:</span>
                <div className="flex items-center border border-gray-300 rounded">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= (book.soLuong || 0)}
                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={(book.soLuong || 0) === 0}
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Thêm vào giỏ hàng</span>
                </button>
                <button
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    isWishlisted 
                      ? 'border-red-500 bg-red-50 text-red-600' 
                      : 'border-gray-300 hover:border-red-500 hover:text-red-600'
                  }`}
                >
                  <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button className="p-3 rounded-lg border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600 transition-colors">
                  <Share2 className="w-6 h-6" />
                </button>
              </div>

              <button 
                onClick={handleBuyNow}
                className="w-full bg-orange-500 text-white py-3 px-6 rounded-lg font-medium hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={(book.soLuong || 0) === 0}
              >
                Mua ngay
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  🚚
                </div>
                <span>Miễn phí vận chuyển</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  ↩️
                </div>
                <span>Đổi trả trong 7 ngày</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  🏆
                </div>
                <span>Hàng chính hãng</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  💳
                </div>
                <span>Thanh toán an toàn</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white rounded-lg shadow-lg">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'description', label: 'Mô tả sản phẩm' },
                { id: 'specs', label: 'Thông số kỹ thuật' },
                { id: 'reviews', label: 'Đánh giá (248)' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'description' && (
              <div className="prose max-w-none">
                <h3 className="text-xl font-semibold mb-4">Mô tả sản phẩm</h3>
                <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {book.moTa || 'Chưa có mô tả cho sản phẩm này.'}
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Thông số kỹ thuật</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Mã sách:</span>
                      <span className="text-gray-900">{book.maSach}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Tên sách:</span>
                      <span className="text-gray-900">{book.tenSach}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Tác giả:</span>
                      <span className="text-gray-900">{book.tenTacGia || 'Chưa xác định'}</span>
                    </div>
                    {book.ISBN && (
                      <div className="flex justify-between py-2 border-b border-gray-100">
                        <span className="font-medium text-gray-600">ISBN:</span>
                        <span className="text-gray-900">{book.ISBN}</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Giá niêm yết:</span>
                      <span className="text-gray-900">{formatPrice(book.giaNiemYet)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Giá bán:</span>
                      <span className="text-gray-900">{formatPrice(book.giaBan)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Số lượng:</span>
                      <span className="text-gray-900">{book.soLuong || 0}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600">Đánh giá:</span>
                      <span className="text-gray-900">{book.trungBinhXepHang || 0}/5</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Đánh giá từ khách hàng</h3>
                <div className="space-y-6">
                  {[1, 2, 3].map((review) => (
                    <div key={review} className="border-b border-gray-100 pb-4">
                      <div className="flex items-center space-x-4 mb-2">
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">KH</span>
                        </div>
                        <div>
                          <p className="font-medium">Khách hàng {review}</p>
                          <div className="flex items-center space-x-1">
                            {renderStars(5)}
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 ml-14">
                        Sách rất hay, nội dung bổ ích và dễ hiểu. Giao hàng nhanh chóng, đóng gói cẩn thận. Sẽ ủng hộ shop tiếp!
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;