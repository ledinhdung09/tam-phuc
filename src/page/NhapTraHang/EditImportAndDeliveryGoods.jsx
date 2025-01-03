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
  updateOrdersShipAPI,
} from "../../apis/handleDataAPI";
import { useEffect, useState } from "react";
import moment from "moment";
import Bill from "../Order/Bill";

const { Title, Text } = Typography;
const { Content } = Layout;

function EditImportAndDeliveryGoods() {
  const [form] = Form.useForm();
  const [isReadyToRender, setIsReadyToRender] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReadyToRender(true);
    }, 3000); // Chờ 3 giây

    return () => clearTimeout(timer); // Dọn dẹp bộ hẹn giờ khi component bị unmount
  }, []);
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
  const [new1, setNew1] = useState();
  const [estimatedDate, setEstimatedDate] = useState(""); // Trạng thái lưu ngày dự kiến
  const [customerId, setCustomerId] = useState(""); // Trạng thái lưu ngày dự kiến
  const [customerName, setCustomerName] = useState(""); // Trạng thái lưu ngày dự kiến
  const [notes, setNotes] = useState(""); // Trạng thái lưu ngày dự kiến
  const [phoneCustomer, setPhoneCustomer] = useState("");
  const [addressCustomer, setAddressCustomer] = useState("");
  const [nameStatus, setNameStatus] = useState("");

  useEffect(() => {
    console.log(remainingAmount);
    console.log(valueDelivery);
    setNew1(parseFloat(remainingAmount) + parseFloat(valueDelivery));
  });

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
        switch (response.data.order.order_status) {
          case "7":
            setNameStatus("Đang giao");
            break;
        }
        setVAT(response.data.order.vat);
        setDeposit(response.data.order.deposit);
        setPromotion(response.data.order.promotion);
        console.log("Check Products: ", products);
        setDataProducts(products);
        setCustomerId(response.data.order.customer_id); // Cập nhật customerId
        setNotes(response.data.order.notes); // Cập nhật customerId
        const estimatedDateString = response.data.order.estimated_delivery_date;
        console.log(estimatedDateString);
        setValueDelivery(response.data.order.price_ship);
        setEstimatedDate(moment(estimatedDateString));
        setName1(response.data.order.recipient_name);
        setAddress1(response.data.order.delivery_address);
        setPhone1(response.data.order.recipient_phone);
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
        handleSelectCustomer(response.data.data);
        setCustomerName(response.data.data.customer_name); // Giả sử API trả về customer_name
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, [customerId]); // Thêm customerId vào danh sách phụ thuộc
  const handlePrint = () => {
    const printContent = document.getElementById("print-area").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(
      "<html><head><title>Phiếu In</title></head><body>"
    );
    printWindow.document.write(printContent);
    printWindow.document.write("</body></html>");
    printWindow.document.close();
    printWindow.print();
  };

  const [taxCode, setTaxCode] = useState();
  const [email, setEmail] = useState();
  const [company_name, setCompany_name] = useState();
  const [name1, setName1] = useState("");
  const [address1, setAddress1] = useState("");
  const [phone1, setPhone1] = useState("");
  const handleSelectCustomer = (customer) => {
    console.log(customer);
    setPhoneCustomer(customer.phone);
    setCustomerName(customer.customer_name);
    setAddressCustomer(
      customer.address +
        " " +
        customer.ward +
        " " +
        customer.district +
        " " +
        customer.city
    );
    setTaxCode(customer.tax_code);
    setEmail(customer.company_email);
    setCompany_name(customer.company_name);
  };
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
              const printerName =
                printingHouses.find(
                  (printer) => printer.id === product.id_print
                )?.company_name || "Chọn nhà in"; // Lấy tên nhà in hoặc hiển thị mặc định
              return {
                key: productData.id,
                productDetail: {
                  name: productData.product_name,
                  notes: productData.notes,
                },
                unit: productData.rules,
                image: product.avatar,
                quantity: product.quantity,
                unitPrice: product.price,
                totalPrice:
                  product.quantity * product.price +
                  parseFloat(product.plus_price),
                printer: printerName, // Gán tên nhà in
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
            style={{
              fontSize: 12,
              color: "#666",
              marginTop: 4,
              maxHeight: "50px", // Giới hạn chiều cao
              overflowY: "auto", // Hiển thị thanh scroll dọc
            }}
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
      render: (src) => (
        <img
          src={
            "https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/" +
            src
          }
          alt="Product"
          style={{ width: 50 }}
        />
      ),
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
        <Input
          defaultValue={price}
          disabled
          prefix="đ"
          style={{ width: 120 }}
        />
      ),
    },
    // {
    //   title: "Nhà in",
    //   dataIndex: "printer",
    //   key: "printer",
    //   render: (_, record) =>
    //     printingHouses.length > 0 ? (
    //       <Select
    //         disabled
    //         value={record.printer || "Chọn nhà in"} // Sử dụng giá trị từ record
    //         onChange={(value) => handlePrinterChange(record.key, value)}
    //       >
    //         {printingHouses.map((printer) => (
    //           <Select.Option key={printer.id} value={printer.id}>
    //             {printer.company_name}
    //           </Select.Option>
    //         ))}
    //       </Select>
    //     ) : (
    //       "Loading..."
    //     ),
    // },
    {
      title: "Thời gian",
      dataIndex: "date",
      key: "date",
      render: (_, record) => (
        <span>{record.date}</span> // Hiển thị ngày định dạng
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
    console.log(valueDelivery);
    console.log(new1);

    try {
      const response = await updateOrdersStatusAPI(token, id, 3);
      console.log(response);
      if (response.data.success == true) {
        navigate("/nhap-va-giao-hang");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };

  const handleUpdateOrderFail = async () => {
    const token = localStorage.getItem("authToken");
    console.log(valueDelivery);
    console.log(new1);

    try {
      const response = await updateOrdersStatusAPI(token, id, 5);
      console.log(response);
      if (response.data.success == true) {
        navigate("/nhap-va-giao-hang");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };

  const [valueDelivery, setValueDelivery] = useState(0);

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
            <Statistic title="Ngày đặt hàng:" value={formatDate(dateOrder)} />
          </Col>
          <Col>
            <Statistic
              title="Trạng thái"
              valueRender={() => <Tag color="green">{nameStatus}</Tag>}
            />
          </Col>
        </Space>
        <Button
          type="primary"
          onClick={() => {
            if (!isReadyToRender) {
              alert("Dữ liệu đang được chuẩn bị, vui lòng đợi...");
            } else {
              handlePrint();
            }
          }}
          icon={<PrinterOutlined />}
          style={{ float: "right" }}
        >
          In
        </Button>
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
            flex: 4,
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
            flex: 3,
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
              <Text>Chi phí giao hàng:</Text>
              <Text>
                {" "}
                {new Intl.NumberFormat("vi-VN").format(valueDelivery)} đ{" "}
              </Text>
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
              <Text> {new Intl.NumberFormat("vi-VN").format(new1)} đ </Text>
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
          <Row
            style={{
              gap: 20,
            }}
          >
            <Col>
              <Popconfirm
                title="Xác nhận giao hàng không thành công?"
                onConfirm={handleUpdateOrderFail} // Hàm được gọi khi nhấn "Xóa"
                okText="Xác nhận"
                cancelText="Hủy"
                okButtonProps={{ type: "primary", danger: true }} // Nút "Xóa" màu đỏ
                cancelButtonProps={{ type: "default" }} // Nút "Hủy" mặc định
              >
                <Button
                  Outlined
                  color="primary"
                  style={{ fontSize: "14px" }}
                  danger
                >
                  GIAO HÀNG KHÔNG THÀNH CÔNG
                </Button>
              </Popconfirm>
            </Col>

            <Col>
              <Button
                type="primary"
                style={{
                  float: "right",
                  fontSize: "14px",
                }}
                onClick={handleUpdateOrder}
              >
                GIAO HÀNG THÀNH CÔNG
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div id="print-area" style={{ display: "none" }}>
        {isReadyToRender && (
          <Bill
            name={customerName}
            orderId={id}
            data={mainTableData}
            phone={phoneCustomer}
            address={addressCustomer}
            vat={vat}
            discount={promotion}
            deposit={deposit}
            totalAmount={totalAmount}
            remainingAmount={new1}
            order_date={dateOrder}
            order_date1={formatDate(estimatedDate)}
            order_ship={valueDelivery}
            tax_code={taxCode}
            email={email}
            company_name={company_name}
            name1={name1}
            address1={address1}
            phone1={phone1}
          />
        )}
      </div>
    </Content>
  );
}

export default EditImportAndDeliveryGoods;
