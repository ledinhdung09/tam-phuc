import { Layout, Table, notification, theme } from "antd";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { getDataOrdersAPI } from "../../apis/handleDataAPI";

const { Content } = Layout;

function OrderPrinting() {
  const [dataValue, setDataValue] = useState([]);
  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const res = await getDataOrdersAPI(token, 1, 10);
      console.log(res);
      const orders = res.data.data;

      // Lọc các order có order_status = 2
      const filteredOrders = orders.filter((order) => order.order_status == 1);

      const transformedData = filteredOrders.map((item) => ({
        key: item.order_id,
        id: item.order_id,
        revenue: item.total,
        datetime: item.order_date,
        actprocessing_staffion: item.processing_employee,
        file_processing_design: item.design_confirm_employee,
        status: item.status_name,
        vat: "Xem hóa đơn",
      }));
      setDataValue(transformedData);
      console.log("Orders with status 2: ", filteredOrders);
    } catch (error) {
      console.log(error);
    }
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const location = useLocation();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetchData();
    if (location.state?.message) {
      api.success({
        message: "Thông báo",
        description: location.state.message,
      });
    }
  }, [location.state]);

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Doanh thu",
      dataIndex: "revenue",
      key: "revenue",
      render: (text) => (
        <div style={{ whiteSpace: "normal" }}>
          {text.split("  ").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Thời gian",
      dataIndex: "datetime",
      key: "datetime",
      render: (text) => (
        <div style={{ whiteSpace: "normal" }}>
          {text.split("  ").map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </div>
      ),
    },
    {
      title: "Tình trạng",
      key: "status",
      dataIndex: "status",
      render: (status) => {
        let color;
        switch (status) {
          case "1":
            color = "orange";
            break;
          case "2":
            color = "blue";
            break;
          case "3":
            color = "green";
            break;
          case "4":
            color = "red";
            break;
          default:
            color = "black";
        }
        return <span style={{ color }}>{status}</span>;
      },
    },
    {
      title: "Nhân viên xử lý",
      key: "actprocessing_staffion",
      dataIndex: "actprocessing_staffion",
    },
    {
      title: "Thiết kế xử lý file",
      key: "file_processing_design",
      dataIndex: "file_processing_design",
    },
    {
      title: "Hóa đơn VAT",
      key: "vat",
      dataIndex: "vat",
      render: (text, record) => (
        <Link to={`edit-dat-hang-nha-in/${record.id}`}>{text}</Link>
      ),
    },
  ];

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        overflow: "auto",
      }}
    >
      {contextHolder}
      <Table columns={columns} dataSource={dataValue} pagination={false} />
    </Content>
  );
}

export default OrderPrinting;
