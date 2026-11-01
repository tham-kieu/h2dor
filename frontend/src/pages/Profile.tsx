// src/pages/Profile.tsx
import { Card, Typography, Avatar, Descriptions, Button, message } from 'antd';
import { UserOutlined, PhoneOutlined, MailOutlined, HomeOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const Profile = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated || !user) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', marginTop: '72px' }}>
        <Title level={3}>Vui lòng đăng nhập để xem thông tin</Title>
        <Button 
          type="primary" 
          onClick={() => navigate('/auth')}
          style={{ background: '#b8860b', borderColor: '#b8860b' }}
        >
          Đăng nhập ngay
        </Button>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    message.success('Đã đăng xuất!');
    navigate('/');
  };

  return (
    <div style={{ padding: '40px', maxWidth: 800, margin: '0 auto', marginTop: '72px' }}>
      <Card
        style={{
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <Avatar 
            size={100} 
            icon={<UserOutlined />} 
            style={{ backgroundColor: '#b8860b' }} 
          />
          <Title level={3} style={{ marginTop: 16 }}>{user.name}</Title>
          <p style={{ color: '#999' }}>Thành viên H2DOR</p>
        </div>
        
        <Descriptions bordered column={1}>
          <Descriptions.Item label={<><UserOutlined /> Họ và tên</>}>
            {user.name}
          </Descriptions.Item>
          <Descriptions.Item label={<><MailOutlined /> Email</>}>
            {user.email}
          </Descriptions.Item>
          {user.phone && (
            <Descriptions.Item label={<><PhoneOutlined /> Số điện thoại</>}>
              {user.phone}
            </Descriptions.Item>
          )}
          {user.address && (
            <Descriptions.Item label={<><HomeOutlined /> Địa chỉ</>}>
              {user.address}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Ngày tham gia">
            {new Date().toLocaleDateString('vi-VN')}
          </Descriptions.Item>
        </Descriptions>

        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <Button 
            type="primary"
            style={{ background: '#b8860b', borderColor: '#b8860b' }}
            onClick={() => navigate('/orders')}
          >
            Xem đơn hàng
          </Button>
          <Button danger onClick={handleLogout}>
            Đăng xuất
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;