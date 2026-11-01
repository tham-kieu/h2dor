// src/pages/Login.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography, Divider } from 'antd';
import { MailOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
  remember?: boolean;
}

const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: LoginFormValues): Promise<void> => {
    setLoading(true);
    try {
      // Giả lập API call - thay thế bằng API thực tế
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập dữ liệu user
      const userData = {
        name: 'Nguyễn Văn A',
        email: values.email,
        phone: '0123456789',
        address: 'Hà Nội, Việt Nam'
      };
      
      login(userData);
      message.success({
        content: 'Đăng nhập thành công!',
        duration: 2,
      });
      navigate('/');
    } catch (error) {
      message.error({
        content: 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!',
        duration: 3,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #9FCBAD 0%, #7BAE8A 100%)',
      padding: '20px'
    }}>
      <Card
        style={{
          width: 420,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#2d5016', marginBottom: '8px' }}>
            Đăng nhập
          </Title>
          <Text type="secondary">
            Chào mừng bạn trở lại!
          </Text>
        </div>

        <Form<LoginFormValues>
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined style={{ color: '#999' }} />} 
              placeholder="Email" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#999' }} />} 
              placeholder="Mật khẩu" 
            />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
            <Text>
              <Link to="/forgot-password" style={{ color: '#8b5a2b' }}>
                Quên mật khẩu?
              </Link>
            </Text>
          </div>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              block
              style={{ 
                background: '#8b5a2b',
                borderColor: '#8b5a2b',
                height: '45px',
                fontSize: '16px',
                fontWeight: '600'
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider>Hoặc đăng nhập với</Divider>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '20px' }}>
          <Button 
            icon={<GoogleOutlined />} 
            style={{ width: '100%' }}
            onClick={() => message.info('Tính năng đang phát triển')}
          >
            Google
          </Button>
          <Button 
            icon={<FacebookOutlined />} 
            style={{ width: '100%' }}
            onClick={() => message.info('Tính năng đang phát triển')}
          >
            Facebook
          </Button>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Text type="secondary">
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ color: '#8b5a2b', fontWeight: '600' }}>
              Đăng ký ngay
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;