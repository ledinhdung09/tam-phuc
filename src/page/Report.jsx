import { Row, Col, Card, Statistic, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots"; // Nếu dùng biểu đồ, có thể sử dụng thư viện @ant-design/plots
import { getDataReportAPI } from "../apis/handleDataAPI";
import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts/LineChart";
//import { BarChart } from "@mui/x-charts/BarChart";
const Report = () => {
  const token = localStorage.getItem("authToken");

  const [totalOrder, setTotalOrder] = useState();
  const [total_revenue, setTotal_revenue] = useState();
  const [total_price, setTotal_price] = useState();
  const [top_products, setTop_products] = useState();
  const [top_employees, setTop_employees] = useState();
  const [dataEmploy, setDataEmploy] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [orderNew, setOrderNew] = useState([]);
  const [orderOld, setOrderOld] = useState([]);
  const [priceNew, setPriceNew] = useState([]);
  const [priceOld, setPriceOld] = useState([]);
  const [cate_id, setCate_id] = useState(localStorage.getItem("cate_id"));
  useEffect(() => {
    setCate_id(localStorage.getItem("cate_id"));
  }, []);
  const fetchData = async () => {
    try {
      const response = await getDataReportAPI(token);
      const data = response.data.data;
      console.log(response);
      setTotalOrder(data.total_orders);
      setTotal_revenue(data.total_revenue == null ? 0 : data.total_revenue);
      setTotal_price(data.total_revenue - data.total_print - data.total_ship);
      setTop_products(data.top_products);
      setTop_employees(data.top_employees);
      setOrderNew(Object.values(data.daily_orders_current));
      setOrderOld(Object.values(data.daily_orders_last_year));
      setPriceNew(Object.values(data.daily_revenue_current));
      setPriceOld(Object.values(data.daily_revenue_last_year));
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  useEffect(() => {
    if (top_employees) {
      const formattedData = top_employees.map((employee) => ({
        type: employee.employee_name,
        sales: parseInt(employee.total_orders), // Chuyển đổi `total_orders` về kiểu số
      }));
      setDataEmploy(formattedData); // Cập nhật dữ liệu sau khi xử lý
    }
  }, [top_employees]);
  useEffect(() => {
    if (top_products) {
      const formattedData = top_products.map((employee) => ({
        type: employee.product_name,
        sales: parseInt(employee.total_quantity), // Chuyển đổi `total_orders` về kiểu số
      }));
      setDataProduct(formattedData); // Cập nhật dữ liệu sau khi xử lý
    }
  }, [top_products]);

  //xong
  const lineConfigStart = {
    data: dataEmploy,
    height: 300,
    xField: "type",
    yField: "sales",
    style: {
      fill: "green",
    },
    autoFit: true,
  };

  //xong
  const lineConfig = {
    data: dataProduct,
    forceFit: true,
    xField: "type",
    yField: "sales",
    height: 300,
    style: {
      fill: "green",
    },
    autoFit: true,
  };

  const xLabels = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
  ];

  return (
    <div style={{ padding: 24, background: "#f0f2f5" }}>
      <Row
        style={{
          justifyContent: "space-between",
        }}
      >
        <Row style={{ flexWrap: "nowrap", width: "40%" }}>
          <Col
            span={8}
            style={{
              borderRight: "1px solid",
              marginRight: 16,
              paddingRight: 16,
            }}
          >
            <Statistic
              title="Tổng số đơn hàng"
              value={totalOrder}
              valueStyle={{ color: "#3f8600", fontWeight: "bold" }}
            />
          </Col>
          <Col
            span={8}
            style={{
              borderRight: "1px solid",
              marginRight: 16,
              paddingRight: 16,
            }}
          >
            <Statistic
              title="Doanh thu thuần"
              value={total_revenue}
              suffix="đ"
              valueStyle={{ color: "#3f8600", fontWeight: "bold" }}
            />
          </Col>
          <Col span={8}>
            {cate_id === "3" && (
              <Statistic
                title="Lợi nhuận"
                value={total_price}
                suffix="đ"
                valueStyle={{ color: "#cf1322", fontWeight: "bold" }}
              />
            )}
          </Col>
        </Row>

        <Col style={{ textAlign: "right", marginTop: 16, marginRight: 0 }}>
          <Button icon={<CalendarOutlined />}>Tháng này</Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Doanh số tháng so với cùng kỳ">
            <LineChart
              width={500}
              height={300}
              series={[
                { data: priceNew, label: "Tháng này" },
                { data: priceOld, label: "Tháng trước" },
              ]}
              xAxis={[{ scaleType: "point", data: xLabels }]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Sản phẩm bán chạy">
            <Column {...lineConfig} />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12} style={{ height: "400px" }}>
          <Card title="Số đơn hàng tháng so với cùng kỳ">
            <LineChart
              width={500}
              height={300}
              series={[
                { data: orderNew, label: "Tháng này" },
                { data: orderOld, label: "Tháng trước" },
              ]}
              xAxis={[{ scaleType: "point", data: xLabels }]}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Nhân viên bán chạy">
            <Column {...lineConfigStart} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Report;
