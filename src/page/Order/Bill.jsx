import { Table, Typography, Row, Col, Divider } from "antd";

const { Title, Text } = Typography;

const Bill = (props) => {
  const columns = [
    {
      title: "STT",
      dataIndex: "stt",
      key: "stt",
    },
    {
      title: "Sản phẩm",
      dataIndex: "product",
      key: "product",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Hình",
      dataIndex: "image",
      key: "image",
      render: (text) => <img src={text} alt="product" style={{ width: 80 }} />,
    },
    {
      title: "ĐVT",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Thành tiền",
      dataIndex: "total",
      key: "total",
    },
  ];

  const data = [
    {
      key: "1",
      stt: "1",
      product: "Bao thư 22 x 12",
      description: "Kích thước: 22 x 12 cm (Nắp 3.5 cm)",
      image: "https://via.placeholder.com/80", // Replace with your image URL
      unit: "Cái",
      quantity: 200,
      price: "1,550",
      total: "310,000",
    },
  ];

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* Thông báo */}
      <div
        style={{
          backgroundColor: "#0099cc",
          color: "#fff",
          padding: 10,
          marginBottom: 20,
        }}
      >
        <Text>
          - Quý khách vui lòng kiểm tra thông tin và thanh toán trước 50% số
          tiền của đơn hàng. <br />- Đơn hàng của quý khách sẽ được tiến hành
          sau khi nhận đủ tiền. <br />- Ngày có hàng sẽ được bắt đầu tính từ lúc
          nhận được thông báo có tiền.
        </Text>
      </div>

      {/* Header */}
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col span={12}>
          <Title level={4}>SONG TẠO</Title>
          <Text>
            Địa chỉ: 84A Đường 25, P. Tân Quy, Q. 7, TP. HCM <br />
            Điện thoại: (028) 7100 0707 - 7306 0707 <br />
            Nhân viên: Phạm Tuấn Kiệt
          </Text>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Title level={4}>PHIẾU ĐẶT HÀNG / HỢP ĐỒNG</Title>
          <Text>
            Mã ĐH: WF-061924-144 <br />
            Ngày nhận: 19/06/2024 <br />
            Ngày có hàng tại CN: 21/06/2024
          </Text>
        </Col>
      </Row>
      <Divider />

      {/* Thông tin khách hàng */}
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col span={12}>
          <Title level={5}>Người nhận: {props.name}</Title>
          <Text>
            Địa chỉ: 60 Lê Quyên <br />
            Điện thoại: 0932768122
          </Text>
        </Col>
        <Col span={12}>
          <Title level={5}>Công ty:</Title>
          <Text>
            CÔNG TY TNHH TM DV IN ẤN TÂM PHÚC <br />
            Địa chỉ: 60 Lê Quyên, Phường 4, Quận 8, TP. HCM <br />
            MST: 0315389943
          </Text>
        </Col>
      </Row>
      <Divider />

      {/* Bảng sản phẩm */}
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        summary={() => (
          <>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>Khuyến mãi</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>15,500</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>VAT</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>23,560</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>Tổng cộng</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>318,060</Table.Summary.Cell>
            </Table.Summary.Row>
            <Table.Summary.Row>
              <Table.Summary.Cell colSpan={6}>Đặt cọc</Table.Summary.Cell>
              <Table.Summary.Cell colSpan={2}>50%</Table.Summary.Cell>
            </Table.Summary.Row>
          </>
        )}
      />
    </div>
  );
};

export default Bill;
