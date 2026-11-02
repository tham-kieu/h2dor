import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  InputNumber,
  List,
  Select,
  Space,
  Spin,
  Typography,
  message,
} from 'antd';
import api from '../services/api';
import {
  createWorkshop,
  getWorkshops,
} from '../services/workshops';
import type {
  CreateWorkshopInput,
  Workshop,
  WorkshopType,
} from '../services/workshops';

const { Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
    role: 'user' | 'admin';
  };
}

interface WorkshopFormValues {
  title: string;
  type: WorkshopType;
  description: string;
  startsAt: { toDate: () => Date };
  durationMinutes: number;
  capacity: number;
  priceVnd: number;
  location: {
    name: string;
    address: string;
    latitude: number;
    longitude: number;
  };
}

const WorkshopManagement = () => {
  const [loginForm] = Form.useForm<{ email: string; password: string }>();
  const [workshopForm] = Form.useForm<WorkshopFormValues>();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loadError, setLoadError] = useState(false);

  const loadWorkshops = async () => {
    setLoadError(false);
    try {
      const { data } = await getWorkshops();
      setWorkshops(data);
    } catch (error) {
      console.error('Không thể tải workshop để quản lý:', error);
      setLoadError(true);
    }
  };

  useEffect(() => {
    if (localStorage.getItem('token')) {
      void loadWorkshops();
    }
  }, []);

  const handleLogin = async (values: { email: string; password: string }) => {
    setLoginLoading(true);
    try {
      const { data } = await api.post<LoginResponse>('/users/login', values);
      if (data.user.role !== 'admin') {
        message.error('Tài khoản này không có quyền quản trị workshop.');
        return;
      }

      localStorage.setItem('token', data.token);
      setIsAdmin(true);
      message.success(`Xin chào ${data.user.name}`);
      await loadWorkshops();
    } catch (error) {
      console.error('Đăng nhập quản trị thất bại:', error);
      message.error('Đăng nhập thất bại. Kiểm tra email, mật khẩu và kết nối backend.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleCreateWorkshop = async (values: WorkshopFormValues) => {
    setSaveLoading(true);
    const workshop: CreateWorkshopInput = {
      ...values,
      startsAt: values.startsAt.toDate().toISOString(),
      isActive: true,
      bookedSeats: 0,
    };

    try {
      await createWorkshop(workshop);
      message.success('Workshop đã được đăng và nhận đặt chỗ.');
      workshopForm.resetFields();
      await loadWorkshops();
    } catch (error) {
      console.error('Không thể tạo workshop:', error);
      message.error('Không thể tạo workshop. Vui lòng kiểm tra dữ liệu và quyền admin.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAdmin(false);
    setWorkshops([]);
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px' }}>
      <Title level={2}>Quản lý workshop</Title>
      <Paragraph type="secondary">
        Đăng thông tin và vị trí workshop. Chỉ tài khoản quản trị viên mới có thể tạo lịch.
      </Paragraph>

      {!isAdmin ? (
        <Card title="Đăng nhập quản trị viên" style={{ maxWidth: 520 }}>
          <Alert
            type="info"
            showIcon
            style={{ marginBottom: 20 }}
            message="Dùng tài khoản quản trị của backend. Tài khoản thường không thể đăng workshop."
          />
          <Form form={loginForm} layout="vertical" onFinish={handleLogin}>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input autoComplete="username" />
            </Form.Item>
            <Form.Item
              label="Mật khẩu"
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password autoComplete="current-password" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={loginLoading} block>
              Đăng nhập
            </Button>
          </Form>
        </Card>
      ) : (
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Button onClick={handleLogout}>Đăng xuất quản trị</Button>
          <Card title="Tạo workshop">
            <Form<WorkshopFormValues>
              form={workshopForm}
              layout="vertical"
              onFinish={handleCreateWorkshop}
              initialValues={{ durationMinutes: 120, capacity: 10, priceVnd: 0 }}
            >
              <Form.Item
                label="Tên workshop"
                name="title"
                rules={[{ required: true, max: 120, message: 'Nhập tên workshop (tối đa 120 ký tự)' }]}
              >
                <Input maxLength={120} />
              </Form.Item>
              <Form.Item
                label="Loại trải nghiệm"
                name="type"
                rules={[{ required: true, message: 'Vui lòng chọn loại trải nghiệm' }]}
              >
                <Select
                  options={[
                    { value: 'pottery-making', label: 'Làm gốm' },
                    { value: 'hand-building', label: 'Nặn gốm bằng tay' },
                    { value: 'artist-tour', label: 'Tour xem nghệ nhân' },
                  ]}
                />
              </Form.Item>
              <Form.Item
                label="Mô tả"
                name="description"
                rules={[{ required: true, max: 2000, message: 'Nhập mô tả (tối đa 2000 ký tự)' }]}
              >
                <TextArea rows={4} maxLength={2000} showCount />
              </Form.Item>
              <Form.Item
                label="Ngày và giờ bắt đầu"
                name="startsAt"
                rules={[
                  { required: true, message: 'Vui lòng chọn ngày giờ' },
                  {
                    validator: (_, value) =>
                      !value || value.toDate().getTime() > Date.now()
                        ? Promise.resolve()
                        : Promise.reject(new Error('Thời gian phải nằm trong tương lai')),
                  },
                ]}
              >
                <DatePicker
                  showTime
                  format="DD/MM/YYYY HH:mm"
                  disabledDate={(date) => date.isBefore(new Date(), 'day')}
                  style={{ width: '100%' }}
                />
              </Form.Item>
              <Space wrap style={{ display: 'flex' }} align="start">
                <Form.Item
                  label="Thời lượng (phút)"
                  name="durationMinutes"
                  rules={[{ required: true, message: 'Nhập thời lượng' }]}
                >
                  <InputNumber min={15} max={720} />
                </Form.Item>
                <Form.Item
                  label="Sức chứa"
                  name="capacity"
                  rules={[{ required: true, message: 'Nhập sức chứa' }]}
                >
                  <InputNumber min={1} max={500} />
                </Form.Item>
                <Form.Item
                  label="Giá vé (VND/người)"
                  name="priceVnd"
                  rules={[{ required: true, message: 'Nhập giá vé' }]}
                >
                  <InputNumber min={0} max={100000000} step={10000} />
                </Form.Item>
              </Space>

              <Title level={4}>Địa điểm bản đồ</Title>
              <Form.Item
                label="Tên địa điểm"
                name={['location', 'name']}
                rules={[{ required: true, message: 'Nhập tên địa điểm' }]}
              >
                <Input maxLength={120} />
              </Form.Item>
              <Form.Item
                label="Địa chỉ đầy đủ"
                name={['location', 'address']}
                rules={[{ required: true, message: 'Nhập địa chỉ' }]}
              >
                <Input maxLength={300} />
              </Form.Item>
              <Space wrap style={{ display: 'flex' }} align="start">
                <Form.Item
                  label="Vĩ độ"
                  name={['location', 'latitude']}
                  rules={[{ required: true, message: 'Nhập vĩ độ' }]}
                >
                  <InputNumber min={-90} max={90} step={0.000001} />
                </Form.Item>
                <Form.Item
                  label="Kinh độ"
                  name={['location', 'longitude']}
                  rules={[{ required: true, message: 'Nhập kinh độ' }]}
                >
                  <InputNumber min={-180} max={180} step={0.000001} />
                </Form.Item>
              </Space>
              <Button type="primary" htmlType="submit" loading={saveLoading}>
                Đăng workshop
              </Button>
            </Form>
          </Card>

          <Card title="Workshop đang mở đặt chỗ">
            {loadError ? (
              <Alert type="error" showIcon message="Không tải được danh sách workshop" />
            ) : workshops.length === 0 ? (
              <Text type="secondary">Chưa có workshop nào đang mở.</Text>
            ) : (
              <List
                dataSource={workshops}
                renderItem={(workshop) => (
                  <List.Item>
                    <List.Item.Meta
                      title={workshop.title}
                      description={`${workshop.location.address} · ${new Date(workshop.startsAt).toLocaleString('vi-VN')} · ${workshop.bookedSeats}/${workshop.capacity} chỗ`}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </Space>
      )}
    </div>
  );
};

export default WorkshopManagement;
