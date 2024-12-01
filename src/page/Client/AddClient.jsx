import { Button, Form, Input, Layout, Radio, theme } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { postAddCustomerAPI } from "../../apis/handleDataAPI";

const { Title } = Typography;
const { Content } = Layout;

function AddClient() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleAddClient = async () => {
    const formData = form.getFieldsValue();

    const address = formData.address || "";
    const city = formData.city || "";
    const company_email = formData.company_email || "";
    const company_name = formData.company_name || "";
    const district = formData.district || "";
    const email = formData.email || "";
    const gender = formData.gender || "";
    const customer_name = formData.customer_name || "";
    const note = formData.note || "";
    const phone = formData.phone || "";
    const session_token = token || ""; // Nếu cần giá trị token
    const tax_code = formData.tax_code || "";
    const ward = formData.ward || "";
    const birth_year = formData.birth_year || "";
    try {
      const response = await postAddCustomerAPI(
        birth_year,
        customer_name,
        address,
        city,
        company_email,
        company_name,
        district,
        email,
        gender,
        note,
        phone,
        session_token,
        tax_code,
        ward
      );
      if (response.data.success == true) {
        navigate("/khach-hang");
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
              Thêm khách hàng
            </Title>
          </Col>
          <Col>
            <Link to="/khach-hang">
              <Button style={{ marginRight: 10 }}>Hủy</Button>
            </Link>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
              onClick={handleAddClient}
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

            <Form.Item name="customer_name" label="Tên khách hàng">
              <Input placeholder="Nhập tên khách hàng" />
            </Form.Item>
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
              <Col flex="none">
                <Form.Item
                  name="birth_year"
                  label="Năm sinh"
                  style={{ width: "380px" }}
                >
                  <Input placeholder="Nhập năm sinh" />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="gender" label="Giới tính">
                  <Radio.Group style={{ marginLeft: 16 }} name="gender">
                    <Radio value="Nam">Nam</Radio>
                    <Radio value="Nữ">Nữ</Radio>
                  </Radio.Group>
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
            }}
          >
            <Title style={{ margin: 0, marginBottom: 16 }} level={3}>
              Ghi chú về khách
            </Title>

            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea placeholder="Nhập ghi chú" rows={9} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col
            style={{
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "10px",
              flex: 2,
              marginTop: 20,
            }}
          >
            <Title style={{ margin: 0, marginBottom: 16 }} level={3}>
              Địa chỉ giao hàng
            </Title>

            <Row gutter={16}>
              <Col flex={1}>
                <Form.Item name="company_name" label="Tên công ty">
                  <Input placeholder="Tên công ty" />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="tax_code" label="Mã số thuế">
                  <Input placeholder="Mã số thuế" />
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="company_email" label="Email công ty">
                  <Input placeholder="Email công ty" />
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
              <Col flex={1}>
                <Form.Item name="ward" label="Phường">
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
        </Row>
      </Content>{" "}
    </Form>
  );
}

export default AddClient;
