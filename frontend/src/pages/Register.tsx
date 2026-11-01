// src/pages/Register.tsx
import React, { useState } from 'react';
import { Form, Input, Button, Card, message, Typography } from 'antd';
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const { Title, Text } = Typography;

interface RegisterFormValues {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: RegisterFormValues): Promise<void> => {
    setLoading(true);
    try {
      // Giả lập API call - thay thế bằng API thực tế
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Giả lập đăng ký thành công
      const userData = {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: ''
      };
      
      login(userData);
      message.success({
        content: 'Đăng ký thành công!',
        duration: 2,
      });
      navigate('/');
    } catch (error) {
      message.error({
        content: 'Đăng ký thất bại. Vui lòng thử lại!',
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
          width: 480,
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <Title level={2} style={{ color: '#2d5016', marginBottom: '8px' }}>
            Đăng ký tài khoản
          </Title>
          <Text type="secondary">
            Tạo tài khoản để trải nghiệm mua sắm
          </Text>
        </div>

        <Form<RegisterFormValues>
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined style={{ color: '#999' }} />} 
              placeholder="Họ và tên" 
            />
          </Form.Item>

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
            name="phone"
            rules={[
              { required: true, message: 'Vui lòng nhập số điện thoại!' },
              { pattern: /^[0-9]{10}$/, message: 'Số điện thoại phải có 10 chữ số!' }
            ]}
          >
            <Input 
              prefix={<PhoneOutlined style={{ color: '#999' }} />} 
              placeholder="Số điện thoại" 
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

          <Form.Item
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined style={{ color: '#999' }} />} 
              placeholder="Xác nhận mật khẩu" 
            />
          </Form.Item>

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
              Đăng ký
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <Text type="secondary">
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#8b5a2b', fontWeight: '600' }}>
              Đăng nhập ngay
            </Link>
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default Register;