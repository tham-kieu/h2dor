import {
  Layout,
  Typography,
  Row,
  Col,
  Card,
} from "antd";

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <Layout style={{ background: "#f8fafc" }}>
      <Content
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "50px 20px",
        }}
      >
        {/* Banner */}
        

        {/* Tiêu đề */}
        <Title level={1} style={{ textAlign: "center" }}>
          Giới Thiệu Về H2DOR
        </Title>

        {/* Nội dung */}
        <Paragraph
          style={{
            fontSize: "16px",
            textAlign: "justify",
            lineHeight: "1.9",
          }}
        >
          H2DOR là website chuyên cung cấp các sản phẩm gốm sứ thủ công
          mỹ nghệ được tuyển chọn từ những làng nghề truyền thống nổi
          tiếng của Việt Nam. Với mong muốn mang những giá trị văn hóa
          lâu đời đến gần hơn với cuộc sống hiện đại, chúng tôi không
          ngừng tìm kiếm và giới thiệu những sản phẩm gốm sứ có chất
          lượng cao, thiết kế tinh tế và mang đậm bản sắc dân tộc.

          <br />
          <br />

          Mỗi sản phẩm tại H2DOR đều được chế tác cẩn thận bởi những
          nghệ nhân giàu kinh nghiệm, kết hợp giữa kỹ thuật thủ công
          truyền thống và phong cách thiết kế hiện đại. Từ những chiếc
          bình hoa trang trí, bộ ấm trà, tượng phong thủy cho đến các bộ
          sưu tập gốm nghệ thuật, tất cả đều được tạo nên với sự tỉ mỉ
          trong từng chi tiết nhằm mang đến vẻ đẹp độc đáo và giá trị sử
          dụng lâu dài cho khách hàng.

          <br />
          <br />

          Không chỉ đơn thuần là một cửa hàng trực tuyến, H2DOR còn mong
          muốn trở thành cầu nối giữa người yêu nghệ thuật và các làng
          nghề truyền thống. Chúng tôi tin rằng mỗi sản phẩm gốm sứ đều
          chứa đựng một câu chuyện, một nét đẹp văn hóa và tâm huyết của
          người nghệ nhân.

          <br />
          <br />

          Với phương châm hoạt động lấy khách hàng làm trung tâm, H2DOR
          cam kết mang đến trải nghiệm mua sắm tiện lợi, sản phẩm chất
          lượng cùng dịch vụ chăm sóc khách hàng tận tâm. Chúng tôi luôn
          nỗ lực đổi mới và phát triển để đáp ứng nhu cầu ngày càng đa
          dạng của khách hàng trên toàn quốc.
        </Paragraph>


        {/* Sứ mệnh - Tầm nhìn */}
        <Row gutter={[24, 24]} style={{ marginTop: "50px" }}>
          <Col xs={24} md={8}>
            <Card
              title="Sứ Mệnh"
              hoverable
              bordered={false}
              style={{
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              Mang vẻ đẹp của nghệ thuật gốm sứ Việt Nam đến với mọi gia
              đình, góp phần gìn giữ và phát huy các giá trị văn hóa
              truyền thống thông qua những sản phẩm chất lượng và ý nghĩa.
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title="Tầm Nhìn"
              hoverable
              bordered={false}
              style={{
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              Trở thành thương hiệu uy tín hàng đầu trong lĩnh vực kinh
              doanh gốm sứ thủ công, được khách hàng tin tưởng và lựa
              chọn trên toàn quốc.
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card
              title="Giá Trị Cốt Lõi"
              hoverable
              bordered={false}
              style={{
                height: "100%",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              }}
            >
              Chất lượng - Uy tín - Sáng tạo - Tận tâm. Đây là những giá
              trị nền tảng giúp H2DOR không ngừng phát triển và hoàn thiện
              mỗi ngày.
            </Card>
          </Col>
        </Row>

        {/* Lý do chọn */}
        <div style={{ marginTop: "60px" }}>
          <Title level={2} style={{ textAlign: "center" }}>
            Tại Sao Chọn H2DOR?
          </Title>

          <Row gutter={[24, 24]}>
            <Col xs={24} md={12}>
              <Card hoverable>
                ✓ Sản phẩm thủ công chất lượng cao từ các làng nghề nổi
                tiếng của Việt Nam.
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                ✓ Thiết kế tinh tế, phù hợp với nhiều phong cách trang
                trí hiện đại và truyền thống.
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                ✓ Đóng gói cẩn thận, đảm bảo an toàn trong quá trình vận
                chuyển.
              </Card>
            </Col>

            <Col xs={24} md={12}>
              <Card hoverable>
                ✓ Hỗ trợ khách hàng tận tâm, giao hàng nhanh chóng trên
                toàn quốc.
              </Card>
            </Col>
          </Row>
        </div>

        {/* Câu chuyện thương hiệu */}
        <div style={{ marginTop: "60px" }}>
          <Title level={2}>Câu Chuyện Thương Hiệu</Title>

          <Paragraph
            style={{
              fontSize: "16px",
              textAlign: "justify",
              lineHeight: "1.9",
            }}
          >
            H2DOR được hình thành từ tình yêu dành cho nghệ thuật gốm sứ
            truyền thống Việt Nam. Chúng tôi nhận thấy rằng những sản
            phẩm thủ công mang giá trị văn hóa sâu sắc cần được lan tỏa
            mạnh mẽ hơn trong thời đại số. Từ đó, H2DOR ra đời với mong
            muốn tạo ra một không gian trực tuyến nơi khách hàng có thể
            dễ dàng tìm thấy những sản phẩm gốm sứ đẹp, chất lượng và
            mang đậm dấu ấn nghệ thuật.

            <br />
            <br />

            Trên hành trình phát triển, chúng tôi luôn đặt sự hài lòng
            của khách hàng làm động lực để không ngừng hoàn thiện và mang
            đến những giá trị tốt đẹp hơn mỗi ngày. H2DOR tin rằng mỗi
            sản phẩm không chỉ là một món đồ trang trí mà còn là sự kết
            nối giữa nghệ thuật, văn hóa và cuộc sống hiện đại.
          </Paragraph>
        </div>
      </Content>
    </Layout>
  );
};

export default About;