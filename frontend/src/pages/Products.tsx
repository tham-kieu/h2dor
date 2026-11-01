import React from 'react';
import { Row, Col, Typography, Card, Button, Tag, Space, Input, Select } from 'antd';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sale?: boolean;
}

const Products: React.FC = () => {
  // Dữ liệu sản phẩm mẫu
  const products: ProductItem[] = [
    { id: 1, name: 'Nhẫn bạc cổ điển', price: 1290000, category: 'Trang sức', image: '💍', sale: false },
    { id: 2, name: 'Vòng tay gỗ sưa', price: 890000, category: 'Phụ kiện', image: '🌿', sale: false },
    { id: 3, name: 'Trâm cài tóc vàng', price: 1540000, category: 'Trang sức', image: '👑', sale: true },
    { id: 4, name: 'Bộ lược sừng trâu', price: 650000, category: 'Phụ kiện', image: '🪶', sale: false },
    { id: 5, name: 'Dây chuyền bạc', price: 2100000, category: 'Trang sức', image: '📿', sale: true },
    { id: 6, name: 'Hộp gỗ khắc chìm', price: 950000, category: 'Đồ gỗ', image: '📦', sale: false },
  ];

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="container" style={{ padding: '40px 24px' }}>
      {/* Header trang */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 32 }}>
        <Col>
          <Title level={2} style={{ fontFamily: 'Playfair Display, serif', margin: 0 }}>
            Tất cả <span style={{ color: '#b8860b' }}>sản phẩm</span>
          </Title>
          <Text type="secondary">Có {products.length} sản phẩm</Text>
        </Col>
        <Col>
          <Space wrap>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              style={{ width: 240 }}
              prefix={<SearchOutlined />}
            />
            <Select defaultValue="all" style={{ width: 150 }}>
              <Option value="all">Tất cả</Option>
              <Option value="trang-suc">Trang sức</Option>
              <Option value="phu-kien">Phụ kiện</Option>
              <Option value="do-go">Đồ gỗ</Option>
            </Select>
            <Button icon={<FilterOutlined />}>Lọc</Button>
          </Space>
        </Col>
      </Row>

      {/* Grid sản phẩm */}
      <Row gutter={[24, 24]}>
        {products.map((product) => (
          <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
            <Card
              hoverable
              style={{ borderRadius: 16, textAlign: 'center' }}
              cover={
                <div
                  style={{
                    background: '#f3ede8',
                    borderRadius: '16px 16px 0 0',
                    height: 200,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 60,
                    color: '#a58d7c',
                  }}
                >
                  {product.image}
                </div>
              }
              actions={[
                <Button type="primary" style={{ borderRadius: 40, width: '100%' }}>
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
                    {product.sale && (
                      <Tag color="red" style={{ marginLeft: 8 }}>
                        -30%
                      </Tag>
                    )}
                  </div>
                }
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 13 }}>
                      {product.category}
                    </Text>
                    <br />
                    <Text strong style={{ fontSize: 20, color: '#b8860b' }}>
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
  );
};

export default Products;