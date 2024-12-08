import { Layout, Table, Tabs, notification, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDataOrdersAPI } from "../apis/handleDataAPI";

const { Content } = Layout;

function Home() {
  const [dataValue, setDataValue] = useState([]);

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

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [activeKey, setActiveKey] = useState("1"); // State để lưu key của tab đang hoạt động

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

  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "id" },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => (
        <div style={{ whiteSpace: "normal" }}>
          {text.split("  ").map((item, index) => (
            <div key={index}>
              {" "}
              {new Intl.NumberFormat("vi-VN").format(item)} đ{" "}
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "datetime",
      key: "datetime",
      render: (text) => (
        <div style={{ whiteSpace: "normal" }}>
          {text.split("  ").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const colorMap = {
          "Đang báo giá": "orange",
          "Đang in": "blue",
          "Đã hoàn thành": "green",
          "Trả hàng": "red",
        };
        return (
          <span style={{ color: colorMap[status] || "black" }}>{status}</span>
        );
      },
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
        if (record.status === "Đang báo giá") {
          return (
            <Link to={`/tong-quan/edit-dat-hang-nha-in/${record.id}`}>
              {text}
            </Link>
          );
        } else if (record.status === "Đang in") {
          return (
            <Link to={`/tong-quan/edit-nhap-va-giao-hang/${record.id}`}>
              {text}
            </Link>
          );
        } else if (record.status === "Đã hoàn thành") {
          return (
            <Link to={`/tong-quan/da-hoan-thanh/${record.id}`}>{text}</Link>
          );
        } else if (record.status === "Trả hàng") {
          return (
            <Link to={`/tong-quan/edit-tra-hang/${record.id}`}>{text}</Link>
          );
        } else if (record.status === "Đã xóa") {
          return <Link to={`/tong-quan/da-xoa/${record.id}`}>{text}</Link>;
        } else if (record.status === "Lưu nháp") {
          return <Link to={`/tong-quan/da-luu/${record.id}`}>{text}</Link>;
        } else if (record.status === "Giao hàng thất bại") {
          return (
            <Link to={`/tong-quan/giao-hang-that-bai/${record.id}`}>
              {text}
            </Link>
          );
        } else if (record.status === "Đang giao") {
          return <Link to={`/tong-quan/dang-giao/${record.id}`}>{text}</Link>;
        }
        return text;
      },
    },
  ];

  console.log("Check status: ", dataValue);

  //hàm lọc sản phẩm theo trạng thái
  const filterDataByStatus = (status) =>
    status === "all"
      ? dataValue
      : dataValue.filter((item) => item.status === status);

  const items = [
    {
      key: "1",
      label: "Tất cả đơn hàng",
      children: (
        <Table
          columns={columns}
          dataSource={filterDataByStatus("all")}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 15,
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Đang báo giá",
      children: (
        <Table
          columns={columns}
          dataSource={filterDataByStatus("Đang báo giá")}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 15,
          }}
        />
      ),
    },
    {
      key: "3",
      label: "Đang in",
      children: (
        <Table
          columns={columns}
          dataSource={filterDataByStatus("Đang in")}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 15,
          }}
        />
      ),
    },
    {
      key: "4",
      label: "Đã hoàn thành",
      children: (
        <Table
          columns={columns}
          dataSource={filterDataByStatus("Đã hoàn thành")}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 15,
          }}
        />
      ),
    },
    {
      key: "5",
      label: "Trả hàng",
      children: (
        <Table
          columns={columns}
          dataSource={filterDataByStatus("Trả hàng")}
          pagination={{
            position: ["bottomCenter"],
            pageSize: 15,
          }}
        />
      ),
    },
  ];

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        overflow: "auto",
      }}
    >
      {contextHolder}
      <Tabs defaultActiveKey="1" items={items} onChange={setActiveKey} />
    </Content>
  );
}

export default Home;
