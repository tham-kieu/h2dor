// src/pages/Orders.tsx
import { useState } from 'react';
import { Card, List, Typography, Empty, Tag, Button, Space, Tabs, Badge, Descriptions } from 'antd';
import { 
  ShoppingOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  CloseCircleOutlined,
  TruckOutlined,
  HomeOutlined,
  PhoneOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

const Orders = () => {
  const { orders, cancelOrder } = useOrders();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending: { color: 'orange', icon: <ClockCircleOutlined />, text: 'Chờ xác nhận' },
      processing: { color: 'blue', icon: <TruckOutlined />, text: 'Đang xử lý' },
      shipped: { color: 'purple', icon: <TruckOutlined />, text: 'Đang giao hàng' },
      delivered: { color: 'green', icon: <CheckCircleOutlined />, text: 'Đã giao' },
      cancelled: { color: 'red', icon: <CloseCircleOutlined />, text: 'Đã hủy' },
    };
    return configs[status as keyof typeof configs] || configs.pending;
  };

  // Filter orders theo tab
  const getFilteredOrders = () => {
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status === activeTab);
  };

  // Kiểm tra đăng nhập
  if (!isAuthenticated) {
    return (
      <div style={{ padding: '80px 20px', textAlign: 'center', marginTop: '72px' }}>
        <Empty
          image={<ShoppingOutlined style={{ fontSize: 64, color: '#b8860b' }} />}
          description="Vui lòng đăng nhập để xem đơn hàng"
        >
          <Button 
            type="primary" 
            onClick={() => navigate('/auth')}
            style={{ background: '#b8860b', borderColor: '#b8860b' }}
          >
            Đăng nhập ngay
          </Button>
        </Empty>
      </div>
    );
  }

  const filteredOrders = getFilteredOrders();

  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto', marginTop: '72px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
        <Title level={2} style={{ margin: 0 }}>
          <ShoppingOutlined style={{ color: '#b8860b', marginRight: 10 }} />
          Đơn hàng của tôi
        </Title>
        <Badge count={orders.length} style={{ backgroundColor: '#b8860b' }} />
      </div>

      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
        tabBarStyle={{ fontSize: 16 }}
      >
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Chờ xác nhận" key="pending" />
        <TabPane tab="Đang xử lý" key="processing" />
        <TabPane tab="Đang giao" key="shipped" />
        <TabPane tab="Đã giao" key="delivered" />
        <TabPane tab="Đã hủy" key="cancelled" />
      </Tabs>

      {filteredOrders.length === 0 ? (
        <Card>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span>
                {activeTab === 'all' 
                  ? 'Bạn chưa có đơn hàng nào' 
                  : `Không có đơn hàng ${getStatusConfig(activeTab).text.toLowerCase()}`}
              </span>
            }
          >
            {activeTab === 'all' && (
              <Button 
                type="primary" 
                onClick={() => navigate('/')}
                style={{ background: '#b8860b', borderColor: '#b8860b' }}
              >
                Mua sắm ngay
              </Button>
            )}
          </Empty>
        </Card>
      ) : (
        <List
          dataSource={filteredOrders}
          renderItem={(order) => {
            const statusConfig = getStatusConfig(order.status);
            return (
              <Card 
                style={{ marginBottom: 20, borderRadius: 12 }}
                bodyStyle={{ padding: 20 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div>
                    <Space direction="vertical" size={4}>
                      <Text strong style={{ fontSize: 16 }}>
                        Mã đơn hàng: <span style={{ color: '#b8860b' }}>{order.id}</span>
                      </Text>
                      <Text type="secondary">
                        Ngày đặt: {formatDate(order.createdAt)}
                      </Text>
                    </Space>
                  </div>
                  <Space>
                    <Tag color={statusConfig.color} icon={statusConfig.icon}>
                      {statusConfig.text}
                    </Tag>
                    {order.status === 'pending' && (
                      <Button 
                        danger 
                        size="small"
                        onClick={() => cancelOrder(order.id)}
                      >
                        Hủy đơn hàng
                      </Button>
                    )}
                  </Space>
                </div>

                <Descriptions size="small" column={{ xs: 1, sm: 2, md: 3 }}>
                  <Descriptions.Item label={<><HomeOutlined /> Địa chỉ</>}>
                    {order.shippingAddress}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><PhoneOutlined /> SĐT</>}>
                    {order.phone}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><DollarOutlined /> Tổng tiền</>}>
                    <Text strong style={{ color: '#b8860b', fontSize: 16 }}>
                      {formatPrice(order.totalPrice)}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>

                {order.note && (
                  <Paragraph type="secondary" style={{ marginTop: 8 }}>
                    Ghi chú: {order.note}
                  </Paragraph>
                )}

                <div style={{ marginTop: 16 }}>
                  <Text strong>Chi tiết đơn hàng:</Text>
                  <List
                    size="small"
                    dataSource={order.items}
                    renderItem={(item) => (
                      <List.Item>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
                          {item.image && (
                            <img 
                              src={item.image} 
                              alt={item.name}
                              style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <Text>{item.name}</Text>
                            <br />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                              Số lượng: {item.quantity} x {formatPrice(item.price)}
                            </Text>
                          </div>
                          <Text strong style={{ color: '#b8860b' }}>
                            {formatPrice(item.price * item.quantity)}
                          </Text>
                        </div>
                      </List.Item>
                    )}
                  />
                </div>
              </Card>
            );
          }}
        />
      )}
    </div>
  );
};

export default Orders;