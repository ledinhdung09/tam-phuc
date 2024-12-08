import { Button, Form, Input, Layout, Select, theme } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getDataPrintIdAPI,
  postUpdatePrintAPI,
  deletePrintIdAPI,
} from "../../apis/handleDataAPI";
import { useEffect, useState } from "react";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;
function EditPrintingHouse() {
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
        const response = await getDataPrintIdAPI(token, id);
        const data = response.data.data;

        console.log(data);
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

  const handleSave = async () => {
    try {
      const formData = form.getFieldsValue();
      const address = formData.address || "";
      const city = selectedCityName || "";
      const company_name = formData.company_name || "";
      const district = selectedDistrictName || "";
      const email = formData.email || "";
      const note = formData.note || "";
      const phone = formData.phone || "";
      const session_token = token || "";
      const printer_id = id || "";
      const tax_code = formData.tax_code || "";
      const ward = selectedWardName || "";
      const id_city = selectedCityId || "";
      const id_districts = selectedDistrictId || "";
      const id_wards = selectedWardId || "";

      try {
        const response = await postUpdatePrintAPI(
          address,
          city,
          company_name,
          district,
          email,
          note,
          phone,
          session_token,
          tax_code,
          ward,
          printer_id,
          id_city,
          id_districts,
          id_wards
        );
        if (response.data.success == true) {
          navigate("/nha-in");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching the form. Please try again.");
      }
    } catch (error) {
      console.error("Error saving data:", error);
      alert("Error saving data. Please try again.");
    }
  };

  const handleDelete = async () => {
    const isRemove = confirm("Bạn muốn xóa chứ?");
    if (isRemove) {
      try {
        const response = await deletePrintIdAPI(token, id);
        console.log(response);
        if (response.data.success == true) {
          navigate("/nha-in");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
      return;
    }
    console.log("Không xóa");
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
              Chỉnh sửa nhà in
            </Title>
          </Col>
          <Col>
            <Link to="/nha-in">
              <Button style={{ marginRight: 10 }}>Hủy</Button>
            </Link>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
              onClick={handleSave}
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
            </Row>
            <Row gutter={16}>
              <Col flex="none">
                <Form.Item
                  style={{ width: "380px" }}
                  name="ward"
                  label="Phường"
                >
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
        <Button
          style={{ backgroundColor: "red", color: "white", marginTop: "1rem" }}
          type="primary"
          onClick={handleDelete}
        >
          Xóa
        </Button>
      </Content>
    </Form>
  );
}

export default EditPrintingHouse;
