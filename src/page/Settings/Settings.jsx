import { Form, Layout, Tabs, theme } from "antd";
import Staff from "./Staff";
import Category from "./Category";

const { Content } = Layout;

function Settings() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [form] = Form.useForm();

  return (
    <Form form={form} layout="vertical" autoComplete="off">
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
        <Tabs
          defaultActiveKey="1"
          type="card"
          items={[
            {
              label: "Quản lý nhân sự",
              key: "1",
              children: <Staff />, // Nội dung của Tab
            },
            {
              label: "Quản lý nhóm sản phẩm",
              key: "2",
              children: <Category />, // Nội dung của Tab
            },
          ]}
        />
      </Content>
    </Form>
  );
}

export default Settings;
