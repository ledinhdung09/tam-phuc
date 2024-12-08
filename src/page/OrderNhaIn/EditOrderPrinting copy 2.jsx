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
import { PrinterOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom";
import {
  getDataOrdersByIdAPI,
  getDataProductByIdAPI,
  postDataPrintAPI,
  getDataCustomerIdAPI,
  updateOrdersAPI,
  updateOrdersStatusAPI,
} from "../../apis/handleDataAPI";
import { useEffect, useState } from "react";
import moment from "moment";
import dayjs from "dayjs";
import Bill from "../Order/Bill";
const { Title, Text } = Typography;
const { Content } = Layout;

function EditOrderPrinting() {
  const [form] = Form.useForm();

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
  const calculateTotalPrice = (dataSource) => {
    return dataSource.reduce((total, record) => total + record.totalPrice, 0);
  };
  const { id } = useParams();
  const [dataProducts, setDataProducts] = useState([]);
  const [mainTableData, setMainTableData] = useState([]);
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
  const [new2, setNew2] = useState();
  const [new3, setNew3] = useState();
  const [estimatedDate, setEstimatedDate] = useState(""); // Trạng thái lưu ngày dự kiến
  const [customerId, setCustomerId] = useState(); // Trạng thái lưu ngày dự kiến
  const [customerName, setCustomerName] = useState(""); // Trạng thái lưu ngày dự kiến
  const [notes, setNotes] = useState(""); // Trạng thái lưu ngày dự kiến
  const [valueDelivery, setValueDelivery] = useState(0);
  const [pricePrints, setPricePrints] = useState({});
  const [quantityPrints, setQuantityPrints] = useState({});
  const [phoneCustomer, setPhoneCustomer] = useState("");
  const [addressCustomer, setAddressCustomer] = useState("");

  useEffect(() => {
    setNew1(parseFloat(remainingAmount) + parseFloat(valueDelivery));
  }, [remainingAmount, valueDelivery]);

  useEffect(() => {
    // Fetch order data when `id` changes
    const fetchDataOrderById = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataOrdersByIdAPI(token, id);
        console.log(response);
        const products = JSON.parse(response.data.order.product_details);
        setOrder_id(response.data.order.order_id);
        setDateOrder(response.data.order.order_date);
        setVAT(response.data.order.vat);
        setDeposit(response.data.order.deposit);
        setPromotion(response.data.order.promotion);
        setDataProducts(products);
        setNew3(response.data.order.total);
        setNew2(response.data.order.total);
        setValueDelivery(response.data.order.price_ship);
        setCustomerId(response.data.order.customer_id);
        setNotes(response.data.order.notes);
        const estimatedDateString = response.data.order.estimated_delivery_date;
        setEstimatedDate(moment(estimatedDateString));
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    if (id) {
      fetchDataOrderById();
    }
  }, [id]);

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
  };

  useEffect(() => {
    // Fetch customer data when `customerId` changes
    console.log(customerId);
    const fetchData = async () => {
      if (!customerId) return;

      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataCustomerIdAPI(token, customerId);
        console.log(response);
        setPhoneCustomer(response.data.data.phone);
        handleSelectCustomer(response.data.data);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        alert("Failed to fetch customer data. Please try again.");
      }
    };

    if (customerId) {
      fetchData();
    }
  }, [customerId]);

  useEffect(() => {
    // Fetch product details when `dataProducts` changes
    const fetchProductDetails = async () => {
      if (dataProducts.length === 0) return;

      try {
        const token = localStorage.getItem("authToken");
        const details = await Promise.all(
          dataProducts.map(async (product) => {
            const response = await getDataProductByIdAPI(
              token,
              product.product_code
            );
            const productData = response.data.product;
            const quantity = product.quantity_print || product.quantity;
            const pricePrint = product.price_print || product.price;

            setQuantityPrints((prev) => ({
              ...prev,
              [product.product_code]: quantity,
            }));
            setPricePrints((prev) => ({
              ...prev,
              [product.product_code]: pricePrint,
            }));

            return {
              key: productData.id,
              productDetail: {
                name: productData.product_name,
                notes: productData.notes,
              },
              unit: productData.rules,
              image: product.avatar,
              quantity,
              pricePrint,
              totalPrice:
                quantity * pricePrint + parseFloat(product.plus_price),
            };
          })
        );

        setMainTableData(details);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetails();
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

  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));

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
      render: (quantity, record) => (
        <InputNumber
          min={1}
          value={quantityPrints[record.key] || quantity} // Sử dụng giá trị từ trạng thái
          onChange={(value) => {
            setQuantityPrints((prev) => ({
              ...prev,
              [record.key]: value, // Cập nhật giá trị riêng cho từng hàng
            }));
          }}
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price, record) => {
        const value = pricePrints[record.key] || price; // Lấy giá trị từ pricePrints hoặc dùng giá trị mặc định

        return (
          <Input
            defaultValue={value} // Đảm bảo giá trị là số hoặc chuỗi
            prefix="đ"
            style={{ width: 120 }}
            onChange={(e) => {
              const newValue = e.target.value;

              // Cập nhật giá trị mới
              setPricePrints((prev) => ({
                ...prev,
                [record.key]: newValue,
              }));
              setMainTableData((prev) =>
                prev.map((item) =>
                  item.key === record.key
                    ? {
                        ...item,
                        unitPrice: newValue,
                        totalPrice:
                          item.quantity * newValue +
                          parseFloat(item.plus_price), // Cập nhật thành tiền
                      }
                    : item
                )
              );
            }}
          />
        );
      },
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
            disabled={cate_id === "2"}
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
      render: (_, record) => {
        const dateValue = selectedDates1[record.key] || record.date;
        return (
          <DatePicker
            style={{ width: 120 }}
            value={
              dateValue && dayjs(dateValue, "YYYY-MM-DD").isValid()
                ? dayjs(dateValue, "YYYY-MM-DD")
                : null
            }
            onChange={(date) => handleDateChangeProduct(date, record.key)}
          />
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total, record) => {
        return (
          <Text strong>
            {new Intl.NumberFormat("vi-VN").format(record.totalPrice)} đ
          </Text>
        );
      },
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
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : null;
    setSelectedDates1((prev) => ({
      ...prev,
      [recordKey]: formattedDate,
    }));
  };

  // Gọi fetchPrintingHouses khi component được mount
  useEffect(() => {
    fetchPrintingHouses();
  }, []);
  useEffect(() => {
    if (dataProducts.length > 0 && printingHouses.length > 0) {
      const initialPrinters = dataProducts.reduce((acc, product) => {
        if (product.id_print) {
          acc[product.product_code] = product.id_print; // Key là product_code hoặc id sản phẩm
        }
        return acc;
      }, {});
      setSelectedPrinters(initialPrinters);
    }
  }, [dataProducts, printingHouses]);

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
  const [mergedProductDetails, setMergedProductDetails] = useState([]);
  useEffect(() => {
    const formattedData = dataProducts.map((product) => {
      const productCode = product.product_code;
      return {
        ...product,
        id_print: selectedPrinters[productCode] || null,
        date: selectedDates1[productCode]
          ? moment(selectedDates1[productCode], "YYYY-MM-DD").format(
              "DD-MM-YYYY"
            )
          : null,
        quantity_print: quantityPrints[productCode],
        price_print: pricePrints[productCode],
      };
    });

    setMergedProductDetails(formattedData.flat());
  }, [
    selectedPrinters,
    selectedDates1,
    dataProducts,
    pricePrints,
    quantityPrints,
  ]); // Theo dõi các thay đổi
  const handleUpdateOrder = async () => {
    const token = localStorage.getItem("authToken");

    // Tạo đối tượng cuối cùng
    const result = {
      order_id: id, // ID đơn hàng (cố định hoặc lấy từ logic khác)
      session_token: token,
      product_details: mergedProductDetails, // Thêm danh sách sản phẩm đã format
      price_ship: valueDelivery,
      order_status: 7,
      total_print: new1,
      total: new2,
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
  };

  const handleSubmitEdit = async () => {
    const token = localStorage.getItem("authToken");

    // Tạo đối tượng cuối cùng
    const result = {
      order_id: id, // ID đơn hàng (cố định hoặc lấy từ logic khác)
      session_token: token,
      product_details: mergedProductDetails, // Thêm danh sách sản phẩm đã format
      price_ship: valueDelivery,
      total_print: new1,
      order_status: 2,
      total: new2,
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
    //Gửi API hoặc sử dụng kết quả (nếu cần)
  };

  // Hàm xử lý khi người dùng thay đổi giá trị
  const handleChange = (e) => {
    const deliveryCost = parseFloat(e.target.value) || 0; // Lấy chi phí vận chuyển từ input
    setValueDelivery(e.target.value); // Cập nhật giá trị nhập vào
    const updatedRemainingAmount = totalAmount + deliveryCost - deposit; // Tính lại giá trị còn lại
    setNew1(updatedRemainingAmount); // Cập nhật giá trị còn lại
    const total1 = parseFloat(new3) + deliveryCost - valueDelivery;
    setNew2(total1); // Cập nhật giá trị còn lại
  };

  // Hàm xử lý khi người dùng rời khỏi ô input
  const handleBlur = () => {
    setValueDelivery(valueDelivery);
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
          <Button
            type="primary"
            onClick={handlePrint}
            // onClick={() => {
            //   alert("Đang bảo trì");
            // }}
            icon={<PrinterOutlined />}
          >
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Chi phí giao hàng:</Text>
              <Input
                style={{
                  width: "200px",
                  textAlign: "right",
                }}
                value={valueDelivery}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Nhập số tiền"
              ></Input>{" "}
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
              <Button
                Outlined
                color="primary"
                onClick={handleSubmitEdit}
                style={{}}
              >
                LƯU THÔNG TIN
              </Button>
            </Col>

            <Col>
              <Button
                type="primary"
                style={{
                  float: "right",
                }}
                onClick={handleUpdateOrder}
              >
                XÁC NHẬN GIAO HÀNG
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div id="print-area" style={{ display: "none" }}>
        {console.log(phoneCustomer)}
        {customerName &&
          customerName !== "" &&
          id &&
          id !== "" &&
          mainTableData &&
          phoneCustomer &&
          phoneCustomer !== "" &&
          addressCustomer &&
          addressCustomer !== "" && (
            <Bill
              name={customerName}
              orderId={id}
              data={mainTableData}
              phone={phoneCustomer}
              address={addressCustomer}
            />
          )}
      </div>
    </Content>
  );
}

export default EditOrderPrinting;
