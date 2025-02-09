import { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Layout,
  Select,
  theme,
  Typography,
  Row,
  Col,
} from "antd";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllCategoryAPI,
  getAllClassifylv2API,
  postAddProductAPI,
} from "../../apis/handleDataAPI";

const { Title } = Typography;
const { Content } = Layout;
const { Option } = Select;

function AddProducts() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [categories, setCategories] = useState([]);
  const [classifys, setClassifys] = useState([]);
  const [rows, setRows] = useState([{ key: Date.now() }]);
  const [hasRules, setHasRules] = useState(null); // Trạng thái ban đầu là null (chưa chọn)

  const addRow = () => setRows([...rows, { key: Date.now() }]);
  const removeRow = (key) => setRows(rows.filter((row) => row.key !== key));

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoryAPI(token);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    const fetchClassify = async () => {
      try {
        const response = await getAllClassifylv2API(token);
        setClassifys(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchClassify();
    fetchCategories();
  }, [token]);

  const transformData = (data) => {
    const transformedData = {
      session_token: token,
      category_id: data.category_name,
      product_name: data.product_name,
      classifyLevel2: data.product_cate_lv2,
      rules: data.rules,
      notes: data.notes !== undefined ? data.notes : "",
      price: data.price !== undefined ? data.price : 0,
      plusPrice: data.plusPrice !== undefined ? data.plusPrice : 0,
      pricing: [],
    };
    if (data.price == undefined) {
      transformedData.nhieuquycach = 1;
    } else {
      transformedData.nhieuquycach = 0;
    }
    rows.forEach((_, index) => {
      if (data[`quantity_${index}`] !== undefined) {
        transformedData.pricing.push({
          quantity: data[`quantity_${index}`] || 0,
          price: parseFloat(data[`price_${index}`]) || 0,
          note: data[`note_${index}`] || "", // Nếu cần, bạn có thể để chuỗi rỗng ở đây
          plusPrice: data[`plusPrice_${index}`] || 0,
        });
      } else {
        transformedData.pricing.push({
          quantity: 0,
          price: 0,
          note: 0,
          plusPrice: 0,
        });
      }
    });

    return transformedData;
  };

  const handleAddProduct = async () => {
    const formData = form.getFieldsValue();
    const formattedData = transformData(formData);
    console.log(formattedData);
    try {
      const response = await postAddProductAPI(formattedData);
      console.log(response);
      if (response.data.success) {
        navigate("/san-pham");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const handleHasRules = () => {
    setRows([{ key: Date.now() }]);
    form.resetFields();
    setHasRules(null);
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
        <Row style={{ justifyContent: "space-between", alignItems: "center" }}>
          <Col>
            <Title level={3}>Tạo sản phẩm</Title>
          </Col>
          <Col>
            <Link to="/san-pham">
              <Button style={{ marginRight: 10 }}>Hủy</Button>
            </Link>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
              onClick={handleAddProduct}
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

            <Form.Item name="product_name" label="Tên sản phẩm">
              <Input placeholder="Nhập tên sản phẩm" />
            </Form.Item>
            <Row gutter={16}>
              <Col flex={1}>
                <Form.Item name="category_name" label="Nhóm sản phẩm">
                  <Select placeholder="Chọn nhóm sản phẩm">
                    {categories.map((category) => (
                      <Option key={category.id} value={category.id}>
                        {category.category_name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col flex={1}>
                <Form.Item name="rules" label="Rules">
                  <Input placeholder="Nhập đơn vị tính" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="product_cate_lv2" label="Phân loại cấp 2">
              <Select placeholder="Chọn phân loại cấp 2">
                {classifys.map((classify) => (
                  <Option key={classify.id} value={classify.title}>
                    {classify.title}
                  </Option>
                ))}
              </Select>
            </Form.Item>
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
              Mô tả sản phẩm
            </Title>

            <Form.Item name="notes">
              <Input.TextArea placeholder="Nhập mô tả" rows={6} />
            </Form.Item>
          </Col>
        </Row>

        {hasRules === null ? (
          <Row
            style={{
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "10px",
              marginTop: 20,
            }}
          >
            <Col>
              <Title level={3}>Lựa chọn quy tắc</Title>
              <Button
                style={{ marginRight: 10 }}
                onClick={() => setHasRules(true)}
              >
                Có Quy Tắc
              </Button>
              <Button onClick={() => setHasRules(false)}>Không Quy Tắc</Button>
            </Col>
          </Row>
        ) : hasRules ? (
          <Row>
            <Col
              style={{
                border: "1px solid black",
                padding: "1rem",
                borderRadius: "10px",
                marginTop: 20,
              }}
            >
              <Title level={3}>Quy tắc tính giá</Title>

              {rows.map((row, index) => (
                <Row gutter={16} key={row.key} style={{ marginBottom: 16 }}>
                  <Col flex={1}>
                    <Form.Item name={`quantity_${index}`} label="Số lượng">
                      <Input placeholder="Nhập số lượng" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name={`price_${index}`} label="Đơn giá">
                      <Input placeholder="Nhập đơn giá" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name={`plusPrice_${index}`} label="Cộng thêm">
                      <Input placeholder="Nhập cộng thêm" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name={`note_${index}`} label="Ghi chú">
                      <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
                    </Form.Item>
                  </Col>
                  {rows.length > 1 && (
                    <Col>
                      <Button
                        type="link"
                        style={{ color: "red" }}
                        onClick={() => removeRow(row.key)}
                      >
                        Xóa
                      </Button>
                    </Col>
                  )}
                </Row>
              ))}
              <Button type="link" onClick={addRow} style={{ color: "green" }}>
                Thêm quy tắc
              </Button>
            </Col>
          </Row>
        ) : (
          <Row>
            <Col
              style={{
                border: "1px solid black",
                padding: "1rem",
                borderRadius: "10px",
                marginTop: 20,
              }}
            >
              <Title level={3}>Không có quy tắc</Title>
              {/* Phần logic hiển thị không quy tắc */}
              {rows.map((row, index) => (
                <Row gutter={16} key={row.key} style={{ marginBottom: 16 }}>
                  <Col flex={1}>
                    <Form.Item name={`price`} label="Đơn giá">
                      <Input placeholder="Nhập đơn giá" />
                    </Form.Item>
                  </Col>
                  <Col flex={1}>
                    <Form.Item name={`plusPrice`} label="Cộng thêm">
                      <Input placeholder="Nhập cộng thêm" />
                    </Form.Item>
                  </Col>
                  {rows.length > 1 && (
                    <Col>
                      <Button
                        type="link"
                        style={{ color: "red" }}
                        onClick={() => removeRow(row.key)}
                      >
                        Xóa
                      </Button>
                    </Col>
                  )}
                </Row>
              ))}
            </Col>
          </Row>
        )}

        {hasRules !== null ? (
          <Button
            type={Link}
            style={{ backgroundColor: "green", color: "white", marginTop: 10 }}
            onClick={() => handleHasRules()}
          >
            Chọn lại
          </Button>
        ) : (
          <></>
        )}
      </Content>
    </Form>
  );
}

export default AddProducts;
