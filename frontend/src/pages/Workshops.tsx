import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Empty,
  Form,
  Input,
  InputNumber,
  List,
  Modal,
  Row,
  Space,
  Spin,
  Tag,
  Typography,
  message,
} from 'antd';
import { EnvironmentOutlined } from '@ant-design/icons';
import {
  bookWorkshop,
  cancelWorkshopBooking,
  getWorkshops,
} from '../services/workshops';
import type {
  Workshop,
  WorkshopBookingConfirmation,
  WorkshopBookingInput,
} from '../services/workshops';

const { Link, Paragraph, Text, Title } = Typography;
const { TextArea } = Input;

const workshopTypeLabels = {
  'pottery-making': 'Làm gốm',
  'hand-building': 'Nặn gốm bằng tay',
  'artist-tour': 'Tour xem nghệ nhân',
};

const formatDate = (date: string) =>
  new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(date));

const mapUrl = (workshop: Workshop) => {
  const { latitude, longitude } = workshop.location;
  const offset = 0.008;
  const bbox = [
    longitude - offset,
    latitude - offset,
    longitude + offset,
    latitude + offset,
  ].join('%2C');
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`;
};

const getApiError = (error: unknown, fallback: string) => {
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

const Workshops = () => {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [bookingWorkshop, setBookingWorkshop] = useState<Workshop | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<WorkshopBookingConfirmation | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelForm] = Form.useForm<{ confirmationCode: string }>();
  const [bookingForm] = Form.useForm<WorkshopBookingInput>();

  const loadWorkshops = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const { data } = await getWorkshops();
      setWorkshops(data);
    } catch (error) {
      console.error('Không thể tải danh sách workshop:', error);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadWorkshops();
  }, []);

  const submitBooking = async (values: WorkshopBookingInput) => {
    if (!bookingWorkshop) return;
    setBookingLoading(true);
    try {
      const { data } = await bookWorkshop(bookingWorkshop._id, values);
      setConfirmation(data);
      setBookingWorkshop(null);
      bookingForm.resetFields();
      await loadWorkshops();
    } catch (error) {
      message.error(getApiError(error, 'Chưa thể đặt chỗ. Vui lòng thử lại.'));
    } finally {
      setBookingLoading(false);
    }
  };

  const submitCancellation = async (values: { confirmationCode: string }) => {
    setCancelLoading(true);
    try {
      const { data } = await cancelWorkshopBooking(values.confirmationCode.trim());
      message.success(data.message);
      cancelForm.resetFields();
      await loadWorkshops();
    } catch (error) {
      message.error(getApiError(error, 'Chưa thể hủy đặt chỗ. Vui lòng kiểm tra mã xác nhận.'));
    } finally {
      setCancelLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2}>Workshop & trải nghiệm gốm</Title>
        <Paragraph type="secondary">
          Đặt chỗ cho buổi làm gốm, lớp nặn tay hoặc tour xem nghệ nhân.
          Có thể hủy trước giờ bắt đầu ít nhất 48 giờ.
        </Paragraph>
        <Link href="/workshops/manage">Quản trị: đăng workshop mới</Link>
      </div>

      <Card style={{ marginBottom: 24 }}>
        <Title level={4}>Hủy đặt chỗ</Title>
        <Paragraph type="secondary">
          Nhập mã xác nhận đã nhận sau khi đặt chỗ. Mã chỉ hiển thị một lần,
          hãy lưu lại để có thể hủy trước hạn 48 giờ.
        </Paragraph>
        <Form form={cancelForm} layout="inline" onFinish={submitCancellation}>
          <Form.Item
            name="confirmationCode"
            rules={[{ required: true, message: 'Vui lòng nhập mã xác nhận' }]}
          >
            <Input placeholder="Mã xác nhận đặt chỗ" autoComplete="off" />
          </Form.Item>
          <Form.Item>
            <Button danger htmlType="submit" loading={cancelLoading}>
              Hủy đặt chỗ
            </Button>
          </Form.Item>
        </Form>
      </Card>

      {loadError ? (
        <Alert
          type="error"
          showIcon
          message="Không tải được danh sách workshop"
          action={<Button size="small" onClick={() => void loadWorkshops()}>Thử lại</Button>}
        />
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: 48 }}><Spin size="large" /></div>
      ) : workshops.length === 0 ? (
        <Empty
          description="Chưa có workshop hoặc lịch trải nghiệm nào được mở đặt chỗ."
        >
          <Text type="secondary">
            Địa điểm và bản đồ sẽ xuất hiện khi có lịch workshop được đăng.
          </Text>
        </Empty>
      ) : (
        <Row gutter={[24, 24]}>
          {workshops.map((workshop) => {
            const availableSeats = workshop.capacity - workshop.bookedSeats;
            return (
              <Col xs={24} key={workshop._id}>
                <Card>
                  <Row gutter={[24, 24]}>
                    <Col xs={24} md={14}>
                      <Space wrap>
                        <Tag color="gold">{workshopTypeLabels[workshop.type]}</Tag>
                        <Text type="secondary">{formatDate(workshop.startsAt)}</Text>
                      </Space>
                      <Title level={3} style={{ marginTop: 12 }}>{workshop.title}</Title>
                      <Paragraph>{workshop.description}</Paragraph>
                      <List
                        size="small"
                        split={false}
                        dataSource={[
                          `Địa điểm: ${workshop.location.name}`,
                          `Địa chỉ: ${workshop.location.address}`,
                          `Thời lượng: ${workshop.durationMinutes} phút`,
                          `Còn ${availableSeats} / ${workshop.capacity} chỗ`,
                          workshop.priceVnd === 0
                            ? 'Miễn phí'
                            : `Giá vé: ${workshop.priceVnd.toLocaleString('vi-VN')} đ / người`,
                        ]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                      />
                      <Space style={{ marginTop: 16 }}>
                        <Button
                          type="primary"
                          disabled={availableSeats < 1}
                          onClick={() => setBookingWorkshop(workshop)}
                        >
                          Đặt chỗ
                        </Button>
                        <Button
                          icon={<EnvironmentOutlined />}
                          href={`https://www.openstreetmap.org/?mlat=${workshop.location.latitude}&mlon=${workshop.location.longitude}#map=16/${workshop.location.latitude}/${workshop.location.longitude}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          Mở bản đồ
                        </Button>
                      </Space>
                    </Col>
                    <Col xs={24} md={10}>
                      <iframe
                        title={`Bản đồ ${workshop.location.name}`}
                        src={mapUrl(workshop)}
                        width="100%"
                        height="320"
                        loading="lazy"
                        style={{ border: 0, borderRadius: 8 }}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      <Modal
        title={`Đặt chỗ: ${bookingWorkshop?.title ?? ''}`}
        open={bookingWorkshop !== null}
        onCancel={() => setBookingWorkshop(null)}
        footer={null}
        destroyOnHidden
      >
        {bookingWorkshop && (
          <Form<WorkshopBookingInput>
            form={bookingForm}
            layout="vertical"
            initialValues={{ seats: 1 }}
            onFinish={submitBooking}
          >
            <Form.Item
              label="Họ và tên"
              name="customerName"
              rules={[
                { required: true, message: 'Vui lòng nhập họ tên' },
                { min: 2, max: 80, message: 'Tên phải từ 2 đến 80 ký tự' },
              ]}
            >
              <Input maxLength={80} />
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input maxLength={254} />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { min: 8, max: 30, message: 'Số điện thoại phải từ 8 đến 30 ký tự' },
              ]}
            >
              <Input maxLength={30} />
            </Form.Item>
            <Form.Item
              label="Số chỗ"
              name="seats"
              rules={[{ required: true, message: 'Vui lòng chọn số chỗ' }]}
            >
              <InputNumber min={1} max={Math.min(10, bookingWorkshop.capacity - bookingWorkshop.bookedSeats)} />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={bookingLoading} block>
              Xác nhận đặt chỗ
            </Button>
          </Form>
        )}
      </Modal>

      <Modal
        title="Đặt chỗ thành công"
        open={confirmation !== null}
        onCancel={() => setConfirmation(null)}
        onOk={() => setConfirmation(null)}
        okText="Đã lưu mã"
        cancelButtonProps={{ style: { display: 'none' } }}
      >
        {confirmation && (
          <Space direction="vertical">
            <Text>Workshop: <strong>{confirmation.workshopTitle}</strong></Text>
            <Text>Thời gian: {formatDate(confirmation.startsAt)}</Text>
            <Text>Số chỗ đã đặt: {confirmation.seats}</Text>
            <Text>
              Mã xác nhận hủy: <Text code copyable>{confirmation.confirmationCode}</Text>
            </Text>
            <Text type="secondary">
              Lưu mã này. Bạn có thể hủy trước ngày {formatDate(confirmation.cancellationDeadline)}.
            </Text>
          </Space>
        )}
      </Modal>
    </div>
  );
};

export default Workshops;
