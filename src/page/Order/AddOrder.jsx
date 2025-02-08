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
  Tooltip,
  Checkbox,
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
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllCategoryAPI,
  getAllStaffAPI,
  getDataProductAPI,
  getDataProductByCateAPI,
  getDataProductByClasifyAPI,
  getDataStaffIdAPI,
  getQuantityProductAPI,
  postDataCustomerAPI,
  postDataOrdersAPI,
  postDataPrintAPI,
} from "../../apis/handleDataAPI";
import Bill from "./Bill";

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

function AddOrder() {
  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));
  useEffect(() => {
    setCate_id(localStorage.getItem("cate_id"));
  }, []);
  // upload ảnh
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    window.open(file.url || file.preview, "_blank");
  };
  const handleFileChange = (key, newFileList) => {
    setMainTableData((prev) =>
      prev.map((item) =>
        item.key === key
          ? {
              ...item,
              fileList: newFileList,
            }
          : item
      )
    );
  };
  const [note, setNote] = useState("");
  // const handleImageChange = (info, key) => {
  //   if (info.file.status === "done") {
  //     // API trả về URL của ảnh đã upload
  //     const uploadedImageUrl = info.file.response.url;

  //     // Cập nhật dữ liệu bảng
  //     const updatedData = mainTableData.map((item) => {
  //       if (item.key === key) {
  //         return { ...item, image: uploadedImageUrl }; // Cập nhật URL hình
  //       }
  //       return item;
  //     });

  //     setMainTableData(updatedData); // Cập nhật lại bảng
  //   }
  // };
  // const beforeUpload = (file) => {
  //   const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  //   if (!isJpgOrPng) {
  //     message.error("Bạn chỉ có thể tải lên file JPG/PNG!");
  //     return false;
  //   }
  //   const isLt2M = file.size / 1024 / 1024 < 2;
  //   if (!isLt2M) {
  //     message.error("Hình ảnh phải nhỏ hơn 2MB!");
  //     return false;
  //   }
  //   return true;
  // };
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY/MM/DD")
  ); // Lưu giá trị ngày mặc định

  // const uploadButton = (
  //   <div>
  //     <PlusOutlined />
  //     <div style={{ marginTop: 8 }}>Chọn hình</div>
  //   </div>
  // );
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
  const mainTableColumns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "productDetails",
      key: "productDetails",
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
      title: "Upload ảnh",
      key: "upload",
      render: (_, record) => (
        console.log(record),
        (
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={record.fileList}
            onChange={({ fileList }) => handleFileChange(record.key, fileList)}
          >
            {record.fileList.length < 1 && (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
        )
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
    console.log(product);
    setStatusProduct(false);
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
    if (
      !mainTableData.find(
        (item) =>
          item.productDetails.name === product.product_name &&
          item.printer === product.category_name
      )
    ) {
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
  const [options, setOptions] = useState([]);
  const navigate = useNavigate();
  const showModal = () => {
    setIsModalVisible(true);
  };

  const [order, setOrder] = useState({
    id: "#13279xxxx",
    date: moment().format("YYYY/MM/DD"), // Ngày mặc định là hôm nay
    customerName: "",
    phone: "",
    address: "",
    notes: "Không có ghi chú.",
  });

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
        setFilteredCustomers(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching the form. Please try again.");
      }
    };
    handleData();
  }, []);
  const [mainTableData, setMainTableData] = useState([]);
  // State cho modal

  const updateProductData = (key, field, value, product) => {
    console.log(product);
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

  const handleDateChange = (date, dateString) => {
    setSelectedDate(dateString);
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const formatTableData = (dataSource) => {
    console.log(dataSource);
    return dataSource.map((row) => ({
      avatar: row.fileList[0],
      product_code: row.key,
      quantity: row.quantity,
      price: row.unitPrice,
      plus_price: row.plusPrice || 0, // Lấy giá cộng thêm từ từng sản phẩm
    }));
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer);
    setNameCustomer(customer.customer_name);
    setIdCustomer(customer.id);
    setCompanyCustomer(customer.company_name);
    setTaxcodeCustomer(customer.tax_code);
    setPhoneCustomer(customer.phone);
    setNote(customer.note);
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
      isVat: isVat === true ? 1 : 0,
      statusVat: vatStatus === "yes" ? 1 : 0,
    }; // Thêm idCustomer vào formData
    console.log(formData); // Kiểm tra kết quả

    try {
      const response = await postDataOrdersAPI(formData);
      console.log(response);
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

    formData = {
      ...formData,
      customer_id: idCustomer,
      order_status: 1,
      session_token: token,
      processing_employee_id: selectedEmployee,
      design_confirm_employee_id: selectedEmployeeDesign,
      estimated_delivery_date: selectedDate,
      product_details: formattedData,
      total: remainingAmount,
      vat: vat,
      deposit: deposit,
      promotion: discount,
      isVat: isVat === true ? 1 : 0,
      statusVat: vatStatus === "yes" ? 1 : 0,
    }; // Thêm idCustomer vào formData
    console.log(formData); // Kiểm tra kết quả

    try {
      const response = await postDataOrdersAPI(formData);
      console.log(response);
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
    fetchDataCate();
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

  const [discount, setDiscount] = useState(0); // Khuyến mãi
  const [vat, setVAT] = useState(0); // VAT (%)
  const [deposit, setDeposit] = useState(0); // Đặt cọc

  const totalProductPrice = calculateTotalPrice(mainTableData); // Tổng tiền hàng
  const vatAmount = (totalProductPrice * vat) / 100; // Tiền VAT
  const totalAmount = totalProductPrice - discount + vatAmount; // Tổng cộng
  const remainingAmount = totalAmount - deposit; // Còn lại

  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  const [filteredCustomers, setFilteredCustomers] = useState(customers); // Danh sách khách hàng đã lọc
  const handleSearchCustomer = (value) => {
    const searchValue = value.toLowerCase();
    const filtered = customers.filter(
      (customer) =>
        customer.customer_name.toLowerCase().includes(searchValue) || // Tìm theo tên khách hàng
        customer.phone.includes(searchValue) // Tìm theo số điện thoại
    );
    setFilteredCustomers(filtered); // Cập nhật danh sách đã lọc
  };

  // Xử lý khi từ khóa thay đổi
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value); // Cập nhật từ khóa
    handleSearchCustomer(value); // Lọc danh sách
  };

  const [isVat, setIsVat] = useState(false);
  const [vatStatus, setVatStatus] = useState("");
  const handleVAT = () => {
    setIsVat((prev) => !prev);
    setVatStatus("");
  };

  const handleSelectChange = (value) => {
    setVatStatus(value); // Cập nhật giá trị được chọn
    console.log("Selected VAT status:", value); // In ra console
  };

  const [dataCate, setDataCate] = useState([]);
  const [selectedCate, setSelectedCate] = useState(null);
  const [selectedClassify, setSelectedClassify] = useState(null);
  const [idCate, setIdCate] = useState("");
  const [dataClassifyLv2, setDataClassifyLv2] = useState([]);
  const [dataProductByClassify, setDataProductByClassify] = useState([]);
  const [statusProduct, setStatusProduct] = useState(false);

  const fetchDataCate = async () => {
    const res = await getAllCategoryAPI(token);
    console.log(res);
    const formattedData = res.data.data.map((item) => ({
      value: item.id.toString(), // Chuyển id thành chuỗi nếu cần
      label: item.category_name,
    }));
    setDataCate(formattedData);
  };

  const fetchDataProductByCate = async (id) => {
    const res = await getDataProductByCateAPI(token, id);
    console.log(res);

    // Lọc bỏ giá trị null, undefined trước khi tạo Set
    const uniqueClassifyLevel2 = Array.from(
      new Set(
        res.data.products
          .map((item) => item.classifyLevel2)
          .filter(
            (classify) =>
              classify !== null && classify !== undefined && classify !== ""
          )
      )
    ).map((classify) => ({
      value: classify,
      label: classify,
    }));

    setDataClassifyLv2(uniqueClassifyLevel2);
  };

  const fetchDataProductByClassify = async (id, idCate) => {
    const res = await getDataProductByClasifyAPI(token, id, idCate);
    console.log(res);
    const transformedData = res.data.products.map((item) => ({
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
    setDataProductByClassify(transformedData);
  };

  const filteredProducts = dataProductByClassify.filter((product) =>
    product.product_name.toLowerCase().includes(searchName.toLowerCase())
  );

  const onChangeCate = (value) => {
    fetchDataProductByCate(value);
    setStatusProduct(false);
    setIdCate(value);
    setSelectedCate(value);
    setSelectedClassify(null);
    setDataProductByClassify([]);
  };

  const onChangeClassify = (value) => {
    setSelectedClassify(value);
    setStatusProduct(false);
    fetchDataProductByClassify(value, idCate);
  };

  const modalRef = useRef(null);

  const closeModal = () => setStatusProduct(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        closeModal();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                id="model_customer"
                getContainer={() => document.querySelector("#modal-container")}
              >
                <Input
                  placeholder="Nhập số điện thoại để tìm khách hàng"
                  prefix={<SearchOutlined />}
                  style={{ marginBottom: 16 }}
                  value={searchTerm} // Liên kết với trạng thái tìm kiếm
                  onChange={handleInputChange} // Gọi khi có thay đổi
                />
                <List
                  itemLayout="horizontal"
                  dataSource={filteredCustomers}
                  style={{
                    cursor: "pointer",
                    maxHeight: "400px", // Chiều cao tối đa của danh sách
                    overflowY: "auto",
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
                gap: 16,
                marginRight: 20,
                maxHeight: 350,
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
                  <Input
                    style={{
                      width: 220,
                    }}
                    placeholder="Tên người nhận"
                  />
                </Form.Item>
                <Form.Item name="recipient_phone">
                  <Input placeholder="Số điện thoại" />
                </Form.Item>
                <Form.Item name="delivery_address">
                  <Input.TextArea rows={3} placeholder="Địa chỉ nhận hàng" />
                </Form.Item>
              </Space>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Checkbox
                  style={{
                    marginBottom: 10,
                  }}
                  onChange={handleVAT}
                >
                  Hóa đơn VAT
                </Checkbox>
                {isVat && (
                  <Select
                    style={{
                      width: 220,
                    }}
                    defaultValue={"no"}
                    allowClear
                    options={[
                      {
                        value: "no",
                        label: "Chưa xuất VAT",
                      },
                      {
                        value: "yes",
                        label: "Đã xuất VAT",
                      },
                    ]}
                    placeholder="Trạng thái"
                    onChange={handleSelectChange}
                  />
                )}
              </div>
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
                  display: "flex",
                }}
              >
                <Select
                  showSearch
                  placeholder="Chọn hoặc nhập danh mục sản phẩm"
                  optionFilterProp="label"
                  style={{
                    width: "100%",
                  }}
                  value={selectedCate}
                  onChange={onChangeCate}
                  options={dataCate}
                />

                <Select
                  showSearch
                  placeholder="Chọn hoặc nhập phân loại cấp 2"
                  optionFilterProp="label"
                  style={{
                    width: "100%",
                    margin: " 0 10px 8px 10px",
                  }}
                  value={selectedClassify}
                  onChange={onChangeClassify}
                  options={dataClassifyLv2}
                />

                <Input
                  style={{
                    width: "100%",
                    marginBottom: 8,
                  }}
                  value={searchName}
                  onClick={() => setStatusProduct(true)}
                  onChange={(e) => setSearchName(e.target.value)}
                  addonBefore={<SearchOutlined />}
                  placeholder="Tìm kiếm sản phẩm"
                />
                {statusProduct && filteredProducts.length > 0 && (
                  <div
                    ref={modalRef}
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
                    defaultValue={moment()}
                    format="YYYY/MM/DD"
                    style={{ width: "650px" }}
                    onChange={handleDateChange} // Xử lý sự kiện khi chọn ngày
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
                  style={{}}
                >
                  LƯU THÔNG TIN
                </Button>
              </Col>

              <Col>
                <Button type="primary" onClick={handleSubmitAdd} style={{}}>
                  ĐẶT HÀNG NHÀ CUNG CẤP
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Content>
  );
}

export default AddOrder;
