import { useEffect, useState } from "react";
import { Button, Layout, Pagination, Table, Tabs, theme } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getDataOrdersAPI } from "../../apis/handleDataAPI";

const { Content } = Layout;

function Order() {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState("1"); // Track active tab
  const [data, setData] = useState([]);
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
            <div key={index}>
              {new Intl.NumberFormat("vi-VN").format(item)} đ{" "}
            </div>
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
          case "Đang báo giá":
            color = "orange";
            break;
          case "Đang in":
            color = "blue";
            break;
          case "Đã hoàn thành":
            color = "green";
            break;
          case "Đã hủy":
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
        <Link to={`edit-don-hang/${record.id}`}>{text}</Link>
      ),
    },
  ];
  const fetchData = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await getDataOrdersAPI(token, 1, 10);
      console.log(response);
      const filteredOrders = response.data.data.filter(
        (order) => order.order_status == 1
      );
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
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching the data. Please try again.");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);

  const items = [
    {
      key: "1",
      label: (
        <Button
          style={{
            backgroundColor: activeKey === "1" ? "#348F63" : undefined,
            color: activeKey === "1" ? "#fff" : undefined,
          }}
        >
          Tất cả đơn hàng
        </Button>
      ),
      children: (
        <>
          <Table columns={columns} dataSource={data} pagination={false} />
          {/* <Pagination
            align="center"
            style={{
              paddingTop: 10,
            }}
            pageSize={10}
            defaultCurrent={1}
            total={300}
            showSizeChanger={false}
            showLessItems
          /> */}
        </>
      ),
    },
  ];

  const onChange = () => {
    navigate("them-don-hang"); // Navigate to the "Thêm đơn hàng" route
  };

  return (
    <Content
      style={{
        margin: "24px 16px",
        padding: 24,
        background: colorBgContainer,
        borderRadius: borderRadiusLG,
        overflow: "auto",
        position: "relative",
      }}
    >
      <Button
        style={{
          backgroundColor: "green",
          color: "white",
          position: "absolute",
          right: "30px",
          zIndex: "999",
        }}
        type="primary"
        onClick={onChange}
      >
        Thên đơn hàng
      </Button>
      <Tabs
        activeKey={activeKey} // Bind activeKey to state
        style={{ paddingTop: 0 }}
        items={items}
      />
    </Content>
  );
}

export default Order;
