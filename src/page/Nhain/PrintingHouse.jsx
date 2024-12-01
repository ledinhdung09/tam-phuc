import { useEffect, useState } from "react";
import { Button, Input, Layout, Table, theme } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { postDataPrintAPI } from "../../apis/handleDataAPI";

const { Title } = Typography;
const { Content } = Layout;

function PrintingHouse() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const [pageSize, setPageSize] = useState(3); // Quản lý số lượng bản ghi mỗi trang
  const [total, setTotal] = useState(0); // Tổng số bản ghi

  // Hàm gọi API
  const fetchData = async (page, pageSize) => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await postDataPrintAPI(token, pageSize, page);
      console.log(response);

      // Chuyển đổi dữ liệu trả về thành dạng mà bảng yêu cầu
      const transformedData = response.data.data.map((item) => ({
        key: item.id,
        id: item.company_name, // Tên công ty
        phone: item.phone, // Số điện thoại
        email: item.email, // Email
      }));

      setData(transformedData);
      setTotal(response.data.total); // Cập nhật tổng số bản ghi từ API
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the form. Please try again.");
    }
  };

  // Gọi API khi trang hoặc số lượng bản ghi thay đổi
  useEffect(() => {
    fetchData(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const columns = [
    {
      title: "Tên công ty",
      dataIndex: "id",
      key: "id",
      width: 200, // Đặt độ rộng cố định (đơn vị là px)
      render: (text, record) => (
        <Link to={`/nha-in/edit-nha-in/${record.key}`}>
          <div style={{ color: "green" }}>{text}</div>
        </Link>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 150, // Đặt độ rộng cố định
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 250, // Đặt độ rộng cố định
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
            Danh sách nhà in
          </Title>
        </Col>
        <Col>
          <Link to="/nha-in/tao-nha-in">
            <Button
              icon={<PlusCircleFilled />}
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
            >
              Tạo nhà in
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

export default PrintingHouse;
