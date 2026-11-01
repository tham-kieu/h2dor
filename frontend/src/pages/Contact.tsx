import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
  Form,
  Input,
  Button,
  message,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
  FacebookFilled,
  TwitterCircleFilled,
  YoutubeFilled,
} from "@ant-design/icons";

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const Contact = () => {
  const onFinish = (values: any) => {
    console.log(values);
    message.success("Gửi liên hệ thành công!");
  };

  return (
    <Layout>
      <Content
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        {/* Tiêu đề */}
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <Title level={1} style={{ color: "#1677ff" }}>
            Liên Hệ Với Chúng Tôi
          </Title>

          <Paragraph style={{ fontSize: 16 }}>
            Nếu bạn có bất kỳ câu hỏi nào về sản phẩm gốm sứ, vui lòng liên hệ
            với chúng tôi qua thông tin bên dưới hoặc gửi biểu mẫu liên hệ.
          </Paragraph>
        </div>

        <Row gutter={[30, 30]}>
          {/* Thông tin liên hệ */}
          <Col xs={24} md={10}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                height: "100%",
              }}
            >
              <Title level={3} style={{ color: "#1677ff" }}>
                Thông Tin Liên Hệ
              </Title>

              <div style={{ marginBottom: 25 }}>
                <PhoneOutlined
                  style={{
                    color: "#1677ff",
                    fontSize: 22,
                    marginRight: 10,
                  }}
                />
                <Text strong>Hotline</Text>
                <br />
                <Text>0123 456 789</Text>
              </div>

              <div style={{ marginBottom: 25 }}>
                <MailOutlined
                  style={{
                    color: "#1677ff",
                    fontSize: 22,
                    marginRight: 10,
                  }}
                />
                <Text strong>Email</Text>
                <br />
                <Text>h2dor@gmail.com</Text>
              </div>

              <div style={{ marginBottom: 30 }}>
                <EnvironmentOutlined
                  style={{
                    color: "#1677ff",
                    fontSize: 22,
                    marginRight: 10,
                  }}
                />
                <Text strong>Địa chỉ</Text>
                <br />
                <Text>Hà Nội, Việt Nam</Text>
              </div>

              {/* Social */}
              <Title level={4}>Theo dõi chúng tôi</Title>

              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 15,
                }}
              >
                <a
                  href="https://web.facebook.com/H2decor68?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookFilled
                    style={{
                      fontSize: 40,
                      color: "#1877F2",
                      transition: "0.3s",
                    }}
                  />
                </a>

                <a
                  href="https://web.facebook.com/H2decor68?_rdc=1&_rdr#"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterCircleFilled
                    style={{
                      fontSize: 40,
                      color: "#1DA1F2",
                      transition: "0.3s",
                    }}
                  />
                </a>

                <a
                  href="https://web.facebook.com/H2decor68?_rdc=1&_rdr#" // Replace with actual YouTube channel URL
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YoutubeFilled
                    style={{
                      fontSize: 40,
                      color: "#FF0000",
                      transition: "0.3s",
                    }}
                  />
                </a>
              </div>
            </Card>
          </Col>

          {/* Form liên hệ */}
          <Col xs={24} md={14}>
            <Card
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
              }}
            >
              <Title level={3} style={{ color: "#1677ff" }}>
                Gửi Tin Nhắn
              </Title>

              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Họ và tên"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập họ tên!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nhập họ và tên" />
                </Form.Item>

                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập email!",
                    },
                    {
                      type: "email",
                      message: "Email không hợp lệ!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nhập email" />
                </Form.Item>

                <Form.Item
                  label="Tiêu đề"
                  name="subject"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập tiêu đề!",
                    },
                  ]}
                >
                  <Input size="large" placeholder="Nhập tiêu đề" />
                </Form.Item>

                <Form.Item
                  label="Nội dung"
                  name="message"
                  rules={[
                    {
                      required: true,
                      message: "Vui lòng nhập nội dung!",
                    },
                  ]}
                >
                  <TextArea
                    rows={6}
                    placeholder="Nhập nội dung liên hệ..."
                  />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                >
                  Gửi Liên Hệ
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>

        {/* Google Map */}
        <Card
          style={{
            marginTop: 50,
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
         

        </Card>
      </Content>
    </Layout>
  );
};

export default Contact;