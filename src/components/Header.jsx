import { Button, Flex } from "antd";
import { Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useAuth } from "../page/Auth/AuthContext";
import { useNavigate } from "react-router-dom";
const { Title } = Typography;

function Header() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const hanleLogout = () => {
    logout();
    navigate("/dang-nhap");
  };
  const items = [
    {
      label: <a onClick={hanleLogout}>Đăng xuất</a>,
      key: "0",
    },
  ];

  return (
    <Flex
      style={{
        padding: ".2rem",
        paddingLeft: "1rem",
        background: "#F5F5F5",
        paddingBottom: ".5rem",
      }}
      justify="space-between"
      align="center"
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          style={{ width: "50px" }}
          src="/logo-removebg-preview.png"
          alt=""
        />
        <Title level={3} style={{ margin: "1rem" }}>
          IN TÂM PHÚC
        </Title>
      </div>
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
      >
        <Button icon={<UserOutlined />} iconPosition="end">
          {localStorage.getItem("username")}
          <Space></Space>
        </Button>
      </Dropdown>
    </Flex>
  );
}

export default Header;
