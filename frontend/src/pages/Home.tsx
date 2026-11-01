import { useState, useEffect } from 'react';
import {
  Row,
  Col,
  Typography,
  Button,
  Card,
  Space,
  Tag,
  Grid,
  Carousel,
  message,
} from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../context/CartContext';
import { GiftOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

interface Product {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  image: string;
  sale?: boolean;
  discount?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Banner {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  color: string;
}

const Home: React.FC = () => {
  const screens = useBreakpoint();
  const isMobile = !screens.md;
  const [currentSlide, setCurrentSlide] = useState(0);
  const { addToCart } = useCart();

  // Dữ liệu banner - 4 ảnh
  const banners: Banner[] = [
    {
      id: 1,
      image: '/banner1.jpg',
      title: 'Bộ sưu tập Gốm Pastel',
      subtitle: 'Nét pastel dịu dàng, nâng niu từng khoảnh khắc',
      color: '#e8d5c4',
    },
    {
      id: 2,
      image: '/banner2.jpg',
      title: 'Gốm sứ cao cấp',
      subtitle: 'An toàn sức khỏe - Mẫu mã tinh tế',
      color: '#d4c5b2',
    },
    {
      id: 3,
      image: '/banner3.jpg',
      title: 'Pastel chạm cảm xúc',
      subtitle: 'Cho không gian sống thêm an yên',
      color: '#f0e6d3',
    },
    {
      id: 4,
      image: '/banner4.jpg',
      title: 'Thủ công tinh xảo',
      subtitle: 'Mỗi sản phẩm là một tác phẩm nghệ thuật',
      color: '#a67c52',
    },
  ];

  const products: Product[] = [
    {
      id: 1,
      name: 'Bộ ấm trà Pastel',
      price: 1290000,
      image: 'https://via.placeholder.com/400x400/e8d5c4/ffffff?text=Ấm+Trà+Pastel',
    },
    {
      id: 2,
      name: 'Đĩa gốm hoa văn',
      price: 890000,
      image: 'https://via.placeholder.com/400x400/d4c5b2/ffffff?text=Đĩa+Gốm',
    },
    {
      id: 3,
      name: 'Tách trà cao cấp',
      price: 1540000,
      oldPrice: 2200000,
      image: 'https://via.placeholder.com/400x400/f0e6d3/ffffff?text=Tách+Trà',
      sale: true,
      discount: '-30%',
    },
    {
      id: 4,
      name: 'Bình hoa thủ công',
      price: 650000,
      image: 'https://via.placeholder.com/400x400/a67c52/ffffff?text=Bình+Hoa',
    },
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Auto play banner - Cập nhật currentSlide mỗi 3 giây
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Thêm vào giỏ hàng: lưu vào context để Checkout dùng được
  const handleAddToCart = (product: Product) => {
    addToCart(product);
    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

  return (
    <div className="home-container" style={{ paddingTop: '0' }}>

      {/* BANNER SLIDER */}
      <div style={{ marginBottom: '40px', position: 'relative', padding: '0 20px' }}>
        <Carousel
          autoplay
          autoplaySpeed={3000}
          dots={false}
          effect="fade"
          beforeChange={(_, to) => setCurrentSlide(to)}
          style={{
            width: '100%',
            overflow: 'hidden',
            borderRadius: '16px',
          }}
        >
          {banners.map((banner) => (
            <div key={banner.id}>
              <div
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '15.5/5',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: '16px',
                  background: banner.color,
                }}
              >
                <img
                  src={banner.image}
                  alt={banner.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block',
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: '24px',
                    bottom: '24px',
                    color: '#fff',
                    textShadow: '0 10px 30px rgba(0,0,0,0.4)',
                    maxWidth: isMobile ? '70%' : '40%',
                  }}
                >
                  <Title level={isMobile ? 4 : 2} style={{ color: '#fff', marginBottom: 8 }}>
                    {banner.title}
                  </Title>
                  <Paragraph style={{ color: '#fff', fontSize: isMobile ? '14px' : '18px', marginBottom: 0 }}>
                    {banner.subtitle}
                  </Paragraph>
                </div>
              </div>
            </div>
          ))}
        </Carousel>

        <div
          style={{
            position: 'absolute',
            bottom: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 10,
          }}
        >
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              style={{
                width: index === currentSlide ? 14 : 10,
                height: index === currentSlide ? 14 : 10,
                borderRadius: '50%',
                background: index === currentSlide ? '#fff' : 'rgba(255,255,255,0.6)',
                transition: 'width 0.2s ease, height 0.2s ease',
                cursor: 'pointer',
              }}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
      </div>

      {/* HERO SECTION - CHỮ BÊN TRÁI, ẢNH BÊN PHẢI */}
      <Row 
        gutter={[40, 40]} 
        className="hero-section" 
        align="middle"
        style={{
          minHeight: 'calc(100vh - 80px)',
          padding: '40px 20px',
          background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0eb 100%)',
        }}
      >
        <Col xs={24} lg={12}>
          <Space 
            orientation="vertical"
            size="large" 
            style={{ width: '100%' }}
          >
            <Tag 
              className="hero-badge"
              style={{
                background: '#b8860b',
                color: 'white',
                border: 'none',
                padding: '8px 20px',
                borderRadius: '20px',
                fontSize: '14px',
                width: 'fit-content'
              }}
            >
              ✨ Thủ công tinh xảo
            </Tag>
            
            <Title 
              level={1} 
              className="hero-title"
              style={{
                fontSize: isMobile ? '40px' : '56px',
                fontWeight: 700,
                marginBottom: 0,
                lineHeight: 1.2
              }}
            >
              Nơi tinh hoa <br />
              <span style={{ color: '#b8860b' }}>thủ công</span> hội tụ
            </Title>
            
            <Paragraph 
              className="hero-description"
              style={{
                fontSize: '18px',
                color: '#666',
                maxWidth: '500px',
                lineHeight: 1.8
              }}
            >
              Mỗi sản phẩm H2DOR đều được chăm chút tỉ mỉ từ đôi tay nghệ nhân,
              mang đến vẻ đẹp độc bản và đẳng cấp.
            </Paragraph>
            
            <Space wrap size="middle">
              <Button 
                type="primary" 
                size="large" 
                style={{
                  background: '#b8860b',
                  borderColor: '#b8860b',
                  height: '48px',
                  padding: '0 40px',
                  borderRadius: '8px',
                  fontWeight: 500
                }}
                className="hover:bg-amber-600"
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Khám phá ngay
              </Button>
              <Button 
                size="large"
                style={{
                  height: '48px',
                  padding: '0 40px',
                  borderRadius: '8px',
                  borderColor: '#b8860b',
                  color: '#b8860b',
                  fontWeight: 500
                }}
                onClick={() => {
                  document.getElementById('products-section')?.scrollIntoView({ 
                    behavior: 'smooth' 
                  });
                }}
              >
                Xem bộ sưu tập
              </Button>
            </Space>
          </Space>
        </Col>

        <Col xs={24} lg={12}>
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <img
      src="/anh1.jpg"
      alt="Bộ sưu tập gốm"
      style={{
        width: "100%",
        maxWidth: "500px",
        borderRadius: "15px",
        objectFit: "cover",
        boxShadow: "0 15px 40px rgba(0,0,0,0.15)",
      }}
    />
  </div>
</Col>
      </Row>

      {/* SẢN PHẨM NỔI BẬT */}
      <div id="products-section" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <Row justify="space-between" align="bottom" style={{ marginBottom: '40px' }}>
          <Col>
            <Title level={2} style={{ marginBottom: 0 }}>
              Sản phẩm <span style={{ color: '#b8860b' }}>nổi bật</span>
            </Title>
          </Col>
        </Row>

        <Row gutter={[24, 24]} className="product-grid">
          {products.map((product) => (
            <Col xs={24} sm={12} lg={6} key={product.id}>
              <Card
                hoverable
                className="product-card-item"
                style={{
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  cursor: 'pointer'
                }}
                cover={
                  <div 
                    className="product-img-box"
                    style={{
                      height: '200px',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      background: '#faf8f5',
                      position: 'relative'
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    {product.sale && (
                      <Tag 
                        color="red" 
                        style={{
                          position: 'absolute',
                          top: 10,
                          right: 10,
                          borderRadius: '4px'
                        }}
                      >
                        {product.discount}
                      </Tag>
                    )}
                  </div>
                }
                actions={[
                  <Button 
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    style={{
                      background: '#b8860b',
                      borderColor: '#b8860b',
                      fontWeight: 500
                    }}
                    onClick={() => handleAddToCart(product)}
                  >
                    Thêm vào giỏ
                  </Button>,
                ]}
              >
                <Card.Meta
                  title={
                    <div>
                      <Text strong style={{ fontSize: 16 }}>
                        {product.name}
                      </Text>
                    </div>
                  }
                  description={
                    <div className="product-price-box" style={{ marginTop: '8px' }}>
                      {product.oldPrice && (
                        <Text 
                          delete 
                          className="product-old-price"
                          style={{ color: '#999', marginRight: '8px' }}
                        >
                          {formatPrice(product.oldPrice)}
                        </Text>
                      )}
                      <Text 
                        strong 
                        className="product-current-price"
                        style={{ 
                          color: '#b8860b', 
                          fontSize: '18px'
                        }}
                      >
                        {formatPrice(product.price)}
                      </Text>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      {/* ƯU ĐÃI */}
      <div 
        className="promo-banner"
        style={{
          background: 'linear-gradient(135deg, #b8860b 0%, #8b6914 100%)',
          padding: '60px 20px',
          marginTop: '40px'
        }}
      >
        <Row 
          gutter={[24, 24]} 
          align="middle" 
          justify="space-between"
          style={{ maxWidth: '1200px', margin: '0 auto' }}
        >
          <Col xs={24} md={8}>
            <Title 
              level={3} 
              className="promo-title"
              style={{ color: 'white', marginBottom: '16px' }}
            >
              <GiftOutlined /> Ưu đãi <span style={{ color: '#ffd700' }}>đặc biệt</span>
            </Title>
            <Paragraph 
              className="promo-description"
              style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }}
            >
              Đặt hàng hôm nay nhận ưu đãi lên đến 30% cho đơn đầu tiên.
              <br />
              Miễn phí vận chuyển cho đơn hàng từ 500k.
            </Paragraph>
          </Col>

          <Col xs={24} md={4}>
            <div 
              className="promo-code-box"
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: '2px dashed rgba(255,255,255,0.3)',
                borderRadius: '12px',
                padding: '16px 24px',
                textAlign: 'center',
                color: 'white',
                fontSize: '20px',
                fontWeight: 'bold',
                letterSpacing: '2px'
              }}
            >
              H2DOR30
            </div>
          </Col>

          <Col xs={24} md={6}>
            <Button 
              type="primary" 
              size="large"
              style={{
                background: 'white',
                color: '#b8860b',
                border: 'none',
                height: '48px',
                padding: '0 40px',
                borderRadius: '8px',
                fontWeight: 600,
                width: isMobile ? '100%' : 'auto'
              }}
              className="hover:bg-gray-50"
            >
              Nhận ưu đãi
            </Button>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Home;