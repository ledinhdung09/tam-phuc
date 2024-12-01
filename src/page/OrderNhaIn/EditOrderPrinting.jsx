import {
  Statistic,
  Layout,
  theme,
  Row,
  Col,
  Button,
  Form,
  Input,
  Typography,
  Tag,
  Table,
  Select,
  Space,
  InputNumber,
  DatePicker,
  Card,
  Modal,
  Popconfirm,
} from "antd";
import {
  PrinterOutlined,
  DeleteOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDataPrintIdAPI,
  getDataOrdersByIdAPI,
  getDataProductByIdAPI,
  postDataPrintAPI,
  getDataCustomerIdAPI,
  updateOrdersAPI,
  updateOrdersStatusAPI,
} from "../../apis/handleDataAPI";
import { useEffect, useState } from "react";
import moment from "moment";

const { Title, Text } = Typography;
const { Content } = Layout;

function EditOrderPrinting() {
  const [form] = Form.useForm();
  const calculateTotalPrice = (dataSource) => {
    return dataSource.reduce((total, record) => total + record.totalPrice, 0);
  };
  const { id } = useParams();
  const [dataProducts, setDataProducts] = useState([]);
  const [dataOrder, setDataOrder] = useState([]);
  const [mainTableData, setMainTableData] = useState([]);
  const [totalMoney, setTotalMoney] = useState();
  const [order_id, setOrder_id] = useState();
  const [dateOrder, setDateOrder] = useState();
  const [promotion, setPromotion] = useState(0); // Khuyến mãi
  const [vat, setVAT] = useState(0); // VAT (%)
  const [deposit, setDeposit] = useState(0); // Đặt cọc
  const totalProductPrice = calculateTotalPrice(mainTableData);
  const vatAmount = (totalProductPrice * vat) / 100; // Tiền VAT
  const totalAmount = totalProductPrice - promotion + vatAmount; // Tổng cộng
  const remainingAmount = totalAmount - deposit; // Còn lại
  const [estimatedDate, setEstimatedDate] = useState(""); // Trạng thái lưu ngày dự kiến
  const [customerId, setCustomerId] = useState(""); // Trạng thái lưu ngày dự kiến
  const [customerName, setCustomerName] = useState(""); // Trạng thái lưu ngày dự kiến
  const [notes, setNotes] = useState(""); // Trạng thái lưu ngày dự kiến

  useEffect(() => {
    const fetchDataOrderById = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataOrdersByIdAPI(token, id);
        console.log(response);
        const products = JSON.parse(response.data.order.product_details);
        setDataOrder(response);
        setTotalMoney(response.data.order.total);
        setOrder_id(response.data.order.order_id);
        setDateOrder(response.data.order.order_date);
        setVAT(response.data.order.vat);
        setDeposit(response.data.order.deposit);
        setPromotion(response.data.order.promotion);
        console.log("Check Products: ", products);
        setDataProducts(products);
        setCustomerId(response.data.order.customer_id); // Cập nhật customerId
        setNotes(response.data.order.notes); // Cập nhật customerId
        const estimatedDateString = response.data.order.estimated_delivery_date;
        console.log(estimatedDateString);
        setEstimatedDate(moment(estimatedDateString));
        console.log(notes);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchDataOrderById();
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return; // Không thực hiện nếu customerId chưa được gán
      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataCustomerIdAPI(token, customerId);
        console.log(response);
        console.log(response.data.data.customer_name);
        setCustomerName(response.data.data.customer_name); // Giả sử API trả về customer_name
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, [customerId]); // Thêm customerId vào danh sách phụ thuộc

  useEffect(() => {
    if (dataProducts.length > 0) {
      console.log(dataProducts);
      const fetchProductDetails = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const details = await Promise.all(
            dataProducts.map(async (product) => {
              const response = await getDataProductByIdAPI(
                token,
                product.product_code
              );

              const productData = response.data.product;
              return {
                key: productData.id,
                productDetail: {
                  name: productData.product_name,
                  notes: productData.notes,
                },
                unit: productData.rules,
                image: "/",
                quantity: product.quantity,
                unitPrice: product.price,
                totalPrice:
                  product.quantity * product.price +
                  parseFloat(product.plus_price),
                printer: productData.category_id,
                date: product.date,
              };
            })
          );
          setMainTableData(details);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchProductDetails();
    }
  }, [dataProducts]);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Ngày không hợp lệ";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productDetail",
      key: "productDetail",
      render: (details) => (
        <div>
          <Text strong style={{ color: "#1890ff" }}>
            {details.name}
          </Text>

          <div
            style={{ fontSize: 12, color: "#666", marginTop: 4 }}
            dangerouslySetInnerHTML={{
              __html: details.notes.replace(/\n/g, "<br>"),
            }}
          ></div>
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (src) => <img src={src} alt="Product" style={{ width: 50 }} />,
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      key: "unit",
      render: (text) => <Text>{text}</Text>,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      render: (quantity) => (
        <InputNumber
          min={1}
          disabled
          defaultValue={quantity}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price) => (
        <Input defaultValue={price} disabled prefix="đ" style={{ width: 80 }} />
      ),
    },
    {
      title: "Nhà in",
      dataIndex: "printer",
      key: "printer",
      render: (_, record) =>
        printingHouses.length > 0 ? (
          <Select
            value={
              selectedPrinters[record.key]
                ? printingHouses.find(
                    (printer) => printer.id === selectedPrinters[record.key]
                  )?.company_name
                : "Chọn nhà in"
            }
            onChange={(value) => handlePrinterChange(record.key, value)}
            style={{ width: 150 }}
          >
            {printingHouses.map((printer) => (
              <Select.Option key={printer.id} value={printer.company_name}>
                {printer.company_name}
              </Select.Option>
            ))}
          </Select>
        ) : (
          "Loading..."
        ),
    },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <DatePicker
          style={{ width: 120 }}
          value={
            selectedDates1[record.key]
              ? moment(selectedDates1[record.key], "YYYY-MM-DD")
              : null
          }
          onChange={(date) => handleDateChangeProduct(date, record.key)}
        />
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => (
        <Text strong>{new Intl.NumberFormat("vi-VN").format(total)} đ</Text>
      ),
    },
  ];
  const [printingHouses, setPrintingHouses] = useState([]);
  const [selectedPrinters, setSelectedPrinters] = useState({}); // Lưu nhà in được chọn
  const [selectedDates1, setSelectedDates1] = useState({});

  // Gọi API để lấy danh sách nhà in
  const fetchPrintingHouses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await postDataPrintAPI(token, 10, 1); // Sử dụng API bạn đã định nghĩa
      console.log(response);
      setPrintingHouses(response.data.data); // Gán dữ liệu vào state
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà in:", error);
    }
  };
  const handleDateChangeProduct = (date, recordKey) => {
    const formattedDate = date ? moment(date).format("YYYY-MM-DD") : null;
    setSelectedDates1((prev) => ({
      ...prev,
      [recordKey]: formattedDate, // Cập nhật ngày cho sản phẩm tương ứng
    }));
  };

  // Gọi fetchPrintingHouses khi component được mount
  useEffect(() => {
    fetchPrintingHouses();
  }, []);

  // Cập nhật giá trị nhà in được chọn
  const handlePrinterChange = (recordKey, selectedValue) => {
    const selectedPrinter = printingHouses.find(
      (printer) => printer.company_name === selectedValue
    );
    if (selectedPrinter) {
      setSelectedPrinters((prev) => ({
        ...prev,
        [recordKey]: selectedPrinter.id, // Lưu id thay vì tên
      }));
    }
  };

  const navigate = useNavigate();
  const handleUpdateOrder = async () => {
    const token = localStorage.getItem("authToken");

    // Format dataProducts và thêm thông tin id_print, date
    const formattedData = Object.keys(selectedPrinters).map((key) => {
      return dataProducts
        .filter((product) => product.product_code === key) // Lọc sản phẩm theo product_code
        .map((product) => ({
          ...product, // Giữ nguyên thông tin gốc của product
          id_print: selectedPrinters[key], // Thêm id_print từ selectedPrinters
          date: selectedDates1[key]
            ? moment(selectedDates1[key], "YYYY-MM-DD").format("DD-MM-YYYY")
            : null, // Định dạng ngày hoặc null nếu không có ngày
        }));
    });

    // Gộp tất cả sản phẩm lại trong một mảng
    const mergedProductDetails = formattedData.flat();

    // Tạo đối tượng cuối cùng
    const result = {
      order_id: id, // ID đơn hàng (cố định hoặc lấy từ logic khác)
      session_token: token,
      product_details: mergedProductDetails, // Thêm danh sách sản phẩm đã format
    };

    console.log(result);
    try {
      const response = await updateOrdersAPI(result);
      console.log(response);
      if (response.data.success == true) {
        navigate("/dat-hang-nha-in");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
    // Gửi API hoặc sử dụng kết quả (nếu cần)
  };

  const handleReturnOrder = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await updateOrdersStatusAPI(token, id, 3);
      console.log(response);
      if (response.data.success == true) {
        navigate("/dat-hang-nha-in");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };
  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        borderRadius: borderRadiusLG,
      }}
    >
      <div style={{ marginBottom: 20 }}>
        <Space size="large">
          <Col
            style={{
              borderRight: "1px solid",
              marginRight: 16,
              paddingRight: 16,
              fontWeight: "bold",
            }}
          >
            <Statistic title="Mã phiếu đặt hàng:" value={order_id} />
          </Col>
          <Col
            style={{
              borderRight: "1px solid",
              marginRight: 16,
              paddingRight: 16,
              fontWeight: "bold",
            }}
          >
            <Statistic title="Ngày nhận hàng:" value={formatDate(dateOrder)} />
          </Col>
          <Col>
            <Statistic
              title="Trạng thái"
              valueRender={() => <Tag color="green">Đang báo giá</Tag>}
            />
          </Col>
        </Space>
        <div style={{ float: "right", display: "flex" }}>
          <Popconfirm
            title="Bạn có muốn trả hàng không?"
            onConfirm={handleReturnOrder} // Hàm được gọi khi nhấn "Xóa"
            okText="Có"
            cancelText="Hủy"
            okButtonProps={{ type: "primary", danger: true }} // Nút "Xóa" màu đỏ
            cancelButtonProps={{ type: "default" }} // Nút "Hủy" mặc định
          >
            <Button
              style={{
                marginRight: "1rem",
              }}
              type="primary"
            >
              Trả hàng
            </Button>
          </Popconfirm>
          <Button type="primary" icon={<PrinterOutlined />}>
            In
          </Button>
        </div>
      </div>

      <Card style={{ margin: "20px auto", padding: "20px", borderRadius: 10 }}>
        <Title level={3}>Sản phẩm</Title>
        <Table
          columns={columns}
          dataSource={mainTableData}
          pagination={false}
          rowKey="key"
        />
      </Card>

      <Row>
        <Col
          style={{
            padding: "1rem",
            borderRadius: "10px",
            flex: 2,
            marginRight: 20,
            maxHeight: 250,
            background: colorBgContainer,
          }}
        >
          <Title
            style={{ margin: 0, marginBottom: 16, fontWeight: "bold" }}
            level={4}
          >
            Thông tin thêm
          </Title>
          <Form form={form} layout="vertical" autoComplete="off">
            <Row>
              <Col>
                <Typography
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Người đặt hàng
                </Typography>
                <Space>
                  <Select
                    disabled
                    value={customerName}
                    style={{ width: "650px" }}
                  />
                </Space>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col flex={1}>
                <Typography
                  style={{
                    fontWeight: "bold",
                    marginTop: "8px",
                    marginBottom: "8px",
                  }}
                >
                  Ngày nhận hàng dự kiến
                </Typography>
                <Space>
                  <Select
                    disabled
                    value={formatDate(estimatedDate)}
                    style={{ width: "650px" }}
                  />
                </Space>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col
          style={{
            padding: "1rem",
            borderRadius: "10px",
            flex: 1,
            height: "fit-content",
            background: colorBgContainer,
          }}
        >
          <Title
            style={{ margin: 0, marginBottom: 16, fontWeight: "bold" }}
            level={4}
          >
            Thông tin hóa đơn
          </Title>

          <Space direction="vertical" style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Tổng tiền hàng:</Text>
              <Text strong>
                {new Intl.NumberFormat("vi-VN").format(totalProductPrice)} đ
              </Text>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Khuyến mãi:</Text>
              <Text> {new Intl.NumberFormat("vi-VN").format(promotion)} đ</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>VAT:</Text>
              <Text>{vat}%</Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text strong>Tổng cộng:</Text>
              <Text>
                {new Intl.NumberFormat("vi-VN").format(totalAmount)} đ
              </Text>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Text>Đặt cọc:</Text>
              <Text>{new Intl.NumberFormat("vi-VN").format(deposit)} đ</Text>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
              }}
            >
              <Text>Còn lại:</Text>
              <Text>
                {" "}
                {new Intl.NumberFormat("vi-VN").format(remainingAmount)} đ{" "}
              </Text>
            </div>
          </Space>

          <Input.TextArea
            placeholder="Nhập ghi chú"
            value={notes}
            disabled
            rows={3}
            style={{
              marginBottom: "1rem",
            }}
          />
          <Button
            type="primary"
            style={{
              float: "right",
            }}
            onClick={handleUpdateOrder}
          >
            XÁC NHẬN ĐẶT HÀNG
          </Button>
        </Col>
      </Row>
    </Content>
  );
}

export default EditOrderPrinting;
