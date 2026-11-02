// src/pages/Auth.tsx
import { useState } from 'react';
import { Form, Input, Button, Tabs, message, Card, Modal } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, ArrowLeftOutlined, PhoneOutlined } from '@ant-design/icons';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const { TabPane } = Tabs;

interface AuthFormValues {
  email: string;
  password: string;
}

interface RegisterFormValues extends AuthFormValues {
  fullName: string;
  phone: string;
  address?: string;
}

interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof error.response === 'object' &&
    error.response !== null &&
    'data' in error.response &&
    typeof error.response.data === 'object' &&
    error.response.data !== null &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string'
  ) {
    return error.response.data.message;
  }
  return fallback;
};

const Auth = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordVisible, setIsForgotPasswordVisible] = useState(false);

  // Xử lý đăng nhập
  const handleLogin = async (values: AuthFormValues) => {
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/users/login', values);
      localStorage.setItem('token', data.token);
      login(data.user);
      message.success('Đăng nhập thành công!');
      navigate('/');
    } catch (error) {
      message.error(getErrorMessage(error, 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.'));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý đăng ký
  const handleRegister = async (values: RegisterFormValues) => {
    setLoading(true);
    try {
      const { data } = await api.post<AuthResponse>('/users/register', {
        name: values.fullName.trim(),
        email: values.email,
        password: values.password,
      });
      localStorage.setItem('token', data.token);
      login(data.user);
      message.success('Đăng ký thành công!');
      navigate('/');
    } catch (error) {
      message.error(getErrorMessage(error, 'Đăng ký thất bại. Vui lòng thử lại.'));
    } finally {
      setLoading(false);
    }
  };

  // Xử lý quên mật khẩu
  const handleForgotPassword = (_values: { email: string }) => {
    message.info('Tính năng khôi phục mật khẩu chưa được kết nối.');
    setIsForgotPasswordVisible(false);
  };

  return (
    <div 
      style={{ 
        minHeight: 'calc(100vh - 72px)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #faf8f5 0%, #f5f0eb 100%)',
        padding: '20px',
        marginTop: '72px'
      }}
    >
      <Card
        style={{
          width: 480,
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
        }}
        bodyStyle={{ padding: '40px 30px' }}
      >
        {/* Nút quay lại */}
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/')}
          style={{ marginBottom: 20, color: '#b8860b' }}
        >
          Quay lại trang chủ
        </Button>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <img
            src="/logo.png"
            alt="H2DOR Logo"
            style={{ height: 60, marginBottom: 10 }}
          />
          <h2 style={{ margin: 0, color: '#b8860b', fontWeight: 700 }}>H2DOR</h2>
          <p style={{ color: '#999', marginTop: 5 }}>
            {activeTab === 'login' ? 'Đăng nhập tài khoản' : 'Tạo tài khoản mới'}
          </p>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'login' | 'register')}
          centered
          size="large"
          style={{ marginBottom: 20 }}
        >
          <TabPane tab="Đăng nhập" key="login">
            <Form
              name="login"
              onFinish={handleLogin}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Mật khẩu"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    background: '#b8860b',
                    borderColor: '#b8860b',
                    fontWeight: 600,
                    height: 45,
                  }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>

              <div style={{ textAlign: 'center' }}>
                <a 
                  style={{ color: '#b8860b', cursor: 'pointer' }}
                  onClick={() => setIsForgotPasswordVisible(true)}
                >
                  Quên mật khẩu?
                </a>
              </div>
            </Form>
          </TabPane>

          <TabPane tab="Đăng ký" key="register">
            <Form
              name="register"
              onFinish={handleRegister}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="fullName"
                rules={[{ required: true, message: 'Vui lòng nhập họ tên!' }]}
              >
                <Input
                  prefix={<UserOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Họ và tên"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="email"
                rules={[
                  { required: true, message: 'Vui lòng nhập email!' },
                  { type: 'email', message: 'Email không hợp lệ!' },
                ]}
              >
                <Input
                  prefix={<MailOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Email"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="phone"
                rules={[
                  { required: true, message: 'Vui lòng nhập số điện thoại!' },
                  { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ!' }
                ]}
              >
                <Input
                  prefix={<PhoneOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Số điện thoại"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="address"
              >
                <Input
                  placeholder="Địa chỉ (không bắt buộc)"
                  size="large"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: 'Vui lòng nhập mật khẩu!' },
                  { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' },
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Mật khẩu (tối thiểu 6 ký tự)"
                  size="large"
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
                      return Promise.reject(new Error('Mật khẩu không khớp!'));
                    },
                  }),
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined style={{ color: '#b8860b' }} />}
                  placeholder="Xác nhận mật khẩu"
                  size="large"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  size="large"
                  style={{
                    background: '#b8860b',
                    borderColor: '#b8860b',
                    fontWeight: 600,
                    height: 45,
                  }}
                >
                  Đăng ký
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
        </Tabs>
      </Card>

      {/* Modal Quên mật khẩu */}
      <Modal
        title="Quên mật khẩu"
        open={isForgotPasswordVisible}
        onCancel={() => setIsForgotPasswordVisible(false)}
        footer={null}
        centered
        width={420}
      >
        <div style={{ padding: '20px 0' }}>
          <p style={{ color: '#666', marginBottom: 20 }}>
            Nhập email của bạn để nhận link đặt lại mật khẩu.
          </p>
          <Form
            name="forgotPassword"
            onFinish={handleForgotPassword}
            layout="vertical"
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email!' },
                { type: 'email', message: 'Email không hợp lệ!' },
              ]}
            >
              <Input
                prefix={<MailOutlined style={{ color: '#b8860b' }} />}
                placeholder="Email của bạn"
                size="large"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
                style={{
                  background: '#b8860b',
                  borderColor: '#b8860b',
                  fontWeight: 600,
                }}
              >
                Gửi link đặt lại mật khẩu
              </Button>
            </Form.Item>

            <div style={{ textAlign: 'center' }}>
              <a 
                onClick={() => setIsForgotPasswordVisible(false)}
                style={{ color: '#999', cursor: 'pointer' }}
              >
                Quay lại đăng nhập
              </a>
            </div>
          </Form>
        </div>
      </Modal>

      <style>{`
        .ant-tabs-tab.ant-tabs-tab-active .ant-tabs-tab-btn {
          color: #b8860b !important;
        }
        .ant-tabs-ink-bar {
          background: #b8860b !important;
        }
        .ant-input-affix-wrapper:hover,
        .ant-input-affix-wrapper:focus {
          border-color: #b8860b !important;
        }
        .ant-input-affix-wrapper-focused {
          border-color: #b8860b !important;
          box-shadow: 0 0 0 2px rgba(184, 134, 11, 0.1) !important;
        }
        .ant-btn-primary:hover {
          background: #a0750a !important;
          border-color: #a0750a !important;
        }
      `}</style>
    </div>
  );
};

export default Auth;