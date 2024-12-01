import { Button, Checkbox, Form, Input, Modal, Table } from "antd";
import { Col, Row } from "antd";
import { Typography } from "antd";
import { useState, useEffect } from "react";
import {
  postAddStaffAPI,
  postUpdateStaffAPI,
  deleteStaffAPI,
  getAllStaffAPI,
} from "../../apis/handleDataAPI";

const { Title } = Typography;
const { confirm } = Modal;

function Staff() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const token = localStorage.getItem("authToken");

  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Quản lý trang hiện tại
  const [pageSize, setPageSize] = useState(3); // Quản lý số lượng bản ghi mỗi trang
  const [total, setTotal] = useState(0); // Tổng số bản ghi
  const [checkedValues, setCheckedValues] = useState([]);
  const plainOptions = [
    { label: "Read", value: "read" },
    { label: "Write", value: "write" },
    { label: "Delete", value: "delete" },
  ];

  const fetchData = async () => {
    try {
      const response = await getAllStaffAPI(token);
      const transformedData = response.data.data.map((item) => ({
        key: item.id,
        id: item.username,
        date: item.created_at,
        permissions: item.permissions,
      }));
      setData(transformedData);
      setTotal(response.data.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleFormChange = () => {
    form
      .validateFields()
      .then(() => setIsFormValid(true))
      .catch(() => setIsFormValid(false));
  };

  const handleEdit = (record) => {
    setSelectedStaff(record);
    setIsModalOpen(true);

    const permissions = JSON.parse(record.permissions);
    const selectedPermissions = Object.keys(permissions).filter(
      (key) => permissions[key]
    );

    form.setFieldsValue({
      username: record.id,
      password: "",
      confirm_password: "",
    });
    setCheckedValues(selectedPermissions);
  };

  const handleDelete = async (record) => {
    try {
      // await deleteStaffAPI({
      //   session_token: token,
      //   id: record.key,
      // });
      alert("BackEnd ChưA LàM");
      fetchData();
    } catch (error) {
      console.error("Error deleting staff:", error);
      alert("Failed to delete staff. Please try again.");
    }
  };

  const showConfirm = (record) => {
    confirm({
      title: "Are you sure you want to delete this staff member?",
      content: `Staff Name: ${record.id}`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        handleDelete(record);
      },
    });
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const permissions = plainOptions.reduce((acc, option) => {
        acc[option.value] = checkedValues.includes(option.value);
        return acc;
      }, {});

      if (selectedStaff) {
        const response = await postUpdateStaffAPI({
          session_token: token,
          id: selectedStaff.key,
          username: values.username,
          password: values.password,
          permissions: permissions,
        });
        console.log(response);
      } else {
        await postAddStaffAPI({
          session_token: token,
          username: values.username,
          password: values.password,
          permissions,
        });
      }

      fetchData();
      form.resetFields();
      setCheckedValues([]);
      setSelectedStaff(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedStaff(null);
    form.resetFields();
    setCheckedValues([]);
  };

  const columns = [
    {
      title: "UserName",
      dataIndex: "id",
      key: "id",
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
      title: "Date Created",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Actions",
      key: "action",
      render: (_, record) => (
        <Button danger onClick={() => showConfirm(record)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
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
            Quản lý nhân viên
          </Title>
        </Col>
        <Col flex={1} style={{ display: "flex", justifyContent: "end" }}>
          <Button
            style={{ backgroundColor: "green", color: "white" }}
            type="primary"
            onClick={() => {
              setSelectedStaff(null);
              setIsModalOpen(true);
              form.resetFields();
            }}
          >
            Thêm nhân viên
          </Button>
        </Col>
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

      <Modal
        title={selectedStaff ? "Edit Staff" : "Add Staff"}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okButtonProps={{ disabled: !isFormValid }}
      >
        <Form form={form} layout="vertical" onChange={handleFormChange}>
          <Row gutter={16}>
            <Col flex={1}>
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please enter the username" },
                ]}
              >
                <Input placeholder="Enter username" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col flex={1}>
              <Form.Item
                name="password"
                label="Password"
                rules={[
                  { required: true, message: "Please enter the password" },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Enter password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col flex={1}>
              <Form.Item
                name="confirm_password"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: true, message: "Please confirm your password" },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm password" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col flex={1}>
              <Title level={5} style={{ marginTop: 1 }}>
                Permissions
              </Title>
              <Checkbox.Group
                options={plainOptions}
                value={checkedValues}
                onChange={setCheckedValues}
              />
            </Col>
          </Row>
        </Form>
      </Modal>
    </Col>
  );
}

export default Staff;
