import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Register = () => {
  const onFinish = (values) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingTop: "100px",
      }}
    >
      <div style={{ maxWidth: "400px" }}>
        <Form
          name="register_form"
          initialValues={{ agree: false }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: "Please input your Username!" },
              {
                min: 3,
                message: "Username must be at least 3 characters long!",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: "Please input your Password!" },
              {
                min: 6,
                message: "Password must be at least 6 characters long!",
              },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your Password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match!"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Confirm Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ width: "100%", marginTop: "10px" }}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Register;
