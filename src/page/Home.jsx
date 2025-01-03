import { Layout, Table, Tabs, notification } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDataOrdersAPI } from "../apis/handleDataAPI";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
const { Content } = Layout;

function Home() {
  const [dataValue, setDataValue] = useState([]);
  const [searchText, setSearchText] = useState(""); // Lưu trữ nội dung tìm kiếm
  const [currentStatus, setCurrentStatus] = useState("all"); // Lưu trạng thái hiện tại từ Tabs

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await getDataOrdersAPI(token, 1, 1000);
      const orders = res.data.data;

      // Lọc bỏ các đơn hàng có order_status === "6"
      const filteredOrders = orders.filter((item) => item.order_status !== "6");

      // Chuyển đổi dữ liệu để phù hợp với cấu trúc bảng
      const transformedData = filteredOrders.map((item) => ({
        key: item.order_id,
        id: item.order_id,
        revenue: item.total,
        datetime: item.order_date,
        actprocessing_staffion: item.processing_employee,
        file_processing_design: item.design_confirm_employee,
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

  const filterData = () => {
    // Kết hợp tìm kiếm và lọc theo trạng thái
    let filteredData = dataValue;

    // Lọc theo trạng thái (nếu không phải "all")
    if (currentStatus !== "all") {
      filteredData = filteredData.filter(
        (item) => item.status === currentStatus
      );
    }

    // Lọc theo chuỗi tìm kiếm (nếu có nội dung tìm kiếm)
    if (searchText.trim() !== "") {
      filteredData = filteredData.filter((item) =>
        item.id.toString().includes(searchText.trim())
      );
    }

    return filteredData;
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
    { title: "Thời gian", dataIndex: "datetime", key: "datetime" },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status) => <span style={getStatusStyle(status)}>{status}</span>,
    },
    {
      title: "Nhân viên xử lý",
      dataIndex: "actprocessing_staffion",
      key: "actprocessing_staffion",
    },
    {
      title: "Thiết kế xử lý file",
      dataIndex: "file_processing_design",
      key: "file_processing_design",
    },
    {
      title: "Hóa đơn VAT",
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
  ];

  const tabs = [
    { key: "all", label: "Tất cả đơn hàng" },
    { key: "Đang báo giá", label: "Đang báo giá" },
    { key: "Đang in", label: "Đang in" },
    { key: "Đã hoàn thành", label: "Đã hoàn thành" },
    { key: "Trả hàng", label: "Trả hàng" },
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

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: "#fff",
        borderRadius: "8px",
      }}
    >
      {contextHolder}

      <Input
        placeholder="Nhập mã đơn hàng để tìm kiếm..."
        onChange={(e) => handleSearch(e.target.value)} // Gọi handleSearch khi người dùng nhập
        style={{
          marginBottom: 16,
        }}
        prefix={<SearchOutlined />}
      />
      <Tabs defaultActiveKey="all" items={tabs} onChange={handleTabChange} />
      <Table
        columns={columns}
        dataSource={filterData()} // Lọc dữ liệu trước khi hiển thị
        pagination={{ position: ["bottomCenter"], pageSize: 15 }}
      />
    </Content>
  );
}

export default Home;
