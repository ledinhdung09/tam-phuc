import { Button, Form, Input, Modal, Table } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import {
  getAllCategoryAPI,
  postAddCategoryAPI,
  postUpdateCategoryAPI, // API để cập nhật loại sản phẩm
  deleteCategoryAPI,
} from "../../apis/handleDataAPI";

const { Title } = Typography;
const { confirm } = Modal;

function Category() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Khởi tạo instance của form
  const [isFormValid, setIsFormValid] = useState(false); // Trạng thái hợp lệ của form
  const [selectedCategory, setSelectedCategory] = useState(null); // Sản phẩm được chọn để sửa
  const token = localStorage.getItem("authToken");

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const [pageSize, setPageSize] = useState(3); // Quản lý số lượng bản ghi mỗi trang
  const [total, setTotal] = useState(0); // Tổng số bản ghi
  const fetchData = async () => {
    try {
      const response = await getAllCategoryAPI(token);
      console.log(response);
      if (response.data.data && response.data.data.length > 0) {
        const transformedData = response.data.data.map((item) => ({
          key: item.id,
          id: item.category_name,
          descriptions: item.description,
        }));
        setData(transformedData);
        setTotal(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (selectedCategory) {
        // Gọi API cập nhật thông tin loại sản phẩm
        await postUpdateCategoryAPI({
          session_token: token,
          id: selectedCategory.key, // ID sản phẩm cần sửa
          category_name: values.name_category,
          description: values.description_category,
        });
      } else {
        // Gọi API thêm mới loại sản phẩm
        console.log("them");
        const response = await postAddCategoryAPI({
          session_token: token,
          category_name: values.name_category,
          description: values.description_category,
        });
        console.log(response);
      }

      fetchData(); // Cập nhật lại danh sách
      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Đã xảy ra lỗi. Vui lòng thử lại sau.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedCategory(null); // Xóa sản phẩm đang được chọn khi đóng Modal
  };

  const handleFormChange = () => {
    form
      .validateFields()
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  };

  const handleEdit = (record) => {
    setSelectedCategory(record); // Lưu thông tin sản phẩm được chọn
    setIsModalOpen(true);

    // Điền dữ liệu vào form
    form.setFieldsValue({
      name_category: record.id,
      description_category: record.descriptions,
    });
  };

  const handleDelete = async (record) => {
    try {
      // Gọi API xóa loại sản phẩm
      console.log(record.key);
      const response = await deleteCategoryAPI({
        session_token: token,
        id: record.key,
      });
      console.log(response);
      fetchData(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Xóa nhóm sản phẩm thất bại. Vui lòng thử lại.");
    }
  };
  const showConfirm = (record) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa nhóm sản phẩm này?",
      content: `Tên nhóm sản phẩm: ${record.id}`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        handleDelete(record);
      },
      onCancel() {
        console.log("Hủy xóa");
      },
    });
  };

  const columns = [
    {
      title: "Tên nhóm sản phẩm",
      dataIndex: "id",
      key: "id",
      render: (text, record) => (
        <div
          style={{ color: "green", cursor: "pointer" }}
          onClick={() => handleEdit(record)} // Xử lý khi nhấn vào tên loại sản phẩm
        >
          {text}
        </div>
      ),
    },
    {
      title: "Mô tả loại sản phẩm",
      dataIndex: "descriptions",
      key: "descriptions",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button
          danger
          onClick={() => showConfirm(record)} // Gọi confirm trước khi xóa
        >
          Xóa
        </Button>
      ),
    },
  ];

  return (
    <>
      <Col
        style={{
          border: "1px solid black",
          padding: "1rem",
          borderRadius: "10px",
          flex: 1,
          marginRight: 20,
        }}
      >
        <Row
          gutter={16}
          style={{
            alignItems: "center",
            marginBottom: "10px",
          }}
        >
          <Col flex={1}>
            <Title style={{ margin: 0 }} level={3}>
              Quản lý nhóm sản phẩm
            </Title>
          </Col>
          <Col
            flex={1}
            style={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              style={{ backgroundColor: "green", color: "white" }}
              type="primary"
              onClick={() => {
                setSelectedCategory(null); // Reset sản phẩm đang chọn khi thêm mới
                setIsModalOpen(true);
                form.resetFields();
              }}
              onChange={handleFormChange}
            >
              Thêm nhóm sản phẩm
            </Button>
          </Col>
          <Modal
            title={
              selectedCategory ? "Sửa nhóm sản phẩm" : "Thêm nhóm sản phẩm"
            }
            open={isModalOpen}
            onOk={handleOk}
            onCancel={handleCancel}
            okButtonProps={{ disabled: !isFormValid }}
          >
            <Form form={form} layout="vertical" onChange={handleFormChange}>
              <Row gutter={16}>
                <Col flex={1}>
                  <Form.Item
                    name="name_category"
                    label="Tên nhóm sản phẩm"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên nhóm sản phẩm",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên nhóm sản phẩm" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col flex={1}>
                  <Form.Item
                    name="description_category"
                    label="Mô tả"
                    rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
                  >
                    <Input.TextArea placeholder="Nhập mô tả" rows={3} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Modal>
        </Row>

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
    </>
  );
}

export default Category;
