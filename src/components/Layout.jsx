import { Divider, Layout } from "antd";
import SiderDashboard from "./Sider";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import RouterDashboard from "../routers/Router";

const LayoutDashboard = () => {
  const location = useLocation();

  // Kiểm tra nếu đường dẫn là "/dang-nhap"
  const isLoginPage = location.pathname === "/dang-nhap";

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      {isLoginPage ? (
        // Chỉ hiển thị Login mà không bọc Layout
        <RouterDashboard />
      ) : (
        <>
          {/* Header và Divider */}
          <Header />
          <Divider
            style={{
              margin: 0,
              borderColor: "#8d99ae",
              height: "2.5px",
              background: "#ababab",
            }}
          />
          {/* Hiển thị Layout bình thường cho các trang khác */}
          <Layout style={{ flex: 1, overflow: "hidden" }}>
            <SiderDashboard />
            <Layout style={{ overflowY: "auto" }}>
              <RouterDashboard />
            </Layout>
          </Layout>
        </>
      )}
    </div>
  );
};

export default LayoutDashboard;
