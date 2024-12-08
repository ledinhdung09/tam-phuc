import { Button, Form, Input, Layout, Radio, Select, theme } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getDataCustomerIdAPI,
  postUpdateCustomerAPI,
  deleteCustomerIdAPI,
} from "../../apis/handleDataAPI";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

function EditClient() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      alert("Invalid ID!");
      return;
    }

    const fetchData = async () => {
      try {
        const response = await getDataCustomerIdAPI(token, id);
        const data = response.data.data;
        // Đặt giá trị API vào form
        form.setFieldsValue({
          address: data.address,
          city: data.id_city,
          company_name: data.company_name,
          district: data.id_districts,
          email: data.email,
          note: data.note,
          phone: data.phone,
          tax_code: data.tax_code,
          ward: data.id_wards,
          customer_name: data.customer_name,
          company_email: data.company_email,
          birth_year: data.birth_year,
          gender: data.gender,
        });
        setSelectedCity(data.id_city);
        setSelectedDistrict(data.id_districts);

        setSelectedCityId(data.id_city);
        setSelectedDistrictId(data.id_districts);
        setSelectedWardId(data.id_wards);

        setSelectedCityName(data.city);
        setSelectedDistrictName(data.district);
        setSelectedWardName(data.ward);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };

    fetchData();
  }, [id, token, form]);

  const handleAddClient = async () => {
    const formData = form.getFieldsValue();

    const customer_id = id || "";
    const address = formData.address || "";
    const city = selectedCityName || "";
    const company_email = formData.company_email || "";
    const company_name = formData.company_name || "";
    const district = selectedDistrictName || "";
    const email = formData.email || "";
    const gender = formData.gender || "";
    const customer_name = formData.customer_name || "";
    const note = formData.note || "";
    const phone = formData.phone || "";
    const session_token = token || ""; // Nếu cần giá trị token
    const tax_code = formData.tax_code || "";
    const ward = selectedWardName || "";
    const birth_year = formData.birth_year || "";
    const id_city = selectedCityId || "";
    const id_districts = selectedDistrictId || "";
    const id_wards = selectedWardId || "";

    try {
      const response = await postUpdateCustomerAPI(
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
        ward,
        customer_id,
        id_city,
        id_districts,
        id_wards
      );
      if (response.data.success == true) {
        navigate("/khach-hang");
        //console.log(response);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };
  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));
  useEffect(() => {
    setCate_id(localStorage.getItem("cate_id"));
  }, []);
  const handleDelete = async () => {
    if (cate_id === "1") {
      alert("Bạn không có quyền xóa khách hàng");
    } else {
      const isRemove = confirm("Bạn muốn xóa chứ?");
      if (isRemove) {
        try {
          const response = await deleteCustomerIdAPI(token, id);
          console.log(response);
          if (response.data.success == true) {
            navigate("/khach-hang");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          alert("Failed to fetch data. Please try again.");
        }
        return;
      }
    }
  };
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedCityName, setSelectedCityName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");
  const [selectedCityId, setSelectedCityId] = useState("");
  const [selectedDistrictId, setSelectedDistrictId] = useState("");
  const [selectedWardId, setSelectedWardId] = useState("");

  // Hàm gọi API lấy danh sách thành phố
  useEffect(() => {
    fetch("https://open.oapi.vn/location/provinces?size=100")
      .then((response) => response.json())
      .then((data) => setCities(data.data))
      //.then((data) => console.log(data.data))
      .catch((error) => console.error("Lỗi khi lấy dữ liệu thành phố:", error));
  }, []);

  // Hàm gọi API lấy danh sách quận/huyện dựa vào thành phố được chọn
  useEffect(() => {
    if (selectedCity) {
      fetch(`https://open.oapi.vn/location/districts/${selectedCity}?size=100`)
        .then((response) => response.json())
        .then((data) => setDistricts(data.data))
        .catch((error) =>
          console.error("Lỗi khi lấy dữ liệu quận/huyện:", error)
        );
    } else {
      setDistricts([]);
      setWards([]);
    }
  }, [selectedCity]);

  // Hàm gọi API lấy danh sách phường dựa vào quận/huyện được chọn
  useEffect(() => {
    if (selectedDistrict) {
      fetch(`https://open.oapi.vn/location/wards/${selectedDistrict}?size=100`)
        .then((response) => response.json())
        .then((data) => setWards(data.data))
        .catch((error) => console.error("Lỗi khi lấy dữ liệu phường:", error));
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);
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
              Chỉnh sửa khách hàng
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
                  <Select
                    placeholder="Chọn thành phố"
                    onChange={(value, name) => {
                      setSelectedCity(value);
                      setSelectedCityName(name.name);
                      setSelectedCityId(name.key);
                      // Xóa dữ liệu cũ của Quận/Huyện và Phường
                      setSelectedDistrict(null);
                      setSelectedDistrictName("");
                      setDistricts([]); // Xóa danh sách quận/huyện cũ

                      setSelectedWardName("");
                      setWards([]); // Xóa danh sách phường cũ

                      // Xóa giá trị trong form
                      form.setFieldsValue({
                        district: null,
                        ward: null,
                      });
                    }}
                  >
                    {cities.map((city) => (
                      <Option key={city.id} value={city.id} name={city.name}>
                        {city.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="district" label="Quận/ Huyện">
                  <Select
                    placeholder="Chọn quận/huyện"
                    onChange={(value, name) => {
                      setSelectedDistrict(value);
                      setSelectedDistrictName(name.name);
                      setSelectedDistrictId(name.key);

                      // Xóa giá trị Phường
                      setSelectedWardName("");
                      setWards([]); // Xóa danh sách phường cũ

                      // Xóa giá trị trong form
                      form.setFieldsValue({
                        ward: null,
                      });
                    }}
                    disabled={!selectedCity}
                  >
                    {districts.map((district) => (
                      <Option
                        key={district.id}
                        value={district.id}
                        name={district.name}
                      >
                        {district.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="ward" label="Phường">
                  <Select
                    onChange={(value, name) => {
                      setSelectedWardName(name.name);
                      setSelectedWardId(name.key);
                    }}
                    placeholder="Chọn phường"
                    disabled={!selectedDistrict}
                  >
                    {wards.map((ward) => (
                      <Option key={ward.id} value={ward.id} name={ward.name}>
                        {ward.name}
                      </Option>
                    ))}
                  </Select>
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
        <Button
          style={{ backgroundColor: "red", color: "white", marginTop: "1rem" }}
          type="primary"
          onClick={handleDelete}
        >
          Xóa
        </Button>
      </Content>{" "}
    </Form>
  );
}

export default EditClient;
