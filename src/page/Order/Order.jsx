import { useEffect, useState } from "react";
import { Button, Input, Layout, Table, Tabs, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getDataOrdersAPI } from "../../apis/handleDataAPI";
import { SearchOutlined } from "@ant-design/icons";

const { Content } = Layout;

function Order() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1"); // Theo dõi tab đang hoạt động
  const [data, setData] = useState([]); // Dữ liệu đơn hàng
  const [searchText, setSearchText] = useState(""); // Dữ liệu tìm kiếm
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [totalOrders, setTotalOrders] = useState(0); // Tổng số đơn hàng

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      render: (text, record) => {
        return <Link to={`edit-don-hang/${record.id}`}>#{text}</Link>;
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
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "Đang báo giá":
            color = "orange";
            break;
          case "Đang in":
            color = "blue";
            break;
          case "Đã hoàn thành":
            color = "green";
            break;
          case "Đã hủy":
            color = "red";
            break;
          default:
            color = "black";
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Nhân viên xử lý",
      key: "actprocessing_staffion",
      dataIndex: "actprocessing_staffion",
    },
    {
      title: "Thiết kế xử lý file",
      key: "file_processing_design",
      dataIndex: "file_processing_design",
    },
    {
      title: "Hóa đơn VAT",
      key: "vat",
      dataIndex: "vat",
      render: (text, record) => {
        return (
          <Link
            to={{
              pathname: `/don-hang/bill`,
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

  // Fetch dữ liệu đơn hàng
  const fetchData = async (page = 1, limit = 50) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await getDataOrdersAPI(token, page, limit);
      const orders = response.data.data;

      if (!orders || orders.length === 0) {
        setData([]);
        setTotalOrders(0);
        return;
      }

      const filteredOrders = orders.filter(
        (order) =>
          order.order_status === "1" ||
          order.order_status === "2" ||
          order.order_status === "7"
      );

      const transformedData = filteredOrders.map((item) => {
        let status;
        switch (item.order_status) {
          case "1":
            status = "Đang báo giá";
            break;
          case "2":
            status = "Đang in";
            break;
          case "7":
            status = "Đang giao";
            break;
          default:
            status = "Trạng thái không xác định";
        }

        return {
          key: item.order_id,
          id: item.order_id,
          revenue: item.total,
          datetime: item.order_date,
          actprocessing_staffion: item.processing_employee,
          file_processing_design: item.design_confirm_employee,
          status: status,
          vat: "Xem hóa đơn",
        };
      });

      setData(transformedData);
      setTotalOrders(filteredOrders.length);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Lọc dữ liệu theo tìm kiếm
  const filteredData = data.filter((item) =>
    item.id.toString().toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSearch = (value) => {
    setSearchText(value.trim());
  };

  const onChange = () => {
    navigate("them-don-hang");
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        overflow: "auto",
        position: "relative",
      }}
    >
      <Input
        placeholder="Nhập mã đơn hàng để tìm kiếm..."
        onChange={(e) => handleSearch(e.target.value)} // Gọi handleSearch khi người dùng nhập
        style={{
          marginBottom: 16,
          position: "absolute",
          width: "400px",
          zIndex: 999,
          right: "40%",
        }}
        prefix={<SearchOutlined />}
      />

      <Button
        style={{
          backgroundColor: "green",
          color: "white",
          position: "absolute",
          right: "30px",
          zIndex: "999",
        }}
        type="primary"
        onClick={onChange}
      >
        Thêm đơn hàng
      </Button>
      <Tabs
        activeKey={activeKey}
        style={{ paddingTop: 0 }}
        items={[
          {
            key: "1",
            label: (
              <Button
                style={{
                  backgroundColor: activeKey === "1" ? "#348F63" : undefined,
                  color: activeKey === "1" ? "#fff" : undefined,
                }}
              >
                Tất cả đơn hàng
              </Button>
            ),
            children: (
              <>
                {filteredData.length > 0 ? (
                  <Table
                    columns={columns}
                    dataSource={filteredData}
                    pagination={{
                      current: currentPage,
                      pageSize: 15,
                      total: filteredData.length,
                      position: ["bottomCenter"],
                      onChange: (page) => setCurrentPage(page),
                    }}
                  />
                ) : (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    Không tìm thấy kết quả phù hợp.
                  </div>
                )}
              </>
            ),
          },
        ]}
      />
    </Content>
  );
}

export default Order;
