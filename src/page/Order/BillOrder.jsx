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
  Image,
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

  function capitalizeFirstLetter(sentence) {
    if (!sentence) return "";
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  Font.register({
    family: "Noto Sans",
    fonts: [
      {
        src: "/font/NotoSans-Regular.ttf", // Regular
      },
      {
        src: "https://fonts.gstatic.com/s/notosans/v27/o-0NIpQlx3QUlC5A4PNb4ixA1LVt-47mUoyk.ttf", // Bold
        fontWeight: "bold",
      },
    ],
  });

  const styles = StyleSheet.create({
    page: {
      fontFamily: "Noto Sans", // Cập nhật font family
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
      flexDirection: "row",
      justifyContent: "space-between",
      paddingRight: 50,
    },
  });

  const InvoicePDF = () => (
    <Document title={`Hóa đơn #${props.orderId}`}>
      <Page orientation="landscape">
        <View style={styles.page}>
          {isReady ? (
            (console.log(mainTableData),
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
                  <View>
                    <Text>
                      - Quý khách vui lòng kiểm tra thông tin và thanh toán
                      trước 50% số tiền của đơn hàng.
                    </Text>
                    <Text>
                      - Đơn hàng của quý khách sẽ được tiến hành sau khi nhận đủ
                      tiền.
                    </Text>
                    <Text>
                      - Ngày có hàng sẽ được bắt đầu tính từ lúc nhận được thông
                      báo có tiền.
                    </Text>
                  </View>
                </View>

                <View style={styles.row}>
                  <View>
                    <Text>CÔNG TY TNHH TM DV IN ẤN TÂM PHÚC</Text>
                    <View>
                      <Text>
                        Địa chỉ: 60 Lê Quyên, Phường 4, Quận 8, TP.HCM
                      </Text>
                      <Text>MST: 0315389943</Text>
                    </View>
                  </View>
                  <View style={{ marginBottom: 20 }}>
                    <Text level={4}>PHIẾU ĐẶT HÀNG / HỢP ĐỒNG</Text>
                    <View>
                      <Text>
                        Mã ĐH: #{dataOrder?.order_id || "Không xác định"}
                      </Text>
                      <Text>
                        Ngày đặt hàng:
                        {formatDate(dataOrder?.order_date?.split(" ")[0])}
                      </Text>
                      <Text>
                        Ngày nhận hàng:
                        {formatDate(dataOrder?.estimated_delivery_date)}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Thông tin khách hàng */}
                <View style={styles.row}>
                  <View>
                    <Text level={4}>THÔNG TIN NGƯỜI ĐẶT HÀNG</Text>
                    <Text level={5}>
                      {dataCustomer?.customer_name || "Không xác định"}
                    </Text>
                    <View>
                      <Text>
                        Điện thoại: {dataCustomer?.phone || "Không xác định"}{" "}
                      </Text>
                      <Text>Email: {dataCustomer?.company_email || ""}</Text>
                      <Text>
                        Công ty:{" "}
                        {dataCustomer?.company_name || "Không xác định"}
                      </Text>
                      <Text>Mã số thuế: {dataCustomer?.tax_code || ""}</Text>
                      <Text>
                        Địa chỉ:
                        {` ${dataCustomer?.address || ""} ${
                          dataCustomer?.ward || ""
                        } ${dataCustomer?.district || ""} ${
                          dataCustomer?.city || ""
                        }`.trim() || "Không xác định"}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text level={4}>THÔNG TIN NGƯỜI NHẬN HÀNG</Text>
                    {dataOrder?.recipient_name && (
                      <Text level={5}>
                        Người nhận: {dataOrder?.recipient_name}
                      </Text>
                    )}
                    <View>
                      <Text>
                        {dataOrder?.recipient_phone && (
                          <>
                            Điện thoại: {dataOrder?.recipient_phone} <br />
                          </>
                        )}
                      </Text>
                      <Text>
                        {dataOrder?.delivery_address && (
                          <>Địa chỉ: {dataOrder?.delivery_address}</>
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
                {/* Bảng sản phẩm */}
                {mainTableData && mainTableData.length > 0 && (
                  <View
                    style={{
                      border: "1px solid black",
                      borderCollapse: "collapse",
                      marginTop: 10,
                    }}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        borderBottom: "1px solid black",
                      }}
                    >
                      <View
                        style={{
                          textAlign: "center",
                          width: 40,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>STT</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 100,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>Sản phẩm</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 200,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>Mô tả</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 100,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>Hình</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 50,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>ĐVT</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 50,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>Số lượng</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 100,
                          borderRight: "1px solid black",
                          padding: 5,
                        }}
                      >
                        <Text>Đơn giá</Text>
                      </View>
                      <View
                        style={{
                          textAlign: "center",
                          width: 100,
                          padding: 5,
                        }}
                      >
                        <Text>Thành tiền</Text>
                      </View>
                    </View>

                    <View>
                      {mainTableData.map((item, index) => (
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            borderBottom: "1px solid black",
                          }}
                          key={index}
                        >
                          <View
                            style={{
                              textAlign: "center",
                              width: 40,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            <Text>{index + 1}</Text>
                          </View>
                          <View
                            style={{
                              textAlign: "center",
                              width: 100,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            <Text>
                              {item.productDetails?.name || "Không xác định"}
                            </Text>
                          </View>
                          <View
                            style={{
                              textAlign: "left",
                              width: 200,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            <Text>
                              {item.productDetails?.notes || "Không có mô tả"}
                            </Text>
                          </View>
                          <View
                            style={{
                              textAlign: "center",
                              width: 100,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            {item.image ? (
                              <>
                                <Image
                                  src={{
                                    uri: `https://cors.bridged.cc/https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api${item.image}`,
                                  }}
                                  style={{
                                    width: 90,
                                    height: 90,
                                  }}
                                />
                              </>
                            ) : (
                              <Text>Chưa có hình</Text>
                            )}
                          </View>
                          <View
                            style={{
                              textAlign: "center",
                              width: 50,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            <Text>{item.unit || ""}</Text>
                          </View>
                          <View
                            style={{
                              textAlign: "center",
                              width: 50,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            <Text>{item.quantity || 0}</Text>
                          </View>
                          <View
                            style={{
                              textAlign: "center",
                              width: 100,
                              borderRight: "1px solid black",
                              padding: 5,
                            }}
                          >
                            <Text>{formatCurrency(item.unitPrice)}</Text>
                          </View>
                          <View
                            style={{
                              textAlign: "center",
                              width: 100,
                              padding: 5,
                            }}
                          >
                            <Text>{formatCurrency(item.totalPrice)}</Text>
                          </View>
                        </View>
                      ))}
                    </View>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        marginTop: 10,
                      }}
                    >
                      <View style={{ flex: 1, paddingLeft: 10 }}>
                        <Text>Cộng thành tiền (viết bằng chữ):</Text>
                        <Text>
                          {capitalizeFirstLetter(
                            convertToWords(dataOrder?.total)
                          )}
                        </Text>
                      </View>
                      <View
                        style={{
                          border: "1px solid black",
                          padding: 10,
                          flex: 1,
                        }}
                      >
                        <Text>Khuyến mãi:</Text>
                        <Text>Chi phí giao hàng:</Text>
                        <Text>VAT:</Text>
                        <Text>Tổng cộng:</Text>
                        <Text>Đặt cọc:</Text>
                        <Text>Còn lại:</Text>
                      </View>
                      <View
                        style={{
                          border: "1px solid black",
                          padding: 10,
                          flex: 1,
                        }}
                      >
                        <Text>{formatCurrency(dataOrder?.promotion)}</Text>
                        <Text>{formatCurrency(dataOrder?.price_ship)}</Text>
                        <Text>{dataOrder?.vat} %</Text>
                        <Text>
                          {formatCurrency(
                            parseInt(dataOrder?.total) +
                              parseInt(dataOrder?.deposit)
                          )}
                        </Text>
                        <Text>{formatCurrency(dataOrder?.deposit)}</Text>
                        <Text>{formatCurrency(dataOrder?.total)}</Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text>Nhà in Tâm Phúc đang tải dữ liệu...</Text>
          )}
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <div style={{ width: "100%", height: "600px" }}>
        <PDFViewer
          style={{ width: "100%", height: "100%", fontFamily: "Roboto" }}
        >
          <InvoicePDF />
        </PDFViewer>
      </div>
    </>
  );
};

export default BillOrder;
