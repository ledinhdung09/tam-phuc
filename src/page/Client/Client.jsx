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
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const [pageSize, setPageSize] = useState(3); // Quản lý số lượng bản ghi mỗi trang
  const [total, setTotal] = useState(0); // Tổng số bản ghi
  useEffect(() => {
    const handleData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await postDataCustomerAPI(token);
        console.log(response);
        if (response.data.data && response.data.data.length > 0) {
          const transformedData = response.data.data.map((item) => ({
            key: item.id, // Key cho mỗi dòng
            id: item.customer_name, // Tên khách hàng
            revenue: item.phone, // Số điện thoại
            datetime: item.email, // Email
            actprocessing_staffion: item.ward + item.district + item.city, // Ghi chú hoặc thông tin khác
            orderId: item.latest_order
              ? item.latest_order.order_id
              : "Chưa có đơn",
            orderCount: item.total_orders,
            totalMoney: item.total_spent,
          }));

          setData(transformedData);
          setTotal(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error fetching the form. Please try again.");
      }
    };
    handleData();
  }, []);

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
          />
          <Table
            columns={columns}
            dataSource={data}
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: total, // Tổng số bản ghi để tính số trang
              position: ["bottomCenter"],
              onChange: (page, pageSize) => {
                setCurrentPage(page); // Cập nhật trang hiện tại
                setPageSize(pageSize); // Cập nhật số lượng bản ghi mỗi trang
              },
            }}
          />
        </Col>
      </Row>
    </Content>
  );
}

export default Client;
