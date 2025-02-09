import { Button, Form, Input, Modal, Table } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import {
  getAllCategoryAPI,
  postAddCategoryAPI,
  postUpdateCategoryAPI, // API để cập nhật loại sản phẩm
  deleteCategoryAPI,
  getAllClassifylv2API,
  postAddClassifylv2API,
  postUpdateClassifylv2API,
  deleteClassifylv2API,
} from "../../apis/handleDataAPI";

const { Title } = Typography;
const { confirm } = Modal;

function ClassifyLv2() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm(); // Khởi tạo instance của form
  const [isFormValid, setIsFormValid] = useState(false); // Trạng thái hợp lệ của form
  const [selectedCategory, setSelectedCategory] = useState(null); // Sản phẩm được chọn để sửa
  const token = localStorage.getItem("authToken");

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const [pageSize, setPageSize] = useState(15); // Quản lý số lượng bản ghi mỗi trang
  const [total, setTotal] = useState(0); // Tổng số bản ghi

  const fetchData = async () => {
    try {
      const response = await getAllClassifylv2API(token);
      console.log(response);
      if (response.data.data && response.data.data.length > 0) {
        const transformedData = response.data.data.map((item) => ({
          key: item.id,
          id: item.title,
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
        await postUpdateClassifylv2API({
          session_token: token,
          id: selectedCategory.key, // ID sản phẩm cần sửa
          title: values.title,
          description: values.description_category,
        });
      } else {
        // Gọi API thêm mới loại sản phẩm
        console.log("them");
        const response = await postAddClassifylv2API({
          session_token: token,
          title: values.title,
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
      title: record.id,
      description_category: record.descriptions,
    });
  };

  const handleDelete = async (record) => {
    try {
      // Gọi API xóa loại sản phẩm
      console.log(record.key);
      const response = await deleteClassifylv2API({
        session_token: token,
        id: record.key,
      });
      console.log(response);
      fetchData(); // Cập nhật lại danh sách sau khi xóa
    } catch (error) {
      console.error("Error deleting category:", error);
      alert("Xóa phân loại cấp 2 thất bại. Vui lòng thử lại.");
    }
  };
  const showConfirm = (record) => {
    confirm({
      title: "Bạn có chắc chắn muốn xóa phân loại cấp 2 này?",
      content: `Tên phân loại cấp 2: ${record.id}`,
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
      title: "Tên phân loại cấp 2",
      dataIndex: "id",
      key: "id",
      width: 100, // Đặt độ rộng cột (px)
      render: (text, record) => (
        <div
          style={{ color: "green", cursor: "pointer" }}
          onClick={() => handleEdit(record)}
        >
          {text}
        </div>
      ),
    },
    {
      title: "Mô tả phân loại cấp 2",
      dataIndex: "descriptions",
      key: "descriptions",
      width: 300, // Đặt độ rộng cột
    },
    {
      title: "Hành động",
      key: "action",
      width: 100, // Đặt độ rộng cột
      render: (_, record) => (
        <Button danger onClick={() => showConfirm(record)}>
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
              Quản lý phân loại cấp 2
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
              Thêm phân loại cấp 2
            </Button>
          </Col>
          <Modal
            title={
              selectedCategory ? "Sửa phân loại cấp 2" : "Thêm phân loại cấp 2"
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
                    name="title"
                    label="Tên phân loại cấp 2"
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên phân loại cấp 2",
                      },
                    ]}
                  >
                    <Input placeholder="Nhập tên phân loại cấp 2" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col flex={1}>
                  <Form.Item name="description_category" label="Mô tả">
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

export default ClassifyLv2;
