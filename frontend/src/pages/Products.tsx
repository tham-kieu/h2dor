import React from 'react';
import { useState } from 'react';
import { Row, Col, Typography, Card, Button, Tag, Space, Input, Select, Empty, message } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const { Title, Text } = Typography;
const { Search } = Input;

interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  sale?: boolean;
}

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { addToCart } = useCart();
  const searchQuery = searchParams.get('search') ?? '';

  // Dữ liệu sản phẩm mẫu
  const products: ProductItem[] = [

    { id: 1, name: 'Bình hoa gốm sứ men trắng', price: 450000, category: 'Bình hoa', image: '🏺', sale: false },
    { id: 2, name: 'Bộ ấm trà gốm Bát Tràng', price: 850000, category: 'Ấm chén', image: '🍵', sale: true },
    { id: 3, name: 'Lọ hoa gốm men xanh', price: 520000, category: 'Bình hoa', image: '🏺', sale: false },
    { id: 4, name: 'Bộ bát đĩa gốm sứ', price: 690000, category: 'Bát đĩa', image: '🍽️', sale: true },
    { id: 5, name: 'Cốc sứ thủ công', price: 150000, category: 'Ly cốc', image: '☕', sale: false },
    { id: 6, name: 'Đĩa gốm trang trí', price: 320000, category: 'Đồ trang trí', image: '🍶', sale: false },

  ];

  const normalizeText = (value: string): string =>
    value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLocaleLowerCase('vi');

  const normalizedQuery = normalizeText(searchQuery.trim());
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      !normalizedQuery ||
      normalizeText(`${product.name} ${product.category}`).includes(normalizedQuery);
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const updateSearch = (value: string) => {
    const nextSearchParams = new URLSearchParams(searchParams);
    if (value) {
      nextSearchParams.set('search', value);
    } else {
      nextSearchParams.delete('search');
    }
    setSearchParams(nextSearchParams, { replace: true });
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    updateSearch('');
  };

  const handleAddToCart = (product: ProductItem) => {
    addToCart(product);
    message.success(`Đã thêm "${product.name}" vào giỏ hàng!`);
  };

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
          <Text type="secondary">Có {filteredProducts.length} sản phẩm</Text>
        </Col>
        <Col>
          <Space wrap>
            <Search
              placeholder="Tìm kiếm sản phẩm..."
              style={{ width: 240 }}
              prefix={<SearchOutlined />}
              value={searchQuery}
              onChange={(event) => updateSearch(event.target.value)}
            />
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              style={{ width: 150 }}
              aria-label="Lọc theo danh mục"
            >
              <Select.Option value="all">Tất cả danh mục</Select.Option>
              {[...new Set(products.map((product) => product.category))].map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Col>
      </Row>

      {/* Grid sản phẩm */}
      <Row gutter={[24, 24]}>
        {filteredProducts.length === 0 ? (
          <Col span={24}>
            <Empty description="Không tìm thấy sản phẩm phù hợp">
              <Button type="link" onClick={clearFilters}>
                Xóa bộ lọc
              </Button>
            </Empty>
          </Col>
        ) : filteredProducts.map((product) => (
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
                <Button
                  key="add-to-cart"
                  type="primary"
                  style={{ borderRadius: 40, width: '100%' }}
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