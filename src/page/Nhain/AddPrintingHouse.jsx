import { Button, Form, Input, Layout, theme } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { postAddPrintAPI } from "../../apis/handleDataAPI";

const { Title } = Typography;
const { Content } = Layout;

function AddPrintingHouse() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleAddPrint = async () => {
    const formData = form.getFieldsValue();
    const address = formData.address || "";
    const city = formData.city || "";
    const company_name = formData.company_name || "";
    const district = formData.district || "";
    const email = formData.email || "";
    const note = formData.note || "";
    const phone = formData.phone || "";
    const session_token = token || ""; // Nếu cần giá trị token
    const tax_code = formData.tax_code || "";
    const ward = formData.ward || "";
    try {
      const response = await postAddPrintAPI(
        address,
        city,
        company_name,
        district,
        email,
        note,
        phone,
        session_token,
        tax_code,
        ward
      );
      if (response.data.success == true) {
        navigate("/nha-in");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };

  return (
    <Form form={form} layout="vertical" autoComplete="off">
      <Content
        style={{
          margin: "24px 16px",
          padding: 24,
          minHeight: 280,
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          overflow: "auto",
        }}
      >
        <Row
          style={{
            marginTop: 0,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Col>
            <Title style={{ margin: 0, marginBottom: 16 }} level={3}>
              Thêm nhà in
            </Title>
          </Col>
          <Col>
            <Link to="/nha-in">
              <Button style={{ marginRight: 10 }}>Hủy</Button>
            </Link>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
              onClick={handleAddPrint}
            >
              Lưu thông tin
            </Button>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "10px",
              flex: 2,
              marginRight: 20,
            }}
          >
            <Title style={{ margin: 0, marginBottom: 16 }} level={3}>
              Thông tin chung
            </Title>

            <Row gutter={16}>
              <Col flex={1}>
                <Form.Item name="company_name" label="Tên công ty">
                  <Input placeholder="Nhập tên công ty" />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="tax_code" label="Mã số thuế">
                  <Input placeholder="Nhập mã số thuế" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={1}>
                <Form.Item name="phone" label="Số điện thoại">
                  <Input placeholder="Nhập số điện thoại" />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="email" label="Email">
                  <Input placeholder="Nhập email" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={1}>
                <Form.Item name="city" label="Thành phố">
                  <Input placeholder="Thành phố" />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="district" label="Quận/ Huyện">
                  <Input placeholder="Quận/ Huyện" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex="none">
                <Form.Item
                  style={{ width: "380px" }}
                  name="ward"
                  label="Phường"
                >
                  <Input placeholder="Phường" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={1}>
                <Form.Item name="address" label="Địa chỉ cụ thể">
                  <Input placeholder="Địa chỉ cụ thể" />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col
            style={{
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "10px",
              flex: 1,
              height: "fit-content",
            }}
          >
            <Title style={{ margin: 0, marginBottom: 16 }} level={3}>
              Ghi chú về khách
            </Title>
            <Form.Item name="note">
              <Input.TextArea placeholder="Nhập ghi chú" rows={9} />
            </Form.Item>
          </Col>
        </Row>
      </Content>{" "}
    </Form>
  );
}

export default AddPrintingHouse;
