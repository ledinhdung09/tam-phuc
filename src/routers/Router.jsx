import { Route, Routes } from "react-router-dom";
import Home from "../page/Home";
import AddOrder from "../page/Order/AddOrder";
import EditOrder from "../page/Order/EditOrder";
import Order from "../page/Order/Order";
import OrderPrinting from "../page/OrderNhaIn/OrderPrinting";
import EditOrderPrinting from "../page/OrderNhaIn/EditOrderPrinting";
import EditImportAndDeliveryGoods from "../page/NhapTraHang/EditImportAndDeliveryGoods";
import ImportAndDeliveryGoods from "../page/NhapTraHang/ImportAndDeliveryGoods";
import ReturnGoods from "../page/ReturnGoods/ReturnGoods";
import EditReturnGoods from "../page/ReturnGoods/EditReturnGoods";
import PrintingHouse from "../page/Nhain/PrintingHouse";
import AddPrintingHouse from "../page/Nhain/AddPrintingHouse";
import Report from "../page/Report";
import Client from "../page/Client/Client";
import Settings from "../page/Settings/Settings";
import AddClient from "../page/Client/AddClient";
import Login from "../page/Auth/Login";
import ProtectedRoute from "./ProtectedRoute"; // Đường dẫn đến file ProtectedRoute
import EditPrintingHouse from "../page/Nhain/EditPrintingHouse";
import EditClient from "../page/Client/EditClient";
import AddProducts from "../page/Products/AddProducts";
import EditProducts from "../page/Products/EditProducts";
import Products from "../page/Products/Products";
import Bill from "../page/Order/Bill";
import OrderSuccess from "../page/OrderSuccess/OrderSuccess";
import OrderSave from "../page/OrderSave/OrderSave";
import OrderDelete from "../page/OrderDelete/OrderDelete";
import OrderFail from "../page/OrderFail/OrderFail";
import OrderDetail from "../page/Order/OrderDetail";
import EditOrderPrinting1 from "../page/OrderNhaIn/EditOrderPrinting1";
import BillOrder from "../page/Order/BillOrder";

function RouterDashboard() {
  // Kiểm tra trạng thái đăng nhập (ví dụ: token trong localStorage)
  const isAuthenticated = !!localStorage.getItem("authToken");

  return (
    <Routes>
      {/* Route không cần đăng nhập */}
      <Route path="/dang-nhap" element={<Login />} />

      {/* Routes cần bảo vệ */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/edit-dat-hang-nha-in/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditOrderPrinting1 />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/edit-don-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/edit-nhap-va-giao-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditImportAndDeliveryGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/edit-tra-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditReturnGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/da-hoan-thanh/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderSuccess />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/giao-hang-that-bai/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderFail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/da-xoa/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderDelete />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/dang-giao/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditImportAndDeliveryGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/da-luu/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderSave />
          </ProtectedRoute>
        }
      />
      <Route
        path="/don-hang"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Order />
          </ProtectedRoute>
        }
      />
      <Route
        path="/don-hang/them-don-hang"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/don-hang/edit-don-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/don-hang/bill"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BillOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dat-hang-nha-in/bill"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BillOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhap-va-giao-hang/bill"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BillOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tong-quan/bill"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <BillOrder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/don-hang/chi-tiet-don-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dat-hang-nha-in"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <OrderPrinting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dat-hang-nha-in/edit-dat-hang-nha-in/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditOrderPrinting />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhap-va-giao-hang/edit-nhap-va-giao-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditImportAndDeliveryGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nhap-va-giao-hang"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ImportAndDeliveryGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tra-hang"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ReturnGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tra-hang/edit-tra-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditReturnGoods />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nha-in"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <PrintingHouse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bao-cao"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Report />
          </ProtectedRoute>
        }
      />
      <Route
        path="/khach-hang"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Client />
          </ProtectedRoute>
        }
      />
      <Route
        path="/khach-hang/edit-khach-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditClient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/cau-hinh"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Settings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/khach-hang/tao-khach-hang"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddClient />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nha-in/tao-nha-in"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddPrintingHouse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/nha-in/edit-nha-in/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditPrintingHouse />
          </ProtectedRoute>
        }
      />
      <Route
        path="/san-pham/tao-san-pham/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AddProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/san-pham"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Products />
          </ProtectedRoute>
        }
      />
      <Route
        path="/san-pham/edit-san-pham/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditProducts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/san-pham/edit-don-hang/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <EditOrder />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default RouterDashboard;
