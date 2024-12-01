import { Row, Col, Card, Statistic, Button } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import { Line, Column } from "@ant-design/plots"; // Nếu dùng biểu đồ, có thể sử dụng thư viện @ant-design/plots

const Report = () => {
  const data = [
    { type: "Sản phẩm 1", sales: 40 },
    { type: "Sản phẩm 2", sales: 30 },
    { type: "Sản phẩm 3", sales: 25 },
    { type: "Sản phẩm 4", sales: 20 },
    { type: "Sản phẩm 5", sales: 15 },
    { type: "Sản phẩm 6", sales: 10 },
  ];
  const dataStart = [
    { type: "Nguyễn Văn A", sales: 40 },
    { type: "Nguyễn Văn B", sales: 30 },
    { type: "Nguyễn Văn C", sales: 25 },
    { type: "Nguyễn Văn D", sales: 20 },
  ];

  const lineConfigStart = {
    data: dataStart,
    height: 300,
    xField: "type",
    yField: "sales",
    style: {
      fill: "green",
    },
    autoFit: true,
  };

  const lineConfig = {
    data,
    forceFit: true,
    xField: "type",
    yField: "sales",
    height: 300,
    style: {
      fill: "green",
    },
    autoFit: true,
  };
  const line = {
    data,
    forceFit: true,
    xField: "type",
    yField: "sales",
    height: 300,
    autoFit: true,
  };

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
              value={30}
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
              value={32000000}
              suffix="đ"
              valueStyle={{ color: "#3f8600", fontWeight: "bold" }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="Lợi nhuận"
              value={12000000}
              suffix="đ"
              valueStyle={{ color: "#cf1322", fontWeight: "bold" }}
            />
          </Col>
        </Row>

        <Col style={{ textAlign: "right", marginTop: 16, marginRight: 0 }}>
          <Button icon={<CalendarOutlined />}>Tháng này</Button>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Doanh số tháng so với cùng kỳ">
            <Line {...line} />
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
            <Line {...line} />
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
