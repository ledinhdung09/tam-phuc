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
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu đã lọc
  const [searchKeyword, setSearchKeyword] = useState(""); // Từ khóa tìm kiếm
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await postDataPrintAPI(token);
        if (response.data.data && response.data.data.length > 0) {
          const transformedData = response.data.data.map((item) => ({
            key: item.id,
            id: item.company_name, // Tên công ty
            phone: item.phone, // Số điện thoại
            email: item.email, // Email
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
    fetchData();
  }, []);

  // Xử lý tìm kiếm khi từ khóa thay đổi
  useEffect(() => {
    const results = data.filter(
      (item) =>
        item.id.toLowerCase().includes(searchKeyword.toLowerCase()) || // Tìm kiếm theo tên công ty
        item.phone.includes(searchKeyword) || // Tìm kiếm theo số điện thoại
        item.email.toLowerCase().includes(searchKeyword.toLowerCase()) // Tìm kiếm theo email
    );
    setFilteredData(results);
    setTotal(results.length);
  }, [searchKeyword, data]);

  const columns = [
    {
      title: "Tên công ty",
      dataIndex: "id",
      key: "id",
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
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
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
            placeholder="Tìm kiếm nhà in"
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

export default PrintingHouse;
