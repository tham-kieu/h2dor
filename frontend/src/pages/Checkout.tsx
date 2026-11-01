import { useEffect } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Typography,
} from 'antd';
import {
  ArrowLeftOutlined,
  CheckOutlined,
  EnvironmentOutlined,
  LockOutlined,
  MinusOutlined,
  PhoneOutlined,
  PlusOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';

const { TextArea } = Input;
const { Text } = Typography;

interface CheckoutFormValues {
  name: string;
  phone: string;
  address: string;
  note?: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(price);

export default function Checkout() {
  const [form] = Form.useForm<CheckoutFormValues>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, clearCart, updateQuantity, removeFromCart } = useCart();
  const { createOrder } = useOrders();
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    form.setFieldsValue({
      name: user?.name ?? '',
      phone: user?.phone ?? '',
      address: user?.address ?? '',
    });
  }, [form, user]);

  const handleSubmit = (values: CheckoutFormValues) => {
    const shippingAddress = `${values.name} - ${values.address}`;

    createOrder(
      cartItems.map(({ id, name, price, image, quantity }) => ({
        id,
        name,
        price,
        image,
        quantity,
      })),
      shippingAddress,
      values.phone,
      values.note
    );
    clearCart();
    message.success('Đặt hàng thành công! Cảm ơn bạn đã mua sắm tại H2DOR.');
    navigate('/orders');
  };

  if (cartItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-empty">
            <div className="checkout-empty-icon">
              <ShoppingCartOutlined />
            </div>
            <h2>Giỏ hàng đang trống</h2>
            <p>Chọn vài món đồ bạn yêu thích, rồi quay lại đây để hoàn tất đơn hàng nhé.</p>
            <Button
              type="primary"
              size="large"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/products')}
              style={{ borderRadius: 10, background: '#315b47', borderColor: '#315b47' }}
            >
              Tiếp tục mua sắm
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-breadcrumb">
          <Link to="/" style={{ color: 'inherit' }}>Trang chủ</Link>
          <span> &nbsp;/&nbsp; </span>
          <strong>Thanh toán</strong>
        </div>

        <header className="checkout-heading">
          <div className="checkout-eyebrow">
            <ShoppingOutlined />
            <span>Hoàn tất đơn hàng</span>
          </div>
          <h1>Thanh toán</h1>
          <p>Chỉ còn một bước nữa để món đồ yêu thích về với bạn.</p>
        </header>

        <div className="checkout-progress" aria-label="Tiến trình đặt hàng">
          <div className="checkout-progress-step">
            <span className="checkout-progress-number"><CheckOutlined /></span>
            Giỏ hàng
          </div>
          <span className="checkout-progress-line" />
          <div className="checkout-progress-step is-active">
            <span className="checkout-progress-number">2</span>
            Giao hàng
          </div>
          <span className="checkout-progress-line" />
          <div className="checkout-progress-step">
            <span className="checkout-progress-number">3</span>
            Hoàn tất
          </div>
        </div>

        <div className="checkout-grid">
          <section className="checkout-panel">
            <div className="checkout-panel-heading">
              <div className="checkout-heading-icon"><EnvironmentOutlined /></div>
              <div>
                <h2>Thông tin nhận hàng</h2>
                <p>Điền chính xác để chúng mình giao hàng đến bạn.</p>
              </div>
            </div>

            <Form
              form={form}
              layout="vertical"
              requiredMark={false}
              className="checkout-form"
              onFinish={handleSubmit}
              initialValues={{ name: user?.name ?? '', phone: user?.phone ?? '', address: user?.address ?? '' }}
            >
              <Row gutter={16}>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Họ và tên người nhận"
                    name="name"
                    rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập họ và tên.' }]}
                  >
                    <Input prefix={<UserOutlined style={{ color: '#91a095' }} />} placeholder="Nguyễn Văn An" autoComplete="name" />
                  </Form.Item>
                </Col>
                <Col xs={24} md={12}>
                  <Form.Item
                    label="Số điện thoại"
                    name="phone"
                    rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập số điện thoại.' }]}
                  >
                    <Input prefix={<PhoneOutlined style={{ color: '#91a095' }} />} placeholder="090 123 4567" autoComplete="tel" inputMode="tel" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Địa chỉ giao hàng"
                name="address"
                rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập địa chỉ nhận hàng.' }]}
              >
                <Input prefix={<EnvironmentOutlined style={{ color: '#91a095' }} />} placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố" autoComplete="street-address" />
              </Form.Item>

              <Form.Item label="Ghi chú cho cửa hàng (không bắt buộc)" name="note">
                <TextArea rows={3} placeholder="Ví dụ: Giao hàng giờ hành chính, gọi trước khi đến..." maxLength={300} showCount />
              </Form.Item>

              <div className="checkout-payment-note">
                <CheckOutlined />
                <div>
                  <strong>Thanh toán khi nhận hàng</strong>
                  <span>Bạn thanh toán trực tiếp cho đơn vị giao hàng sau khi nhận sản phẩm.</span>
                </div>
              </div>
            </Form>
          </section>

          <aside className="checkout-summary">
            <div className="checkout-summary-header">
              <h2>Đơn hàng của bạn</h2>
              <span>{itemCount} sản phẩm</span>
            </div>

            <div className="checkout-items">
              {cartItems.map((item) => {
                const hasImage = item.image && /^(https?:\/\/|\/)/i.test(item.image);

                return (
                  <div className="checkout-item" key={item.id}>
                    <div className="checkout-item-image">
                      {hasImage ? <img src={item.image} alt={item.name} /> : item.image || <ShoppingOutlined />}
                    </div>
                    <div>
                      <div className="checkout-item-name" title={item.name}>{item.name}</div>
                      <div className="checkout-item-price">{formatPrice(item.price)}</div>
                      <div className="checkout-item-controls" aria-label={`Số lượng ${item.name}`}>
                        <Button
                          aria-label={`Giảm số lượng ${item.name}`}
                          icon={<MinusOutlined />}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        />
                        <span className="checkout-item-quantity">{item.quantity}</span>
                        <Button
                          aria-label={`Tăng số lượng ${item.name}`}
                          icon={<PlusOutlined />}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="checkout-item-total">{formatPrice(item.price * item.quantity)}</div>
                      <Button
                        type="link"
                        className="checkout-item-remove"
                        onClick={() => removeFromCart(item.id)}
                      >
                        Xóa
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="checkout-summary-details">
              <div className="checkout-summary-row">
                <span>Tạm tính</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
              <div className="checkout-summary-row">
                <span>Phí giao hàng</span>
                <strong>Miễn phí</strong>
              </div>
              <div className="checkout-summary-total">
                <span>Tổng thanh toán</span>
                <strong>{formatPrice(subtotal)}</strong>
              </div>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              className="checkout-submit"
              onClick={() => form.submit()}
              disabled={cartItems.length === 0}
            >
              Đặt hàng · {formatPrice(subtotal)}
            </Button>
            <div className="checkout-secure-note">
              <LockOutlined />
              <Text type="secondary">Thông tin của bạn được bảo mật an toàn</Text>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
