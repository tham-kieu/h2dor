import { Layout, Row, Col, Typography, Divider } from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const { Footer: AntFooter } = Layout;
const { Title, Text } = Typography;

const Footer = () => {
  return (
    <AntFooter className="bg-gray-900 text-white py-12 px-4 md:px-8">
      <Row gutter={[32, 32]} className="max-w-6xl mx-auto">

        {/* BÊN TRÁI - LIÊN HỆ */}
    <Col xs={24} md={12}>
  <Title level={4} style={{ color: "#4CAF50", fontWeight: 700 }}>
    Liên hệ
  </Title>

  <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 14,
    paddingLeft:"20px",
   }}>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <EnvironmentOutlined style={{ color: "#4CAF50", fontSize: 16 }} />
      <Text style={{ color: "#4CAF50", fontWeight: 500 }}>
        Sân Kho Xóm Cộng Hạ Bằng Hà Nội
      </Text>
    </div>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <PhoneOutlined style={{ color: "#4CAF50", fontSize: 16 }} />
      <Text style={{ color: "#4CAF50", fontWeight: 500 }}>
        0866522269
      </Text>
    </div>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <MailOutlined style={{ color: "#4CAF50", fontSize: 16 }} />
      <Text style={{ color: "#4CAF50", fontWeight: 500 }}>
        Hoangopera@gmail.com
      </Text>
    </div>

    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
      <MailOutlined style={{ color: "#4CAF50", fontSize: 16 }} />
      <Text style={{ color: "#4CAF50", fontWeight: 500 }}>
        Hotline: 086.652.2269
      </Text>
    </div>

  </div>
</Col>
        {/* BÊN PHẢI - GOOGLE MAP */}
        <Col xs={24} md={12}>
          <Title level={4} style={{ color: "#4CAF50" }}>
            Bản đồ
          </Title>

          <div style={{ marginTop: 16 }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d59590.46195583163!2d105.51451671288937!3d21.016520140963223!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345a2e078045d5%3A0xcba9a58ee18036ba!2zSOG6oSBC4bqxbmcsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1781792104928!5m2!1svi!2s"
              width="100%"
              height="260"
              style={{
                border: 0,
                borderRadius: "12px",
              }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </Col>
      </Row>

      <Divider style={{ borderColor: "#333", marginTop: 30 }} />

      {/* COPYRIGHT BUTTON */}
      <div style={{ textAlign: "center" }}>
        <button
          style={{
            background: "#b8860b",
            border: "none",
            padding: "10px 24px",
            borderRadius: "20px",
            color: "white",
            fontWeight: 500,
            cursor: "pointer",
          }}
        >
          © 2026 H2DOR - All Rights Reserved
        </button>
      </div>
    </AntFooter>
  );
};

export default Footer;