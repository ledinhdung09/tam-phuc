import { Table, Typography, Row, Col, Divider, Flex } from "antd";
import { useEffect } from "react";

const { Title, Text } = Typography;

const Bill = (props) => {
  useEffect(() => {
    console.log(props);
  });

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
      {(props.name || props.address || props.phone) && (
        <Row
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          {props.name || props.address || props.phone ? (
            <Col span={12}>
              {props.name && <Title level={5}>Người nhận: {props.name}</Title>}
              <Text>
                {props.address && (
                  <>
                    Địa chỉ: {props.address} <br />
                  </>
                )}
                {props.phone && <>Điện thoại: {props.phone}</>}
              </Text>
            </Col>
          ) : null}
          <Col span={12}>
            <Title level={5}>Công ty:</Title>
            <Text>
              CÔNG TY TNHH TM DV IN ẤN TÂM PHÚC <br />
              Địa chỉ: 60 Lê Quyên, Phường 4, Quận 8, TP. HCM <br />
              MST: 0315389943
            </Text>
          </Col>
        </Row>
      )}
      <Divider />

      {/* Bảng sản phẩm */}
      {props.data && props.data.length > 0 && (
        <table border="1" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th width={50}>STT</th>
              <th width={100}>Sản phẩm</th>
              <th width={200}>Mô tả</th>
              <th width={100}>Hình</th>
              <th width={50}>ĐVT</th>
              <th width={50}>Số lượng</th>
              <th width={100}>Đơn giá</th>
              <th width={100}>Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {props.data.map((item, index) => (
              <tr key={index}>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.productDetails?.name || item.productDetail?.name || ""}
                </td>
                <td
                  style={{
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{ fontSize: 12, color: "#666", marginTop: 4 }}
                    dangerouslySetInnerHTML={{
                      __html:
                        item.productDetails?.notes?.replace(/\n/g, "<br>") ||
                        item.productDetail?.notes?.replace(/\n/g, "<br>") ||
                        "",
                    }}
                  ></div>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  <img
                    style={{
                      width: "50px",
                      height: "50px",
                      margin: "1rem",
                    }}
                    src={
                      item.image
                        ? `https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/${item.image}`
                        : ""
                    }
                  ></img>
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.unit || ""}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.quantity || "0"}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.unitPrice || "0"}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {item.totalPrice || "0"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bill;
