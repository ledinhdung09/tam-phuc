import {
  Button,
  Layout,
  Modal,
  Spin,
  Statistic,
  Table,
  Tabs,
  Typography,
  notification,
} from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  getAllStaffAPI,
  getDataCustomerIdAPI,
  getDataOrdersAPI,
  getDataProductByIdAPI,
} from "../apis/handleDataAPI";
import { SearchOutlined } from "@ant-design/icons";
import { Input, DatePicker, Select } from "antd";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import styled from "styled-components";

const { Content } = Layout;

function Home() {
  const [dataValue, setDataValue] = useState([]);
  const [searchText, setSearchText] = useState(""); // Lưu trữ nội dung tìm kiếm
  const [currentStatus, setCurrentStatus] = useState("all"); // Lưu trạng thái hiện tại từ Tabs
  const [selectedDateRange, setSelectedDateRange] = useState(null); // Lọc theo khoảng ngày
  const [selectedEmployee, setSelectedEmployee] = useState(""); // Lọc theo nhân viên
  const token = localStorage.getItem("authToken");
  const [doanhThu, setDoanhThu] = useState(0);

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "Định dạng ngày không hợp lệ";
    }
  };

  const fetchData = async () => {
    try {
      const res = await getDataOrdersAPI(token, 1, 1000);
      const orders = res.data.data;

      // Lọc bỏ các đơn hàng có order_status === "6"
      const filteredOrders = orders.filter((item) => item.order_status !== "6");
      console.log(filteredOrders);
      // Chuyển đổi dữ liệu để phù hợp với cấu trúc bảng
      const transformedData = filteredOrders.map((item) => ({
        key: item.order_id,
        id: item.order_id,
        revenue: item.total,
        datetime: formatDate(item.order_date),
        datetime1: formatDate(item.estimated_delivery_date),
        processing_staffion: item.processing_employee,
        file_processing_design: item.design_confirm_employee,
        isvat: item.isVat,
        status:
          item.order_status === "1"
            ? "Đang báo giá"
            : item.order_status === "2"
            ? "Đang in"
            : item.order_status === "3"
            ? "Đã hoàn thành"
            : item.order_status === "4"
            ? "Trả hàng"
            : item.order_status === "5"
            ? "Giao hàng thất bại"
            : item.order_status === "7"
            ? "Đang giao"
            : "",
        vat: "Xem hóa đơn",
        status1:
          item.statusVat === "0" && item.isVat == "1"
            ? "Chưa xuất VAT"
            : item.statusVat === "1" && item.isVat == "1"
            ? "Đã xuất VAT"
            : "",
        productDetail: item.product_details,
        tongtienhang:
          (parseInt(item.deposit) +
            parseInt(item.total) +
            parseInt(item.promotion)) /
          (1 + parseInt(item.vat) / 100),
        khuyenmai: item.promotion,
        phivat: item.vat,
        tongcong: parseInt(item.total) + parseInt(item.deposit),
        datcoc: item.deposit,
        conlai: item.total,
        customerId: item.customer_id,
      }));

      // Cập nhật dữ liệu cho bảng
      setDataValue(transformedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // Gọi filterData mỗi khi dữ liệu, trạng thái hoặc các bộ lọc thay đổi
    const filteredData = filterData();
    calculateRevenue(filteredData); // Tính doanh thu dựa trên dữ liệu đã lọc
  }, [
    dataValue,
    currentStatus,
    searchText,
    selectedDateRange,
    selectedEmployee,
  ]);

  const filterData = () => {
    // Kết hợp tìm kiếm và lọc theo trạng thái
    let filteredData = dataValue;

    // Lọc theo trạng thái (nếu không phải "all")
    if (currentStatus !== "all") {
      if (currentStatus === "Hóa đơn VAT") {
        // Lọc dữ liệu với isvat === 1
        filteredData = filteredData.filter((item) => item.isvat == "1");
      } else {
        // Lọc theo trạng thái khác
        filteredData = filteredData.filter(
          (item) => item.status === currentStatus
        );
      }
    }

    // Lọc theo chuỗi tìm kiếm (nếu có nội dung tìm kiếm)
    if (searchText.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        item.id.toString().includes(searchText.trim())
      );
    }

    if (selectedEmployee) {
      filteredData = filteredData.filter(
        (item) => item.processing_staffion === selectedEmployee
      );
    }

    // Lọc theo ngày (nếu khoảng ngày được chọn)
    if (selectedDateRange) {
      const [startDate, endDate] = selectedDateRange.map(
        (date) => new Date(date)
      );
      // Lọc theo nhân viên (nếu nhân viên được chọn)

      filteredData = filteredData.filter((item) => {
        const orderDate = new Date(item.datetime); // Ngày đặt

        // Tách ngày, tháng, năm
        const orderYear = orderDate.getFullYear();
        const orderDay = orderDate.getMonth() + 1;
        const orderMonth = orderDate.getDate();

        const startYear = startDate.getFullYear();
        const startMonth = startDate.getMonth() + 1;
        const startDay = startDate.getDate();

        const endYear = endDate.getFullYear();
        const endDay = endDate.getMonth() + 1;
        const endMonth = endDate.getDate();
        console.log("Ngày hiện tại", orderDay);
        console.log("Tháng hiện tại", orderMonth);
        console.log("Năm hiện tại", orderYear);

        console.log("Ngày bắt đầu", startDay);
        console.log("Tháng bắt đầu", startMonth);
        console.log("Năm bắt đầu", startYear);

        // So sánh ngày, tháng, năm
        const isAfterStart =
          orderYear > startYear ||
          (orderYear === startYear && orderMonth > startMonth) ||
          (orderYear === startYear &&
            orderMonth === startMonth &&
            orderDay >= startDay);
        const isBeforeEnd =
          orderYear < endYear ||
          (orderYear === endYear && orderMonth < endMonth) ||
          (orderYear === endYear &&
            orderMonth === endMonth &&
            orderDay <= endDay);

        return isAfterStart && isBeforeEnd;
      });
    }

    return filteredData;
  };

  const calculateRevenue = (filteredData) => {
    const totalRevenue = filteredData.reduce(
      (sum, item) => sum + Number(item.revenue || 0),
      0
    );
    setDoanhThu(totalRevenue);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "Đã hoàn thành":
        return {
          backgroundColor: "lightgreen",
          color: "black",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "Đang báo giá":
        return {
          backgroundColor: "lightgray",
          color: "black",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "Đang giao":
        return {
          backgroundColor: "peachpuff",
          color: "black",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "Đang in":
        return {
          backgroundColor: "lightgoldenrodyellow",
          color: "black",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      case "Trả hàng":
        return {
          backgroundColor: "lightcoral",
          color: "black",
          padding: "4px 8px",
          borderRadius: "8px",
        };
      default:
        return {
          backgroundColor: "white",
          color: "black",
          padding: "4px 8px",
          borderRadius: "8px",
        };
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (text, record) => {
        return (
          <Link to={`/tong-quan/edit-don-hang/${record.id}`}>#{text}</Link>
        );
      },
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => (
        <div style={{ whiteSpace: "normal" }}>
          {text.split("  ").map((item, index) => (
            <div key={index}>
              {new Intl.NumberFormat("vi-VN").format(item)} đ
            </div>
          ))}
        </div>
      ),
    },
    { title: "Ngày đặt", dataIndex: "datetime", key: "datetime" },
    { title: "Ngày nhận", dataIndex: "datetime1", key: "datetime1" },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status) => <span style={getStatusStyle(status)}>{status}</span>,
    },
    {
      title: "Nhân viên xử lý",
      dataIndex: "processing_staffion",
      key: "processing_staffion",
    },
    {
      title: "Thiết kế xử lý file",
      dataIndex: "file_processing_design",
      key: "file_processing_design",
    },
    {
      title: "Hóa đơn",
      dataIndex: "vat",
      key: "vat",
      render: (text, record) => {
        return (
          <Link
            to={{
              pathname: `/tong-quan/bill`,
            }}
            state={{
              orderId: record.id,
            }}
          >
            {text}
          </Link>
        );
      },
    },
    {
      title: "Trạng thái",
      dataIndex: "status1",
      key: "status1",
      render: (text, record) => {
        const color = record.status1 === "Đã xuất VAT" ? "green" : "red";
        return <Typography style={{ color }}>{text}</Typography>;
      },
    },
  ];

  const tabs = [
    { key: "all", label: "Tất cả đơn hàng" },
    { key: "Đang báo giá", label: "Đang báo giá" },
    { key: "Đang in", label: "Đang in" },
    { key: "Đã hoàn thành", label: "Đã hoàn thành" },
    { key: "Trả hàng", label: "Trả hàng" },
    { key: "Hóa đơn VAT", label: "Hóa đơn VAT" },
  ];

  const handleSearch = (value) => {
    setSearchText(value); // Cập nhật chuỗi tìm kiếm
  };

  const handleTabChange = (key) => {
    setCurrentStatus(key); // Cập nhật trạng thái hiện tại từ Tabs
  };
  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();
  useEffect(() => {
    fetchData();
    if (location.state?.message) {
      api.success({
        message: "Thông báo",
        description: location.state.message,
        showProgress: true,
        pauseOnHover: true,
      });
    }
  }, [location.state]);

  const [dataStaff, setDataStaff] = useState();
  const fetchDataStaff = async () => {
    try {
      const response = await getAllStaffAPI(token);
      setDataStaff(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchDataStaff();
  }, [token]);

  const [loading, setLoading] = useState(false);

  const exportToExcel = async () => {
    setLoading(true); // Bắt đầu hiệu ứng loading
    try {
      const filteredData = filterData();
      console.log(filteredData);

      const fetchProductName = async (productId) => {
        try {
          const response = await getDataProductByIdAPI(token, productId);
          if (response.data.success) {
            return response.data.product.product_name;
          } else {
            console.error("Product not found");
            return "Không tìm thấy sản phẩm";
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          return "Lỗi khi lấy sản phẩm";
        }
      };

      const fetchCustomerInfor = async (customerid) => {
        try {
          const response = await getDataCustomerIdAPI(token, customerid);
          if (response.data.success) {
            return response.data.data;
          } else {
            console.error("Customer not found");
            return "Không tìm thấy khách hàng";
          }
        } catch (error) {
          console.error("Error fetching customer:", error);
          return "Lỗi khi lấy khách hàng";
        }
      };

      const filterColumns = async (data) => {
        const result = [];
        for (const item of data) {
          const products = JSON.parse(item.productDetail);
          const customerInfor = await fetchCustomerInfor(item.customerId);
          console.log(customerInfor);
          for (const product of products) {
            const productName = await fetchProductName(product.product_code);
            result.push({
              "Mã đơn": item.id,
              "Doanh thu": item.revenue,
              "Ngày đặt": item.datetime,
              "Ngày nhận": item.datetime1,
              "Tình trạng": item.status,
              "Nhân viên xử lý": item.processing_staffion,
              "Thiết kế xử lý file": item.file_processing_design,
              "Trạng thái": item.status1,
              "Tên khách hàng": customerInfor.customer_name,
              "Công ty": customerInfor.company_name,
              MST: customerInfor.tax_code,
              SĐT: customerInfor.phone,
              "Địa chỉ": `${
                customerInfor.address +
                " " +
                customerInfor.ward +
                " " +
                customerInfor.district +
                " " +
                customerInfor.city
              }`,
              "Tên sản phẩm": productName,
              "Số lượng": product.quantity,
              Giá: product.price,
              "Tổng tiền hàng": item.tongtienhang,
              "Khuyến mãi": item.khuyenmai,
              "VAT (%)": item.phivat,
              "Tổng cộng": item.tongcong,
              "Đặt cọc": item.datcoc,
              "Còn lại": item.conlai,
            });
          }
        }
        return result;
      };

      const filteredData1 = await filterColumns(filteredData);
      const worksheet = XLSX.utils.json_to_sheet(filteredData1);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
      const excelBuffer = XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });
      const blob = new Blob([excelBuffer], {
        type: "application/octet-stream",
      });
      saveAs(blob, "ExportedData.xlsx");
    } catch (error) {
      console.error("Error exporting to Excel:", error);
    } finally {
      setLoading(false); // Kết thúc hiệu ứng loading
    }
  };
  const CustomModal = styled(Modal)`
    .ant-modal-content {
      background-color: transparent; /* Màu nền */
      box-shadow: none; /* Bóng đổ */
    }
  `;

  return (
    <Content
      style={{
        margin: "20px 16px",
        padding: 24,
        background: "#fff",
        borderRadius: "8px",
        height: "100%",
        overflowY: "auto",
      }}
    >
      {contextHolder}

      <div style={{ position: "relative" }}>
        <CustomModal
          className="custom-modal"
          open={loading} // Hiển thị modal khi loading là true
          footer={null} // Không hiển thị nút đóng
          closable={false} // Không cho phép đóng modal
          centered // Căn giữa màn hình
          bodyStyle={{
            textAlign: "center",
            background: "transparent", // Làm trong suốt phần nội dung
            boxShadow: "none",
            border: "none", // Xóa đường viền (nếu có)
            padding: "20px",
          }}
        >
          <Spin tip="Đang tạo file Excel..." size="large" />
        </CustomModal>

        <Button
          type="primary"
          style={{
            position: "absolute",
            right: 0,
            top: "-10%",
            zIndex: 999,
            background: "green",
          }}
          onClick={exportToExcel}
          disabled={loading}
        >
          Xuất Excel
        </Button>
        <Tabs defaultActiveKey="all" items={tabs} onChange={handleTabChange} />
      </div>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16 }}>
        <div>
          <Typography style={{ fontWeight: "bold" }}>Tìm kiếm</Typography>
          <Input
            placeholder="Nhập mã đơn hàng để tìm kiếm..."
            onChange={(e) => handleSearch(e.target.value)} // Gọi handleSearch khi người dùng nhập
            style={{
              width: 300,
            }}
            prefix={<SearchOutlined />}
          />
        </div>

        {/* Lọc theo nhân viên */}
        <div style={{ width: "250px", margin: "0 20px" }}>
          <Typography style={{ fontWeight: "bold" }}>
            Nhân viên kinh doanh
          </Typography>
          <Select
            placeholder="Chọn nhân viên"
            onChange={(value) => setSelectedEmployee(value)}
            style={{ width: "250px" }}
          >
            {/* Thêm danh sách nhân viên */}
            <Select.Option value="">Tất cả</Select.Option>
            {dataStaff && dataStaff.length > 0 ? (
              dataStaff.map((item) => (
                <Select.Option key={item.username} value={item.username}>
                  {item.username}
                </Select.Option>
              ))
            ) : (
              <Select.Option disabled>Không có nhân viên</Select.Option>
            )}
          </Select>
        </div>

        {/* Lọc theo khoảng ngày */}
        <div>
          <div
            style={{
              position: "relative",
            }}
          >
            <Typography style={{ fontWeight: "bold" }}>Từ ngày:</Typography>
            <Typography
              style={{
                position: "absolute",
                top: "0",
                right: "50%",
                transform: "translate(100%, 0)",
                fontWeight: "bold",
              }}
            >
              Đến ngày:
            </Typography>
          </div>
          <DatePicker.RangePicker
            onChange={(dates) => setSelectedDateRange(dates)}
            format="DD/MM/YYYY"
            style={{ width: "350px", height: "32px" }}
          />
        </div>
        <div>
          <div>
            <Typography style={{ visibility: "hidden" }}>
              Nhân viên kinh doanh
            </Typography>
          </div>
          <Statistic
            style={{
              display: "flex",
              alignItems: "center",
              marginLeft: "20px",
            }}
            title="Tổng doanh số:"
            value={doanhThu}
            suffix=" đ"
            valueStyle={{
              color: "#000",
              fontWeight: "bold",
              marginLeft: "20px",
            }}
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filterData()} // Lọc dữ liệu trước khi hiển thị
        pagination={{ position: ["bottomCenter"], pageSize: 15 }}
      />
    </Content>
  );
}

export default Home;
