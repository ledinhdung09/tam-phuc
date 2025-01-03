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
import { useEffect, useState } from "react";

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

  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));
  useEffect(() => {
    setCate_id(localStorage.getItem("cate_id"));
  }, []);

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
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "2") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "1" || cate_id === "3" ? (
                  <Link to="/don-hang">Đơn hàng</Link>
                ) : (
                  "Đơn hàng"
                )}
              </span>
            ),
          },
          {
            key: "3",
            icon: <ShoppingCartOutlined />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "1") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "3" || cate_id === "2" ? (
                  <Link to="/dat-hang-nha-in">Đặt hàng nhà in</Link>
                ) : (
                  "Đặt hàng nhà in"
                )}
              </span>
            ),
          },
          {
            key: "4",
            icon: <UploadOutlined />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "2") {
                    alert("Bạn không có quyền truy cập vào");
                  }
                }}
              >
                {cate_id === "3" || cate_id === "1" ? (
                  <Link to="/nhap-va-giao-hang">Nhập & giao hàng</Link>
                ) : (
                  "Nhập & giao hàng"
                )}
              </span>
            ),
          },
          {
            key: "5",
            icon: <UploadOutlined />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "1" || cate_id === "2") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "3" ? (
                  <Link to="/tra-hang">Trả hàng</Link>
                ) : (
                  "Trả hàng"
                )}
              </span>
            ),
          },
          {
            key: "6",
            icon: <BarChartOutlined />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id !== "1" && cate_id !== "2" && cate_id !== "3") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "1" || cate_id === "2" || cate_id === "3" ? (
                  <Link to="/bao-cao">Báo cáo</Link>
                ) : (
                  "Báo cáo"
                )}
              </span>
            ),
          },
          {
            key: "10",
            icon: <SettingFilled />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id !== "1" && cate_id !== "2" && cate_id !== "3") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "1" || cate_id === "2" || cate_id === "3" ? (
                  <Link to="/san-pham">Sản phẩm</Link>
                ) : (
                  "Sản phẩm"
                )}
              </span>
            ),
          },
          {
            key: "7",
            icon: <FaUsers />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "2") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "3" || cate_id === "1" ? (
                  <Link to="/khach-hang">Khách hàng</Link>
                ) : (
                  "Khách hàng"
                )}
              </span>
            ),
          },
          {
            key: "8",
            icon: <UploadOutlined />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "1" || cate_id === "2") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "3" ? <Link to="/nha-in">Nhà in</Link> : "Nhà in"}
              </span>
            ),
          },
          {
            key: "9",
            icon: <SettingFilled />,
            label: (
              <span
                style={{
                  display: "inline-block",
                  width: "100%",
                  height: "100%",
                }}
                onClick={() => {
                  if (cate_id === "1" || cate_id === "2") {
                    alert("Bạn không có quyền truy cập vào");
                    console.log(cate_id);
                  }
                }}
              >
                {cate_id === "3" ? (
                  <Link to="/cau-hinh">Cấu hình</Link>
                ) : (
                  " Cấu hình"
                )}
              </span>
            ),
          },
        ]}
      />
    </Sider>
  );
}

export default SiderDashboard;
