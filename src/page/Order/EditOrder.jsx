import {
  List,
  Modal,
  Upload,
  Layout,
  theme,
  Row,
  Col,
  Button,
  Form,
  Input,
  Typography,
  Table,
  Select,
  Space,
  InputNumber,
  DatePicker,
  Card,
  Statistic,
  Tag,
  Popconfirm,
  Tooltip,
} from "antd";
import moment from "moment";
const { Title, Text } = Typography;
const { Content } = Layout;
import {
  PrinterOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  getAllStaffAPI,
  getDataCustomerIdAPI,
  getDataOrdersByIdAPI,
  getDataProductAPI,
  getDataProductByIdAPI,
  getQuantityProductAPI,
  postDataCustomerAPI,
  postDataPrintAPI,
  updateDataOrdersAPI,
  updateOrdersStatusAPI,
} from "../../apis/handleDataAPI";
import Bill from "../Order/Bill";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function EditOrder() {
  const [note, setNote] = useState("");

  const { id } = useParams();
  const handleImageChange = (info, key) => {
    if (info.file.status === "done") {
      // API trả về URL của ảnh đã upload
      const uploadedImageUrl = info.file.response.url;

      // Cập nhật dữ liệu bảng
      const updatedData = mainTableData.map((item) => {
        if (item.key === key) {
          return { ...item, image: uploadedImageUrl }; // Cập nhật URL hình
        }
        return item;
      });

      setMainTableData(updatedData); // Cập nhật lại bảng
    }
  };
  const handleFileChange = (key, newFileList) => {
    setMainTableData((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              fileList: newFileList, // Cập nhật danh sách ảnh
              image: newFileList.length > 0 ? newFileList[0] || null : null, // Thay đổi ảnh nếu có file mới
            }
          : item
      )
    );
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Hình ảnh phải nhỏ hơn 2MB!");
      return false;
    }
    return true;
  };
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY/MM/DD")
  ); // Lưu giá trị ngày mặc định

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Chọn hình</div>
    </div>
  );
  const [printingHouses, setPrintingHouses] = useState([]);
  const [selectedPrinters, setSelectedPrinters] = useState({});
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [form] = Form.useForm();
  const handleChangeSelectPrint = (value, key) => {
    setSelectedPrinters((prev) => ({
      ...prev,
      [key]: value, // Cập nhật giá trị nhà in cho dòng cụ thể
    }));
  };
  const fetchPrintingHouses = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const response = await postDataPrintAPI(token, 10, 1);

      setPrintingHouses(response.data.data); // Gán dữ liệu từ API vào state
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu nhà in:", error);
    }
  };
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeDesign, setSelectedEmployeeDesign] = useState(null);
  const [addPlusPrice, setAddPlusPrice] = useState();

  //Tính thành tiền
  const calculateTotalPrice = (dataSource) => {
    return dataSource.reduce((total, record) => total + record.totalPrice, 0);
  };
  // Gọi hàm fetch khi component được render lần đầu
  useEffect(() => {
    fetchPrintingHouses();
  }, []);
  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));
  useEffect(() => {
    setCate_id(localStorage.getItem("cate_id"));
  }, []);
  const mainTableColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productDetails",
      key: "productDetails",
      render: (details) => (
        <div>
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
        </div>
      ),
    },
    {
      title: "Hình ảnh",
      dataIndex: "image",
      key: "image",
      render: (image, record) => (
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={record.fileList}
          onChange={({ fileList }) => handleFileChange(record.key, fileList)}
        >
          {record.fileList.length < 1 && (
            <div>
              <div style={{ marginTop: 8 }}>
                {image ? (
                  <img
                    src={
                      "https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/" +
                      image
                    }
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  uploadButton
                )}
              </div>
            </div>
          )}
        </Upload>
      ),
    },
    {
      title: "Đơn vị tính",
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
          defaultValue={quantity}
          onChange={(value) =>
            updateProductData(record.key, "quantity", value, record)
          }
          style={{ width: 60 }}
        />
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (price, record) => (
        <Tooltip title={cate_id !== "3" ? "Bạn không có quyền chỉnh sửa" : ""}>
          <Input
            value={price}
            prefix="đ"
            onChange={(e) =>
              updateProductData(
                record.key,
                "unitPrice",
                Number(e.target.value),
                record
              )
            }
            onInput={(e) =>
              updateProductData(
                record.key,
                "unitPrice",
                Number(e.target.value),
                record
              )
            }
            style={{ width: 80 }}
            disabled={cate_id === "1"}
          />
        </Tooltip>
      ),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      render: (total) => (
        <Text strong> {new Intl.NumberFormat("vi-VN").format(total)} đ</Text>
      ),
    },
    {
      title: "",
      key: "action",
      render: (_, record) => (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          danger
          onClick={() => deleteProduct(record.key)}
        />
      ),
    },
  ];

  const deleteProduct = (key) => {
    const updatedData = mainTableData.filter((item) => item.key !== key);
    setMainTableData(updatedData);
  };

  const addProductToTable = (product) => {
    // Tìm số lượng và giá tối thiểu
    const minQuantity =
      product.pricing && product.pricing.length > 0
        ? Math.min(...product.pricing.map((p) => parseInt(p.quantity, 10)))
        : 1;
    const minPrice =
      product.pricing && product.pricing.length > 0
        ? product.pricing.find((p) => parseInt(p.quantity, 10) === minQuantity)
            ?.price
        : 0;
    const minPlusPrice =
      product.pricing && product.pricing.length > 0
        ? product.pricing.find((p) => parseInt(p.quantity, 10) === minQuantity)
            ?.plusPrice || 0
        : 0;

    // Kiểm tra nếu sản phẩm có định giá đơn lẻ
    const multiple_pricing = product.multiple_pricing === "0";

    // Định dạng sản phẩm để thêm vào bảng
    const formattedProduct = {
      ...product,
      key: product.key,
      productDetails: {
        name: product.product_name,
        notes: product.notes,
      },
      unit: product.rules,
      quantity: multiple_pricing ? 1 : minQuantity, // Số lượng mặc định
      unitPrice: multiple_pricing ? product.price : minPrice, // Giá mặc định
      plusPrice: multiple_pricing
        ? parseFloat(product.plusPrice)
        : minPlusPrice, // Giá cộng thêm
      totalPrice: multiple_pricing
        ? 1 * parseFloat(product.price) + parseFloat(product.plusPrice)
        : parseFloat(minPrice) * parseFloat(minQuantity) +
          parseFloat(minPlusPrice), // Tính toán tổng giá
      printer: product.category_name, // Loại in
      date: null, // Ngày giao mặc định
      fileList: [],
    };

    // Kiểm tra nếu sản phẩm đã tồn tại
    if (!mainTableData.find((item) => item.key === product.key)) {
      // Thêm sản phẩm mới nếu chưa tồn tại
      setMainTableData([...mainTableData, formattedProduct]);
    }

    setIsModalVisible(false);
    setSearchName("");
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomer] = useState(null);
  const token = localStorage.getItem("authToken");
  const [nameCustomer, setNameCustomer] = useState("");
  const [idCustomer, setIdCustomer] = useState("");
  const [companyCustomer, setCompanyCustomer] = useState("");
  const [taxcodeCustomer, setTaxcodeCustomer] = useState("");
  const [phoneCustomer, setPhoneCustomer] = useState("");
  const [addressCustomer, setAddressCustomer] = useState("");
  const [name1, setName1] = useState("");
  const [address1, setAddress1] = useState("");
  const [phone1, setPhone1] = useState("");
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const [order, setOrder] = useState({
    id: "",
    date: moment().format("YYYY/MM/DD"), // Ngày mặc định là hôm nay
    customerName: "",
    phone: "",
    address: "",
    notes: "Không có ghi chú.",
  });
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
  const handleChange = (key, value) => {
    setOrder((prev) => ({ ...prev, [key]: value }));
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const handleData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await postDataCustomerAPI(token);
        const data = response.data.data;
        setCustomer(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching the form. Please try again.");
      }
    };
    handleData();
  }, []);
  const [mainTableData, setMainTableData] = useState([]);
  // State cho modal

  const fetchData = async () => {
    try {
      const response = await getAllStaffAPI(token);
      const transformedOptions = response.data.data.map((item) => ({
        value: item.id, // Giá trị dùng cho value
        label: item.username, // Giá trị dùng cho label
      }));
      setOptions(transformedOptions); // Lưu vào state
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);
  const formatTableData = (dataSource) => {
    return dataSource.map((row) => ({
      product_code: row.key,
      quantity: row.quantity,
      price: row.unitPrice,
      plus_price: row.plusPrice || 0, // Lấy giá cộng thêm từ từng sản phẩm
      avatar: row.image,
    }));
  };

  const [taxCode, setTaxCode] = useState();
  const [email, setEmail] = useState();
  const [company_name, setCompany_name] = useState();

  const handleSelectCustomer = (customer) => {
    console.log(customer);
    setSelectedCustomer(customer);
    setNameCustomer(customer.customer_name);
    setIdCustomer(customer.id);
    setCompanyCustomer(customer.company_name);
    setTaxcodeCustomer(customer.tax_code);
    setPhoneCustomer(customer.phone);
    setNote(customer.note);
    setTaxCode(customer.tax_code);
    setEmail(customer.company_email);
    setCompany_name(customer.company_name);

    setAddressCustomer(
      customer.address +
        " " +
        customer.ward +
        " " +
        customer.district +
        " " +
        customer.city
    );
    setIsModalVisible(false);
  };

  const handleSubmitAdd = async () => {
    let formData = form.getFieldsValue(); // Lấy dữ liệu từ form
    const formattedData = formatTableData(mainTableData);

    formData = {
      ...formData,
      customer_id: idCustomer,
      order_status: 2,
      session_token: token,
      processing_employee_id: selectedEmployee,
      design_confirm_employee_id: selectedEmployeeDesign,
      estimated_delivery_date: selectedDate,
      product_details: formattedData,
      total: remainingAmount,
      vat: vat,
      deposit: deposit,
      promotion: discount,
      order_id: id,
    }; // Thêm idCustomer vào formData

    try {
      const response = await updateDataOrdersAPI(formData);
      if (response.data.success == true) {
        navigate("/don-hang");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };
  const handleSubmitEdit = async () => {
    let formData = form.getFieldsValue(); // Lấy dữ liệu từ form
    const formattedData = formatTableData(mainTableData);
    console.log(selectedDat1);
    formData = {
      ...formData,
      customer_id: idCustomer,
      order_status: 1,
      session_token: token,
      processing_employee_id: selectedEmployee,
      design_confirm_employee_id: selectedEmployeeDesign,
      estimated_delivery_date: selectedDat1.format("YYYY-MM-DD"),
      product_details: formattedData,
      total: remainingAmount,
      vat: vat,
      deposit: deposit,
      promotion: discount,
      order_id: id,
    }; // Thêm idCustomer vào formData

    try {
      const response = await updateDataOrdersAPI(formData);
      if (response.data.success == true) {
        navigate("/don-hang");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };

  useEffect(() => {
    getDataProduct();
  }, []);
  const [products, setProducts] = useState([]);
  const getDataProduct = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await getDataProductAPI(token);
      const transformedData = response.data.products.map((item) => ({
        key: item.id,
        product_name: item.product_name,
        category_name: item.category_name,
        multiple_pricing: item.multiple_pricing,
        price: item.price,
        plusPrice: item.plusPrice,
        pricing: item.pricing,
        rules: item.rules,
        notes: item.notes,
      }));
      setProducts(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the data. Please try again.");
    }
  };

  const [searchName, setSearchName] = useState("");

  // Lọc sản phẩm dựa trên tên
  const filteredProducts = products.filter((product) =>
    product.product_name.toLowerCase().includes(searchName.toLowerCase())
  );
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date)) return "Ngày không hợp lệ";
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  const [discount, setDiscount] = useState(0); // Khuyến mãi
  const [vat, setVAT] = useState(0); // VAT (%)
  const [deposit, setDeposit] = useState(0); // Đặt cọc

  const totalProductPrice = calculateTotalPrice(mainTableData); // Tổng tiền hàng
  const vatAmount = (totalProductPrice * vat) / 100; // Tiền VAT
  const totalAmount = totalProductPrice - discount + vatAmount; // Tổng cộng
  const remainingAmount = totalAmount - deposit; // Còn lại
  const [selectedDat1, setSelectedDate1] = useState(
    moment("2024-11-30", "YYYY-MM-DD")
  );
  const [order_id, setOrder_id] = useState();
  const [dateOrder, setDateOrder] = useState();
  const [customerId, setCustomerId] = useState("");
  const [dataProducts, setDataProducts] = useState("");
  const handleDateChange1 = (date) => {
    if (date) {
      setSelectedDate1(date); // Gán ngày mới nếu có giá trị
    } else {
      setSelectedDate1(null); // Xóa giá trị ngày nếu người dùng xóa
    }
  };

  const [orderStatus, setOrderStatus] = useState("");
  useEffect(() => {
    const fetchDataOrderById = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataOrdersByIdAPI(token, id);
        console.log(response);
        const data = response.data.order;

        if (!data) {
          console.error("No order data found.");
          return;
        }

        // Cập nhật form với dữ liệu đơn hàng
        form.setFieldsValue({
          recipient_name: data.recipient_name || "",
          recipient_phone: data.recipient_phone || "",
          delivery_address: data.delivery_address || "",
          notes: data.notes || "",
        });

        // Cập nhật các state khác
        setVAT(data.vat);
        setDiscount(data.promotion);
        setDeposit(data.deposit);
        setCustomerId(data.customer_id);
        setSelectedEmployee(data.processing_employee_id);
        setSelectedEmployeeDesign(data.design_confirm_employee_id);
        setOrder_id(data.order_id);
        setDateOrder(data.order_date);
        setOrderStatus(data.order_status);
        setSelectedDate1(moment(data.estimated_delivery_date, "YYYY-MM-DD"));
        setName1(data.recipient_name);
        setAddress1(data.delivery_address);
        setPhone1(data.recipient_phone);

        // Kiểm tra và xử lý dữ liệu sản phẩm
        const productDetails = JSON.parse(data.product_details || "[]");

        if (!Array.isArray(productDetails)) {
          console.error("Invalid product details format.");
          return;
        }
        setDataProducts(productDetails);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    fetchDataOrderById();
  }, [id, form]);
  useEffect(() => {
    if (dataProducts.length > 0) {
      const fetchProductDetails = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const formattedData = await Promise.all(
            dataProducts.map(async (product, index) => {
              const response = await getDataProductByIdAPI(
                token,
                product.product_code
              );
              const productData = response.data.product;
              return {
                key: productData.id,
                productDetails: {
                  name: productData.product_name || "",
                  notes: productData.notes || "",
                },
                image: product.avatar,
                unit: productData.rules || "",
                quantity: product.quantity || 1,
                unitPrice: product.price || 0,
                totalPrice:
                  (product.quantity || 0) * (product.price || 0) +
                  parseFloat(product.plus_price || 0),
                multiple_pricing: productData.multiple_pricing,
                plusPrice: product.plus_price,
                fileList: product.avatar
                  ? [
                      {
                        uid: "-1",
                        name: "image.png",
                        url:
                          "https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/" +
                          product.avatar,
                      },
                    ]
                  : [], // Nếu có ảnh ban đầu, khởi tạo fileList
              };
            })
          );
          setMainTableData(formattedData);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchProductDetails();
    }
  }, [dataProducts]);

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return; // Không thực hiện nếu customerId chưa được gán
      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataCustomerIdAPI(token, customerId);
        handleSelectCustomer(response.data.data);
        //setCustomerName(response.data.data.customer_name); // Giả sử API trả về customer_name
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Failed to fetch data. Please try again.");
      }
    };
    fetchData();
  }, [customerId]); // Thêm customerId vào danh sách phụ thuộc

  const handleReturnOrder = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await updateOrdersStatusAPI(token, id, 4);
      if (response.data.success == true) {
        navigate("/don-hang");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };
  const handleDeleteOrder = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await updateOrdersStatusAPI(token, id, 6);
      if (response.data.success == true) {
        navigate("/don-hang");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };
  const updateProductData = (key, field, value, product) => {
    const updatedData = mainTableData.map((item) => {
      if (item.key === key) {
        const updatedItem = {
          ...item,
          [field]: value,
        };

        if (field === "quantity") {
          if (product.multiple_pricing === "1") {
            getQuantityProductAPI(token, value, product.key)
              .then((response) => {
                const data = response.data.products;
                const newUnitPrice = data[0]?.price || 0;

                const minQuantity =
                  product.pricing && product.pricing.length > 0
                    ? Math.min(
                        ...product.pricing.map((p) => parseInt(p.quantity, 10))
                      )
                    : 1;
                const minPlusPrice = data[0].plusPrice;

                setAddPlusPrice(minPlusPrice);

                const newTotalPrice =
                  parseFloat(newUnitPrice) * parseFloat(value || minQuantity) +
                  parseFloat(minPlusPrice);

                setMainTableData((prevData) =>
                  prevData.map((itm) =>
                    itm.key === key
                      ? {
                          ...itm,
                          unitPrice: newUnitPrice,
                          quantity: value,
                          totalPrice: newTotalPrice,
                          plusPrice: minPlusPrice,
                        }
                      : itm
                  )
                );
              })
              .catch((error) => console.error("Error fetching data:", error));
          } else if (product.multiple_pricing === "0") {
            const plusPrice = parseFloat(product.plusPrice) || 0;
            const unitPrice = item.unitPrice || 0;
            const totalPrice = (value || 1) * unitPrice + plusPrice;

            return {
              ...updatedItem,
              quantity: value,
              plusPrice,
              totalPrice,
            };
          }
        }

        return updatedItem;
      }
      return item;
    });

    setMainTableData(updatedData);
  };
  const [nameStatus, setNameStatus] = useState("");
  useEffect(() => {
    switch (orderStatus) {
      case "1":
        setNameStatus("Đang báo giá");
        break;
      case "2":
        setNameStatus("Đang in");
        break;
      case "7":
        setNameStatus("Đang giao");
        break;
      case "5":
        setNameStatus("Giao hàng thất bại");
        break;
      case "3":
        setNameStatus("Đã hoàn thành");
        break;
      case "4":
        setNameStatus("Đã trả hàng");
        break;
    }
  }, [orderStatus]);
  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        minHeight: 280,
        borderRadius: borderRadiusLG,
      }}
    >
      <Form form={form} layout="vertical" autoComplete="off">
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
              <Statistic
                title="Mã phiếu đặt hàng:"
                value={order_id}
                valueStyle={{ color: "#000", fontWeight: "bold" }}
              />
            </Col>

            <Col
              style={{
                borderRight: "1px solid",
                marginRight: 16,
                paddingRight: 16,
                fontWeight: "bold",
              }}
            >
              <Statistic
                title="Ngày đặt hàng:"
                value={formatDate(dateOrder)}
                valueStyle={{ color: "#000", fontWeight: "bold" }}
              />
            </Col>

            <Col>
              <Statistic
                style={{
                  fontWeight: "bold",
                }}
                title="Trạng thái"
                valueRender={() => <Tag color="green">{nameStatus}</Tag>}
                valueStyle={{ color: "#000", fontWeight: "bold" }}
              />
            </Col>
          </Space>

          <Space style={{ float: "right" }}>
            <Popconfirm
              title="Bạn có muốn xóa đơn hàng này không?"
              onConfirm={handleDeleteOrder} // Hàm được gọi khi nhấn "Xóa"
              okText="Có"
              cancelText="Hủy"
              okButtonProps={{ type: "primary", danger: true }} // Nút "Xóa" màu đỏ
              cancelButtonProps={{ type: "default" }} // Nút "Hủy" mặc định
            >
              <Button
                style={{
                  marginRight: "1rem",
                  backgroundColor: "red",
                }}
                type="primary"
              >
                Xóa
              </Button>
            </Popconfirm>

            <Button
              type="primary"
              onClick={handlePrint}
              icon={<PrinterOutlined />}
            >
              In
            </Button>
          </Space>
        </div>
        <Row
          style={{
            justifyContent: "space-between",
          }}
        >
          <Row
            style={{
              flexDirection: "column",
              gap: 16,
            }}
          >
            <Col
              style={{
                padding: "1rem",
                borderRadius: "10px",
                flex: 2,
                marginRight: 20,
                maxHeight: 250,
                background: colorBgContainer,
                width: 600,
              }}
            >
              <Title
                style={{ margin: 0, marginBottom: 16, fontWeight: "bold" }}
                level={4}
              >
                Thông tin khách hàng
              </Title>

              {!selectedCustomer ? (
                <Button
                  style={{ color: "black" }}
                  type="link"
                  onClick={showModal}
                  id="modal-container"
                >
                  Chọn khách hàng
                </Button>
              ) : (
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Title
                    style={{
                      marginTop: 0,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    level={4}
                  >
                    {nameCustomer}
                    <Button style={{ color: "black" }} onClick={showModal}>
                      Chọn lại khách hàng
                    </Button>
                  </Title>

                  <Text>Công ty: {companyCustomer}</Text>
                  <div style={{ display: "flex" }}>
                    <Text>Mã số thuế: {taxcodeCustomer}</Text>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Text>Số điện thoại: {phoneCustomer}</Text>
                  </div>
                  <div style={{ display: "flex" }}>
                    <Text>Địa chỉ: {addressCustomer}</Text>
                  </div>
                </Space>
              )}

              <Modal
                title="Chọn khách hàng"
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                mask={false}
                getContainer={() => document.querySelector("#modal-container")}
              >
                <Input
                  placeholder="Nhập số điện thoại để tìm khách hàng"
                  prefix={<SearchOutlined />}
                  style={{ marginBottom: 16 }}
                />
                <List
                  itemLayout="horizontal"
                  dataSource={customers}
                  style={{
                    cursor: "pointer",
                  }}
                  renderItem={(customer) => (
                    <List.Item onClick={() => handleSelectCustomer(customer)}>
                      <List.Item.Meta title={customer.customer_name} />
                      <List.Item.Meta description={customer.phone} />
                    </List.Item>
                  )}
                />
                <Link to="/khach-hang/tao-khach-hang">
                  <Button type="primary" block style={{ marginTop: 16 }}>
                    Tạo khách hàng mới
                  </Button>
                </Link>
              </Modal>
            </Col>
            <Col
              style={{
                padding: "1rem",
                borderRadius: "10px",

                marginRight: 20,
                maxHeight: 250,
                background: colorBgContainer,
                width: 600,
              }}
            >
              <Title style={{ fontWeight: "bold", marginTop: 0 }} level={4}>
                Ghi chú về khách hàng
              </Title>

              <Space direction="vertical">
                <ul>
                  <li>{note}</li>
                </ul>
              </Space>
            </Col>
          </Row>

          <Row
            style={{
              gap: 16,
            }}
          >
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
                Thông tin người nhận
              </Title>

              <Space direction="vertical" style={{ width: "100%" }}>
                <Form.Item name="recipient_name">
                  <Input placeholder="Tên người nhận" />
                </Form.Item>
                <Form.Item name="recipient_phone">
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item name="delivery_address">
                  <Input.TextArea rows={3} placeholder="Địa chỉ nhận hàng" />
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </Row>

        <Card
          style={{
            margin: "20px auto",
            padding: "4px",
            borderRadius: 10,
          }}
        >
          <Row
            style={{
              background: colorBgContainer,
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Title
              style={{ margin: 0, marginBottom: 4, fontWeight: "bold" }}
              level={4}
            >
              Sản phẩm
            </Title>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                style={{
                  position: "relative",
                }}
              >
                <Input
                  style={{
                    width: "100%",
                    marginBottom: 8,
                  }}
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  addonBefore={<SearchOutlined />}
                  placeholder="Tìm kiếm sản phẩm"
                />
                {searchName && filteredProducts.length > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      right: 0,
                      backgroundColor: "white",
                      border: "1px solid #d9d9d9",
                      borderRadius: "4px",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      zIndex: 1000,
                    }}
                  >
                    <Table
                      columns={[
                        {
                          title: "Tên sản phẩm",
                          dataIndex: "product_name",
                          key: "product_name",
                        },
                        {
                          title: "Nhóm sản phẩm",
                          dataIndex: "category_name",
                          key: "category_name",
                        },
                        {
                          title: "Thao tác",
                          key: "actions",
                          render: (text, record) => (
                            <Button
                              type="primary"
                              onClick={() => addProductToTable(record)}
                            >
                              Thêm
                            </Button>
                          ),
                        },
                      ]}
                      dataSource={filteredProducts}
                      pagination={false}
                      rowKey="key"
                      style={{
                        maxHeight: "400px",
                        overflowY: "auto",
                      }}
                    />
                  </div>
                )}
              </div>
            </Col>
          </Row>

          {/* Bảng chính */}
          <Table
            columns={mainTableColumns}
            dataSource={mainTableData}
            pagination={false}
            rowKey="key"
            style={{ marginTop: 16 }}
          />
        </Card>

        <Row>
          <Col
            style={{
              padding: "1rem",
              borderRadius: "10px",
              flex: 2,
              marginRight: 20,
              maxHeight: 350,
              background: colorBgContainer,
            }}
          >
            <Title
              style={{ margin: 0, marginBottom: 16, fontWeight: "bold" }}
              level={4}
            >
              Thông tin thêm
            </Title>

            <Row>
              <Col>
                <Typography
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Nhân viên xử lý
                </Typography>

                <Space>
                  <Select
                    defaultValue="Chọn nhân viên xử lý"
                    style={{ width: "650px" }}
                    value={selectedEmployee}
                    options={options} // Truyền options từ state
                    onChange={(value) => setSelectedEmployee(value)}
                  />
                </Space>
              </Col>
            </Row>
            <Row>
              <Col>
                <Typography
                  style={{
                    fontWeight: "bold",
                    marginBottom: "8px",
                  }}
                >
                  Thiết kế xác nhận
                </Typography>
                <Space>
                  <Select
                    defaultValue="Chọn thiết kế xác nhận"
                    style={{ width: "650px" }}
                    value={selectedEmployeeDesign}
                    options={options} // Truyền options từ state
                    onChange={(value) => setSelectedEmployeeDesign(value)}
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
                  <DatePicker
                    format="YYYY/MM/DD"
                    value={selectedDat1}
                    style={{ width: "650px" }}
                    onChange={handleDateChange1} // Xử lý sự kiện khi chọn ngày
                    allowClear
                  />
                </Space>
              </Col>
            </Row>
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
                <Text strong>{totalProductPrice.toLocaleString()} đ</Text>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Khuyến mãi:</Text>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  style={{ width: "150px", textAlign: "right" }}
                  suffix="đ"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>VAT (%):</Text>
                <Input
                  type="number"
                  value={vat}
                  onChange={(e) => setVAT(Number(e.target.value))}
                  style={{ width: "150px", textAlign: "right" }}
                  suffix="%"
                />
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text strong>Tổng cộng:</Text>
                <Text strong>{totalAmount.toLocaleString()} đ</Text>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <Text>Đặt cọc:</Text>
                <Input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  style={{ width: "150px", textAlign: "right" }}
                  suffix="đ"
                />
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                }}
              >
                <Text>Còn lại:</Text>
                <Text>{remainingAmount.toLocaleString()} đ</Text>
              </div>
            </Space>

            <Form.Item name="notes">
              <Input.TextArea placeholder="Nhập ghi chú" rows={3} />
            </Form.Item>
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
                  style={{ fontSize: "12px" }}
                >
                  CẬP NHẬT ĐƠN HÀNG
                </Button>
              </Col>

              <Col>
                <Button
                  type="primary"
                  onClick={handleSubmitAdd}
                  style={{ fontSize: "12px" }}
                >
                  ĐẶT HÀNG NHÀ CUNG CẤP
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <Popconfirm
          title="Bạn có muốn xóa đơn hàng không?"
          onConfirm={handleDeleteOrder} // Hàm được gọi khi nhấn "Xóa"
          okText="Có"
          cancelText="Hủy"
          okButtonProps={{ type: "primary", danger: true }} // Nút "Xóa" màu đỏ
          cancelButtonProps={{ type: "default" }} // Nút "Hủy" mặc định
        >
          <Button
            color="danger"
            variant="solid"
            Solid
            style={{
              marginBottom: "1rem",
            }}
          >
            Xóa phiếu
          </Button>
        </Popconfirm>

        <Card
          title="Thông tin phiếu đặt hàng"
          style={{ display: "none" }}
          bordered={false}
        >
          <div style={{ marginBottom: "20px" }}>
            <Text strong>Mã phiếu đặt hàng:</Text> <span>{order.id}</span>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Text strong>Ngày nhận hàng:</Text>
            <DatePicker
              defaultValue={moment(order.date, "YYYY/MM/DD")}
              format="YYYY/MM/DD"
              onChange={(date, dateString) => handleChange("date", dateString)}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Input
              placeholder="Tên khách hàng"
              value={order.customerName}
              onChange={(e) => handleChange("customerName", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Input
              placeholder="Số điện thoại"
              value={order.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <Input
              placeholder="Địa chỉ nhận hàng"
              value={order.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>
        </Card>
        <div id="print-area" style={{ display: "none" }}>
          <Bill
            name={nameCustomer}
            orderId={id}
            data={mainTableData}
            phone={phoneCustomer}
            address={addressCustomer}
            vat={vat}
            discount={discount}
            deposit={deposit}
            totalAmount={totalAmount}
            remainingAmount={remainingAmount}
            order_date={dateOrder}
            order_date1={selectedDat1?.format("YYYY-MM-DD")}
            tax_code={taxCode}
            email={email}
            company_name={company_name}
            name1={name1}
            address1={address1}
            phone1={phone1}
          />
        </div>
      </Form>
    </Content>
  );
}

export default EditOrder;
