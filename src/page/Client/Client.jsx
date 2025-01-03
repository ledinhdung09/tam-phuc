import { useEffect, useState } from "react";
import { Button, Input, Layout, Table, theme } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { postDataCustomerAPI } from "../../apis/handleDataAPI";

const { Title } = Typography;
const { Content } = Layout;

function Client() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const handleData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await postDataCustomerAPI(token);
        if (response.data.data && response.data.data.length > 0) {
          const transformedData = response.data.data.map((item) => ({
            key: item.id,
            id: item.customer_name,
            revenue: item.phone,
            datetime: item.email,
            actprocessing_staffion:
              item.address +
              " ," +
              item.ward +
              " ," +
              item.district +
              " ," +
              item.city,
            orderId: item.latest_order
              ? item.latest_order.order_id
              : "Chưa có đơn",
            orderCount: item.total_orders,
            totalMoney: item.total_spent,
          }));

          setData(transformedData);
          setFilteredData(transformedData); // Ban đầu hiển thị tất cả dữ liệu
          setTotal(response.data.data.length);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching the form. Please try again.");
      }
    };
    handleData();
  }, []);

  // Xử lý tìm kiếm
  useEffect(() => {
    const results = data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchKeyword.toLowerCase()) || // Tìm kiếm theo tên khách hàng
        item.revenue.includes(searchKeyword) || // Tìm kiếm theo số điện thoại
        item.datetime.toLowerCase().includes(searchKeyword.toLowerCase()) // Tìm kiếm theo email
    );
    setFilteredData(results);
    setTotal(results.length);
  }, [searchKeyword, data]);

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <Link to={`/khach-hang/edit-khach-hang/${record.key}`}>
          <div style={{ color: "green" }}>{text}</div>
        </Link>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "revenue",
      key: "revenue",
    },
    {
      title: "Email",
      dataIndex: "datetime",
      key: "datetime",
    },
    {
      title: "Địa chỉ",
      key: "actprocessing_staffion",
      dataIndex: "actprocessing_staffion",
      render: (text) => <div style={{ color: "green" }}>{text}</div>,
    },
    {
      title: "Đơn gần nhất",
      key: "orderId",
      dataIndex: "orderId",
    },
    {
      title: "Sl đơn",
      key: "orderCount",
      dataIndex: "orderCount",
    },
    {
      title: "Tổng chi tiêu",
      key: "totalMoney",
      dataIndex: "totalMoney",
      render: (text) => (
        <div>{new Intl.NumberFormat("vi-VN").format(text)} đ </div>
      ),
    },
  ];

  return (
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
      <Row
        style={{
          marginTop: 0,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Col>
          <Title style={{ margin: 0, marginBottom: 16 }} level={3}>
            Danh sách khách hàng
          </Title>
        </Col>
        <Col>
          <Link to="/khach-hang/tao-khach-hang">
            <Button
              icon={<PlusCircleFilled />}
              iconPosition="start"
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
            >
              Tạo khách hàng
            </Button>
          </Link>
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            border: "1px solid black",
            padding: "1rem",
            borderRadius: "10px",
            flex: 2,
            marginTop: 20,
          }}
        >
          <Input
            size="large"
            placeholder="Tìm kiếm khách hàng"
            style={{
              marginBottom: 20,
            }}
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchKeyword(e.target.value)} // Cập nhật từ khóa tìm kiếm
          />
          <Table
            columns={columns}
            dataSource={filteredData} // Hiển thị dữ liệu đã lọc
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total,
              position: ["bottomCenter"],
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default Client;
