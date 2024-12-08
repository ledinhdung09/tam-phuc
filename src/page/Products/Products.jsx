import { useEffect, useState } from "react";
import { Button, Input, Layout, Table, theme, Popconfirm } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { PlusCircleFilled, SearchOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { getDataProductAPI, deleteProductAPI } from "../../apis/handleDataAPI";

const { Title } = Typography;
const { Content } = Layout;

function Products() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const [pageSize, setPageSize] = useState(15); // Quản lý số lượng bản ghi mỗi trang
  const [total, setTotal] = useState(0); // Tổng số bản ghi
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await getDataProductAPI(token);
      const transformedData = response.data.products.map((item) => ({
        key: item.id,
        id: item.product_name,
        cate: item.category_name,
        rules: item.rules,
      }));
      setData(transformedData);
      setFilteredData(transformedData);
      setTotal(response.data.products.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the data. Please try again.");
    }
  };
  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));
  useEffect(() => {
    setCate_id(localStorage.getItem("cate_id"));
  }, []);
  const handleDelete = async (productId) => {
    if (cate_id === "1" || cate_id === "2") {
      alert("Bạn không có quyền xóa sản phẩm");
    } else {
      const token = localStorage.getItem("authToken");
      try {
        const response = await deleteProductAPI(token, productId);
        console.log(response);
        if (response.data.success) {
          alert("Xóa sản phẩm thành công");
          fetchData(); // Tải lại danh sách sau khi xóa
        } else {
          alert("Xóa sản phẩm thất bại. Vui lòng thử lại.");
        }
      } catch (error) {
        console.error("Error deleting product:", error);
        alert("Xóa sản phẩm thất bại. Vui lòng thử lại.");
      }
    }
  };

  const columns = [
    {
      title: "Tên sản phẩm",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <span
          style={{
            display: "inline-block",
            width: "100%",
            height: "100%",
            color: "green",
          }}
          onClick={() => {
            if (cate_id === "1" || cate_id === "2") {
              alert("Bạn không có quyền truy cập vào");
              console.log(cate_id);
            }
          }}
        >
          {cate_id === "3" ? (
            <Link to={`/san-pham/edit-san-pham/${record.key}`}>
              <div style={{ color: "green" }}>{text}</div>
            </Link>
          ) : (
            <div>{text}</div>
          )}
        </span>
      ),
    },

    {
      title: "Tên loại sản phẩm",
      dataIndex: "cate",
      key: "cate",
    },
    {
      title: "Rules",
      dataIndex: "rules",
      key: "rules",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Popconfirm
          title="Bạn có chắc chắn muốn xóa sản phẩm này không?"
          onConfirm={() => handleDelete(record.key)}
          okText="Xóa"
          cancelText="Hủy"
        >
          <Button danger>Xóa</Button>
        </Popconfirm>
      ),
    },
  ];
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi tìm kiếm
  const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
  useEffect(() => {
    handleSearch(searchTerm); // Lọc dữ liệu khi từ khóa tìm kiếm thay đổi
  }, [searchTerm, data]);
  const handleSearch = (term) => {
    const lowercasedTerm = term.toLowerCase();
    const filtered = data.filter(
      (item) =>
        item.id.toLowerCase().includes(lowercasedTerm) || // Tìm theo tên sản phẩm
        item.cate.toLowerCase().includes(lowercasedTerm) // Tìm theo loại sản phẩm
    );
    setFilteredData(filtered);
    setTotal(filtered.length); // Cập nhật tổng số bản ghi
  };
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
            Danh sách sản phẩm
          </Title>
        </Col>
        <Col>
          {cate_id === "3" ? (
            <Link to="/san-pham/tao-san-pham">
              <Button
                icon={<PlusCircleFilled />}
                style={{ backgroundColor: "green", color: "white" }}
                type="primary"
              >
                Tạo sản phẩm
              </Button>
            </Link>
          ) : (
            <Button
              icon={<PlusCircleFilled />}
              style={{
                backgroundColor: "gray",
                color: "white",
                cursor: "not-allowed",
              }}
              type="default"
              onClick={() => alert("Bạn không có quyền tạo sản phẩm")}
            >
              Tạo sản phẩm
            </Button>
          )}
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
            placeholder="Tìm kiếm sản phẩm"
            style={{
              marginBottom: 20,
            }}
            prefix={<SearchOutlined />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật từ khóa tìm kiếm
          />
          <Table
            columns={columns}
            dataSource={filteredData}
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

export default Products;
