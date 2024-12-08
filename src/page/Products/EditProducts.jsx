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
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAllCategoryAPI,
  getDataProductByIdAPI,
  getProductOrderAPI,
  postEditProductAPI,
} from "../../apis/handleDataAPI";

const { Title, Text } = Typography;
const { Content } = Layout;
const { Option } = Select;

function EditProducts() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const { id } = useParams();

  const [categories, setCategories] = useState([]);
  const [name, setName] = useState();
  const [rows, setRows] = useState([{ key: Date.now() }]);
  const [hasRules, setHasRules] = useState(null);

  const addRow = () => setRows([...rows, { key: Date.now() }]);
  const removeRow = (key) => setRows(rows.filter((row) => row.key !== key));

  useEffect(() => {
    if (!id) {
      alert("Invalid ID!");
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await getDataProductByIdAPI(token, id);
        const data = response.data.product;
        console.log(data);
        setName(data.product_name);
        // Load product data into the form
        form.setFieldsValue({
          product_name: data.product_name,
          category_name: data.category_id,
          rules: data.rules,
          notes: data.notes,
          price: data.price, // Gán giá trị đơn giá
          plusPrice: data.plusPrice,
        });

        // Initialize pricing rows
        const pricingRows = data.pricing.map((element, index) => ({
          key: index,
          quantity: element.quantity,
          price: element.price,
          note: element.note,
          plusPrice: element.plusPrice,
        }));

        setRows(pricingRows);

        // Determine if product has rules based on multiple_pricing
        setHasRules(data.multiple_pricing === "1"); // Update state
        const pricingFields = {};
        data.pricing.forEach((item, index) => {
          pricingFields[`quantity_${index}`] = item.quantity;
          pricingFields[`price_${index}`] = item.price;
          pricingFields[`note_${index}`] = item.note;
          pricingFields[`plusPrice_${index}`] = item.plusPrice;
        });

        // Gán toàn bộ giá trị vào form
        form.setFieldsValue(pricingFields);
      } catch (error) {
        console.error("Error fetching product:", error);
        alert("Failed to fetch product data. Please try again.");
      }
    };

    fetchProduct();
  }, [id, token, form]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategoryAPI(token);
        setCategories(response.data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, [token]);

  const transformData = (data) => {
    const transformedData = {
      id: id,
      session_token: token,
      category_id: data.category_name,
      product_name: data.product_name,
      rules: data.rules,
      notes: data.notes !== undefined ? data.notes : "",
      price: data.price !== undefined ? data.price : 0,
      plusPrice: data.plusPrice !== undefined ? data.plusPrice : 0,
      pricing: [],
    };

    if (hasRules) {
      rows.forEach((_, index) => {
        if (data[`quantity_${index}`] !== undefined) {
          transformedData.pricing.push({
            quantity: data[`quantity_${index}`] || 0,
            price: parseFloat(data[`price_${index}`]) || 0,
            note: data[`note_${index}`] || "", // Nếu cần, bạn có thể để chuỗi rỗng ở đây
            plusPrice: data[`plusPrice_${index}`] || 0,
          });
        }
      });
    } else {
      transformedData.price = parseFloat(data.price);
      transformedData.plusPrice = parseFloat(data.plusPrice);
    }

    transformedData.nhieuquycach = hasRules ? 1 : 0;
    return transformedData;
  };

  const handleEditProduct = async () => {
    const formData = form.getFieldsValue();
    const formattedData = transformData(formData);
    console.log(formattedData);

    try {
      const response = await postEditProductAPI(formattedData);
      console.log(response);
      if (response.data.success) {
        navigate("/san-pham");
      }
    } catch (error) {
      console.error("Error editing product:", error);
      alert("Failed to edit product. Please try again.");
    }
  };

  const handleHasRules = () => {
    setRows([{ key: Date.now() }]);
    form.resetFields();
    setHasRules(null);
  };
  const [orders, setOrders] = useState([]);

  const fetchData = async (name) => {
    try {
      const response = await getProductOrderAPI(token, name);
      console.log(response);

      // Lọc các đơn hàng có order_status khác 6
      const filteredOrders = response.data.orders.filter(
        (item) => item.order_status !== "6"
      );

      // Lấy danh sách order_id từ các đơn hàng đã lọc
      const newOrders = filteredOrders.map((item) => item.order_id);

      setOrders(newOrders); // Cập nhật danh sách đơn hàng
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    if (name && token) {
      fetchData(name);
    }
    console.log(orders);
  }, [name, token]);

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
            <Title level={3}>Chỉnh sửa sản phẩm</Title>
          </Col>
          <Col>
            <Link to="/san-pham">
              <Button style={{ marginRight: 10 }}>Hủy</Button>
            </Link>
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
              onClick={handleEditProduct}
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
              <Title level={3}>Giá cơ bản</Title>
              <Row gutter={16}>
                <Col flex={1}>
                  <Form.Item name="price" label="Đơn giá">
                    <Input placeholder="Nhập đơn giá" />
                  </Form.Item>
                </Col>
                <Col flex={1}>
                  <Form.Item name="plusPrice" label="Cộng thêm">
                    <Input placeholder="Nhập cộng thêm" />
                  </Form.Item>
                </Col>
              </Row>
              <Button
                type="link"
                style={{ color: "blue" }}
                onClick={handleHasRules}
              >
                Thay đổi quy tắc
              </Button>
            </Col>
          </Row>
        )}

        <Row>
          <Col
            style={{
              border: "1px solid black",
              padding: "1rem",
              borderRadius: "10px",
              flex: 2,
              marginRight: 20,
              marginTop: 20,
            }}
          >
            <Title level={4}>Lịch sử đơn hàng có chứa sản phẩm</Title>
            <Row gutter={[16, 16]}>
              {orders.map((order, index) => (
                <Col key={index} xs={24} sm={12} md={8} lg={6}>
                  {/* <Text style={{ color: "#52c41a" }}>Đơn hàng #{order}</Text> */}
                  <Link
                    to={`/don-hang/chi-tiet-don-hang/${order}`}
                    style={{ color: "#52c41a", textDecoration: "none" }}
                  >
                    <Text style={{ color: "#52c41a" }}>Đơn hàng #{order}</Text>
                  </Link>
                </Col>
              ))}
            </Row>
            {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
              <Button type="link">Tải thêm</Button>
            </div> */}
          </Col>
        </Row>
      </Content>
    </Form>
  );
}

export default EditProducts;
