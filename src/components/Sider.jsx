import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  ShoppingCartOutlined,
  SettingFilled,
  BarChartOutlined,
} from "@ant-design/icons";
import { FaUsers } from "react-icons/fa";
import { Layout, Menu } from "antd";
import { Link, useLocation } from "react-router-dom";

const { Sider } = Layout;

function SiderDashboard() {
  const location = useLocation();

  // Map URL pathnames to menu item keys (keys correspond to main paths)
  const keyMap = [
    { path: "/tong-quan", key: "1" },
    { path: "/don-hang", key: "2" },
    { path: "/dat-hang-nha-in", key: "3" },
    { path: "/nhap-va-giao-hang", key: "4" },
    { path: "/tra-hang", key: "5" },
    { path: "/bao-cao", key: "6" },
    { path: "/khach-hang", key: "7" },
    { path: "/nha-in", key: "8" },
    { path: "/cau-hinh", key: "9" },
    { path: "/san-pham", key: "10" },
  ];

  // Determine the active menu item key
  const selectedKey =
    keyMap.find((item) => location.pathname.startsWith(item.path))?.key || "1";

  return (
    <Sider style={{ background: "#F5F5F5" }} trigger={null} collapsible>
      <div className="demo-logo-vertical" />
      <Menu
        style={{ background: "#F5F5F5", border: "none", marginTop: "1rem" }}
        mode="inline"
        selectedKeys={[selectedKey]}
        items={[
          {
            key: "1",
            icon: <UserOutlined />,
            label: <Link to="/tong-quan">Tổng quan</Link>,
          },
          {
            key: "2",
            icon: <VideoCameraOutlined />,
            label: <Link to="/don-hang">Đơn hàng</Link>,
          },
          {
            key: "3",
            icon: <ShoppingCartOutlined />,
            label: <Link to="/dat-hang-nha-in">Đặt hàng nhà in</Link>,
          },
          {
            key: "4",
            icon: <UploadOutlined />,
            label: <Link to="/nhap-va-giao-hang">Nhập & giao hàng</Link>,
          },
          {
            key: "5",
            icon: <UploadOutlined />,
            label: <Link to="/tra-hang">Trả hàng</Link>,
          },
          {
            key: "6",
            icon: <BarChartOutlined />,
            label: <Link to="/bao-cao">Báo cáo</Link>,
          },
          {
            key: "10",
            icon: <SettingFilled />,
            label: <Link to="/san-pham">Sản phẩm</Link>,
          },
          {
            key: "7",
            icon: <FaUsers />,
            label: <Link to="/khach-hang">Khách hàng</Link>,
          },
          {
            key: "8",
            icon: <UploadOutlined />,
            label: <Link to="/nha-in">Nhà in</Link>,
          },
          {
            key: "9",
            icon: <SettingFilled />,
            label: <Link to="/cau-hinh">Cấu hình</Link>,
          },
        ]}
      />
    </Sider>
  );
}

export default SiderDashboard;
