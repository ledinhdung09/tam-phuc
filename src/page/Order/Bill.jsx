import { Typography, Row, Col, Divider } from "antd";
import { useEffect } from "react";

const { Title, Text } = Typography;

const Bill = (props) => {
  useEffect(() => {
    console.log(props);
  });

  const convertToWords = (amount) => {
    if (!amount || isNaN(amount)) return "Không hợp lệ";

    const units = ["", "ngàn", "triệu", "tỷ"];
    const digits = [
      "không",
      "một",
      "hai",
      "ba",
      "bốn",
      "năm",
      "sáu",
      "bảy",
      "tám",
      "chín",
    ];

    let result = "";
    let unitIndex = 0;

    while (amount > 0) {
      let group = amount % 1000; // Lấy 3 chữ số cuối
      if (group > 0) {
        let groupText = "";
        let hundreds = Math.floor(group / 100); // Lấy hàng trăm
        let tens = Math.floor((group % 100) / 10); // Lấy hàng chục
        let ones = group % 10; // Lấy hàng đơn vị

        // Xử lý hàng trăm
        if (hundreds > 0) {
          groupText += `${digits[hundreds]} trăm `;
        }

        // Xử lý hàng chục và đơn vị
        if (tens > 1) {
          groupText += `${digits[tens]} mươi `;
          if (ones > 0) {
            groupText += digits[ones];
          }
        } else if (tens === 1) {
          groupText += "mười ";
          if (ones > 0) {
            groupText += digits[ones];
          }
        } else if (ones > 0) {
          groupText += digits[ones];
        }

        groupText = groupText.trim();
        result = `${groupText} ${units[unitIndex]} ${result}`.trim();
      }

      amount = Math.floor(amount / 1000); // Loại bỏ 3 chữ số cuối
      unitIndex++;
    }

    return result + " đồng";
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "0 ₫";
    return `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định"; // Xử lý trường hợp null/undefined

    try {
      const date = new Date(dateString); // Chuyển chuỗi thành Date
      if (isNaN(date)) throw new Error("Invalid date"); // Kiểm tra nếu date không hợp lệ

      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    } catch {
      return "Định dạng ngày không hợp lệ"; // Xử lý lỗi
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      {/* Thông báo */}
      <div
        style={{
          backgroundColor: "#009966",
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
        <Col
          span={12}
          style={{
            paddingLeft: "5rem",
          }}
        >
          <Title level={4}>CÔNG TY TNHH TM DV IN ẤN TÂM PHÚC</Title>
          <Text>
            Địa chỉ: 60 Lê Quyên, Phường 4, Quận 8, TP.HCM <br />
            MST: 0315389943
          </Text>
        </Col>
        <Col span={12} style={{ textAlign: "left", paddingRight: "10rem" }}>
          <Title level={4}>PHIẾU ĐẶT HÀNG / HỢP ĐỒNG</Title>
          <Text>
            Mã ĐH: #{props.orderId} <br />
            Ngày đặt hàng: {formatDate(props.order_date?.split(" ")[0])} <br />
            Ngày nhận hàng: {formatDate(props.order_date1)}
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
            paddingBottom: "2rem",
            paddingTop: "1rem",
          }}
        >
          <Col
            span={12}
            style={{
              paddingLeft: "5rem",
            }}
          >
            <Title
              style={{
                marginBottom: "15px",
              }}
              level={4}
            >
              THÔNG TIN NGƯỜI ĐẶT HÀNG
            </Title>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: "15px",
                display: "block",
              }}
            >
              Người đặt: {props.name}
            </Text>
            <Text
              style={{
                display: "block",
                marginBottom: "15px",
              }}
            >
              Điện thoại: {props.phone}
            </Text>
            <Text style={{ display: "block", marginBottom: "15px" }}>
              Email: {props.email}
            </Text>
            <Text style={{ display: "block", marginBottom: "15px" }}>
              Công ty: {props.company_name}
            </Text>
            <Text style={{ display: "block", marginBottom: "15px" }}>
              Mã số thuế: {props.tax_code}
            </Text>
            <Text style={{ display: "block", marginBottom: "15px" }}>
              Địa chỉ: {props.address}
            </Text>
          </Col>

          <Col
            span={12}
            style={{
              paddingRight: "20rem",
            }}
          >
            <Title
              style={{
                marginBottom: "15px",
              }}
              level={4}
            >
              THÔNG TIN NGƯỜI NHẬN HÀNG
            </Title>
            <Text
              style={{
                fontWeight: 600,
                marginBottom: "15px",
                display: "block",
              }}
            >
              Người nhận: {props.name1}
            </Text>
            <Text style={{ display: "block", marginBottom: "15px" }}>
              Điện thoại: {props.phone1}
            </Text>
            <Text style={{ display: "block", marginBottom: "15px" }}>
              Địa chỉ: {props.address1}
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
                  {formatCurrency(item.unitPrice) ||
                    formatCurrency(item.pricePrint) ||
                    "0"}
                </td>
                <td
                  style={{
                    textAlign: "center",
                  }}
                >
                  {formatCurrency(item.totalPrice) || "0"}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                colSpan="6"
                rowSpan="6"
                style={{
                  textAlign: "left",
                  padding: "10px",
                  verticalAlign: "top", // Đảm bảo nội dung căn chỉnh đúng
                }}
              >
                <strong>Cộng thành tiền (viết bằng chữ):</strong>
                <br /> {convertToWords(props.remainingAmount)}
              </td>
              <td style={{ textAlign: "right", padding: "10px" }}>
                Khuyến mãi:
              </td>
              <td style={{ textAlign: "right", padding: "10px" }}>
                {formatCurrency(props.discount)}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right", padding: "10px" }}>
                Chi phí giao hàng:
              </td>
              <td style={{ textAlign: "right", padding: "10px" }}>
                {formatCurrency(
                  props.order_ship === undefined ? "0" : props.order_ship
                )}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right", padding: "10px" }}>VAT:</td>
              <td style={{ textAlign: "right", padding: "10px" }}>
                {props.vat}
              </td>
            </tr>
            <tr>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                Tổng cộng:
              </td>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(props.totalAmount)}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right", padding: "10px" }}>Đặt cọc:</td>
              <td style={{ textAlign: "right", padding: "10px" }}>
                {formatCurrency(props.deposit)}
              </td>
            </tr>
            <tr>
              <td style={{ textAlign: "right", padding: "10px" }}>Còn lại:</td>
              <td
                style={{
                  textAlign: "right",
                  padding: "10px",
                  fontWeight: "bold",
                }}
              >
                {formatCurrency(props.remainingAmount)}
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
};

export default Bill;
