import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  getDataCustomerIdAPI,
  getDataOrdersByIdAPI,
  getDataProductByIdAPI,
} from "../../apis/handleDataAPI";
import {
  Page,
  Text,
  View,
  Document,
  Font,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const BillOrder = () => {
  const location = useLocation();
  const props = location.state || {};

  const [mainTableData, setMainTableData] = useState([]);
  const [dataProducts, setDataProducts] = useState([]);
  const [dataOrder, setDataOrder] = useState(null);
  const [dataCustomer, setDataCustomer] = useState(null);

  useEffect(() => {
    const fetchDataOrderById = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const response = await getDataOrdersByIdAPI(token, props.orderId);
        const order = response.data.order;

        if (!order) {
          console.error("No order data found.");
          return;
        }

        setDataOrder(order);

        const productDetails = JSON.parse(order.product_details || "[]");

        if (!Array.isArray(productDetails)) {
          console.error("Invalid product details format.");
          return;
        }
        setDataProducts(productDetails);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };

    if (props.orderId) fetchDataOrderById();
  }, [props.orderId]);

  useEffect(() => {
    if (dataProducts.length > 0) {
      const fetchProductDetails = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const formattedData = await Promise.all(
            dataProducts.map(async (product) => {
              const response = await getDataProductByIdAPI(
                token,
                product.product_code
              );
              const productData = response.data.product;
              return {
                key: productData.id,
                productDetails: {
                  name: productData.product_name || "",
                  notes: productData.notes || "",
                },
                image: product.avatar,
                unit: productData.rules || "",
                quantity: product.quantity || 1,
                unitPrice: product.price || 0,
                totalPrice:
                  (product.quantity || 0) * (product.price || 0) +
                  parseFloat(product.plus_price || 0),
                multiple_pricing: productData.multiple_pricing,
                plusPrice: product.plus_price,
                fileList: product.avatar
                  ? [
                      {
                        uid: "-1",
                        name: "image.png",
                        url:
                          "https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/" +
                          product.avatar,
                      },
                    ]
                  : [],
              };
            })
          );
          setMainTableData(formattedData);
        } catch (error) {
          console.error("Error fetching product details:", error);
        }
      };
      fetchProductDetails();
    }
  }, [dataProducts]);

  useEffect(() => {
    if (dataOrder && dataOrder.customer_id) {
      const fetchCustomerData = async () => {
        try {
          const token = localStorage.getItem("authToken");
          const response = await getDataCustomerIdAPI(
            token,
            dataOrder.customer_id
          );
          const customer = response.data.data;
          setDataCustomer(customer);
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
      };
      fetchCustomerData();
    }
  }, [dataOrder]);

  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 3000); // Chờ 3 giây
    return () => clearTimeout(timer); // Dọn dẹp timer khi component bị unmount
  }, []);

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
      let group = amount % 1000;
      if (group > 0) {
        let groupText = "";
        let hundreds = Math.floor(group / 100);
        let tens = Math.floor((group % 100) / 10);
        let ones = group % 10;

        if (hundreds > 0) {
          groupText += `${digits[hundreds]} trăm `;
        }

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

        result = `${groupText.trim()} ${units[unitIndex]} ${result}`.trim();
      }

      amount = Math.floor(amount / 1000);
      unitIndex++;
    }

    return result + " đồng";
  };

  const formatCurrency = (amount) => {
    return amount
      ? `${amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} ₫`
      : "0 ₫";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Không xác định";
    try {
      const date = new Date(dateString);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } catch {
      return "Định dạng ngày không hợp lệ";
    }
  };

  Font.register({
    family: "Roboto",
    fonts: [
      {
        src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf",
      }, // Regular
      {
        src: "http://fonts.gstatic.com/s/roboto/v16/zN7GBFwfMP4uA6AR0HCoLQ.ttf",
        fontWeight: 700,
      }, // Bold
    ],
  });

  const styles = StyleSheet.create({
    page: {
      fontSize: 10,
      padding: 20,
      lineHeight: 1.5,
    },
    header: {
      backgroundColor: "#009966",
      color: "#ffffff",
      padding: 10,
      marginBottom: 20,
      textAlign: "center",
    },
    title: {
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 10,
    },
    table: {
      display: "table",
      width: "100%",
      borderCollapse: "collapse",
    },
    tableRow: {
      flexDirection: "row",
    },
    tableCell: {
      border: "1px solid #000",
      padding: 5,
      textAlign: "center",
    },
    textBold: {
      fontWeight: "bold",
    },
    row: {
      display: "flex",
    },
  });

  const InvoicePDF = () => (
    <Document>
      <Page style={styles.page} orientation="landscape">
        <View>
          {isReady ? (
            (console.log(dataCustomer),
            (
              <View>
                {/* Thông báo */}
                <View
                  style={{
                    backgroundColor: "#009966",
                    padding: 10,
                    marginBottom: 20,
                  }}
                >
                  <Text style={{ color: "#ffffff", fontFamily: "Roboto" }}>
                    - Quý khách vui lòng kiểm tra thông tin và thanh toán trước
                    50% số tiền của đơn hàng. <br />- Đơn hàng của quý khách sẽ
                    được tiến hành sau khi nhận đủ tiền. <br />- Ngày có hàng sẽ
                    được bắt đầu tính từ lúc nhận được thông báo có tiền.
                  </Text>
                </View>

                <View style={styles.row}>
                  <View>
                    <Text>CÔNG TY TNHH TM DV IN ẤN TÂM PHÚC</Text>
                    <Text>
                      Địa chỉ: 60 Lê Quyên, Phường 4, Quận 8, TP.HCM <br />
                      MST: 0315389943
                    </Text>
                  </View>{" "}
                  <View>
                    <Text level={4}>PHIẾU ĐẶT HÀNG / HỢP ĐỒNG</Text>
                    <Text>
                      Mã ĐH: #{dataOrder?.order_id || "Không xác định"} <br />
                      Ngày đặt hàng:
                      {formatDate(dataOrder?.order_date?.split(" ")[0])} <br />
                      Ngày nhận hàng:
                      {formatDate(dataOrder?.estimated_delivery_date)}
                    </Text>
                  </View>
                </View>
                {/* Thông tin khách hàng */}

                <Text level={4}>THÔNG TIN NGƯỜI ĐẶT HÀNG</Text>
                <Text level={5}>
                  {dataCustomer?.customer_name || "Không xác định"}
                </Text>
                <Text>
                  Điện thoại: {dataCustomer?.phone || "Không xác định"} <br />
                  Email: {dataCustomer?.company_email || "Không xác định"}
                  <br />
                  Công ty: {dataCustomer?.company_name || "Không xác định"}
                  <br />
                  Mã số thuế: {dataCustomer?.tax_code || "Không xác định"}
                  <br />
                  Địa chỉ:
                  {`${dataCustomer?.address || ""} ${
                    dataCustomer?.ward || ""
                  } ${dataCustomer?.district || ""} ${
                    dataCustomer?.city || ""
                  }`.trim() || "Không xác định"}
                </Text>
                <Text level={4}>THÔNG TIN NGƯỜI NHẬN HÀNG</Text>
                {dataOrder?.recipient_name && (
                  <Text level={5}>Người nhận: {dataOrder?.recipient_name}</Text>
                )}
                <Text>
                  {dataOrder?.recipient_phone && (
                    <>
                      Điện thoại: {dataOrder?.recipient_phone} <br />
                    </>
                  )}
                  {dataOrder?.delivery_address && (
                    <>Địa chỉ: {dataOrder?.delivery_address}</>
                  )}
                </Text>
                {/* Bảng sản phẩm */}
                {mainTableData && mainTableData.length > 0 && (
                  <table
                    border="1"
                    style={{ width: "100%", borderCollapse: "collapse" }}
                  >
                    <thead>
                      <tr>
                        <th width={50}>
                          <Text> STT</Text>
                        </th>
                        <th width={100}>
                          <Text>Sản phẩm</Text>
                        </th>
                        <th width={200}>
                          <Text>Mô tả</Text>
                        </th>
                        <th width={100}>
                          <Text>Hình</Text>
                        </th>
                        <th width={50}>
                          <Text>ĐVT</Text>
                        </th>
                        <th width={50}>
                          <Text>Số lượng</Text>
                        </th>
                        <th width={100}>
                          <Text>Đơn giá</Text>
                        </th>
                        <th width={100}>
                          <Text>Thành tiền</Text>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {mainTableData.map((item, index) => (
                        <tr key={index}>
                          <td style={{ textAlign: "center" }}>
                            <Text>{index + 1}</Text>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Text>
                              {item.productDetails?.name || "Không xác định"}
                            </Text>
                          </td>
                          <td style={{ textAlign: "left" }}>
                            <Text>
                              {item.productDetails?.notes || "Không có mô tả"}
                            </Text>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <img
                              style={{
                                width: "50px",
                                height: "50px",
                                margin: "1rem",
                              }}
                              src={item.image || ""}
                              alt="Product"
                            />
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Text>{item.unit || ""}</Text>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Text> {item.quantity || 0}</Text>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Text> {formatCurrency(item.unitPrice)}</Text>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <Text> {formatCurrency(item.totalPrice)}</Text>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td
                          colSpan="6"
                          style={{ textAlign: "left", padding: "10px" }}
                        >
                          <Text>Cộng thành tiền (viết bằng chữ):</Text>
                          <br />
                          <Text> {convertToWords(dataOrder?.total)}</Text>
                        </td>
                        <td style={{ textAlign: "right", padding: "10px" }}>
                          <Text>Tổng cộng:</Text>
                        </td>
                        <td style={{ textAlign: "right", padding: "10px" }}>
                          <Text>{formatCurrency(dataOrder?.totalAmount)}</Text>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                )}
              </View>
            ))
          ) : (
            <Text
              style={{
                fontFamily: "Roboto",
              }}
            >
              Đang tải dữ liệu...
            </Text>
          )}
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <div style={{ width: "100%", height: "600px" }}>
        <PDFViewer style={{ width: "100%", height: "100%" }}>
          <InvoicePDF />
        </PDFViewer>
      </div>
    </>
  );
};

export default BillOrder;
