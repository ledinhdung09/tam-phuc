import axiosClient from "./axiosClient";

const END_POINT = {
  LOGIN: "login.php",

  CUSTOMER_ALL: "customer/get_customers.php",
  CUSTOMER_ADD: "customer/create_customer.php",
  CUSTOMER_UPDATE: "customer/update_customer.php",
  CUSTOMER_BY_ID: "customer/get_customer_by_id.php",
  CUSTOMER_DELETE_BY_ID: "customer/delete_customer.php",

  PRINT_ALL: "nhain/get_printers.php",
  PRINT_ADD: "nhain/add_printer.php",
  PRINT_UPDATE: "nhain/update_printer.php",
  PRINT_BY_ID: "nhain/get_printer_by_id.php",
  PRINT_DELETE_BY_ID: "nhain/delete_printer.php",

  CATEGORY: "cate/categories.php",

  ADD_STAFF: "register.php",
  ALL_STAFF: "get_all_accounts.php",
  STAFF_BY_ID: "get_account_by_id.php",
  UPDATE_STAFF: "update_account.php",

  PRODUCT: "product/qlsp.php",
  PRODUCT_ALL: "product/show_products.php",
  PRODUCT_BY_ID: "product/show_product_by_id.php",

  ORDER_ALL: "order/get_orders.php",
  ORDER_ID: "order/get_order.php",
  ORDER_ADD: "order/create_order.php",
  ORDER_UPDATE: "order/update_order.php",
  ORDER_UPDATE_DETAIL: "order/update_detail_order.php",
  ORDER_UPDATE_STATUS: "order/update_order_status.php",

  GET_QUANTITY: "product/get_quatity_product.php",
};

export const updateOrdersStatusAPI = (
  session_token,
  order_id,
  order_status
) => {
  console.log(session_token);
  console.log(order_id);
  return axiosClient.post(END_POINT.ORDER_UPDATE_STATUS, {
    session_token: session_token,
    order_id: order_id,
    order_status: order_status,
  });
};

export const updateOrdersAPI = (data) => {
  console.log(data);
  return axiosClient.post(END_POINT.ORDER_UPDATE_DETAIL, {
    session_token: data.session_token,
    product_details: data.product_details,
    order_id: data.order_id,
  });
};

export const getDataStaffIdAPI = (session_token, user_id) => {
  return axiosClient.post(END_POINT.STAFF_BY_ID, {
    session_token,
    user_id,
  });
};

export const getQuantityProductAPI = (session_token, quantity, product_id) => {
  return axiosClient.post(
    `${END_POINT.GET_QUANTITY}?session_token=${session_token}&quantity=${quantity}&product_id=${product_id}`
  );
};

export const updateDataOrdersAPI = (data) => {
  console.log(data);
  return axiosClient.post(END_POINT.ORDER_UPDATE, {
    session_token: data.session_token,
    customer_id: data.customer_id,
    recipient_name: data.recipient_name,
    recipient_phone: data.recipient_phone,
    delivery_address: data.delivery_address,
    order_status: data.order_status,
    notes: data.notes,
    product_details: data.product_details,
    processing_employee_id: data.processing_employee_id,
    design_confirm_employee_id: data.design_confirm_employee_id,
    estimated_delivery_date: data.estimated_delivery_date,
    total: data.total,
    vat: data.vat,
    deposit: data.deposit,
    promotion: data.promotion,
    order_id: data.order_id,
  });
};

export const postDataOrdersAPI = (data) => {
  console.log(data);
  return axiosClient.post(END_POINT.ORDER_ADD, {
    session_token: data.session_token,
    customer_id: data.customer_id,
    recipient_name: data.recipient_name,
    recipient_phone: data.recipient_phone,
    delivery_address: data.delivery_address,
    order_status: data.order_status,
    notes: data.notes,
    product_details: data.product_details,
    processing_employee_id: data.processing_employee_id,
    design_confirm_employee_id: data.design_confirm_employee_id,
    estimated_delivery_date: data.estimated_delivery_date,
    total: data.total,
    vat: data.vat,
    deposit: data.deposit,
    promotion: data.promotion,
  });
};

export const getDataOrdersByIdAPI = (session_token, id) => {
  return axiosClient.post(END_POINT.ORDER_ID, {
    session_token: session_token,
    order_id: id,
  });
};

export const getDataOrdersAPI = (session_token, page, limit) => {
  console.log(session_token);
  console.log(page);
  console.log(limit);
  return axiosClient.post(END_POINT.ORDER_ALL, {
    session_token: session_token,
    page: page,
    limit: limit,
  });
};

export const deleteProductAPI = (token, productId) => {
  return axiosClient.delete(END_POINT.PRODUCT, {
    data: {
      session_token: token,
      id: productId,
    },
  });
};

export const postAddProductAPI = (data) => {
  console.log(data);
  return axiosClient.post(END_POINT.PRODUCT, {
    category_id: data.category_id,
    product_name: data.product_name,
    rules: data.rules,
    notes: data.notes,
    nhieuquycach: data.nhieuquycach,
    pricing: data.pricing,
    session_token: data.session_token,
    price: data.price,
    plusPrice: data.plusPrice,
  });
};

export const postEditProductAPI = (data) => {
  return axiosClient.put(END_POINT.PRODUCT, {
    id: data.id,
    category_id: data.category_id,
    product_name: data.product_name,
    rules: data.rules,
    notes: data.notes,
    price: data.price,
    plusPrice: data.plusPrice,
    nhieuquycach: data.nhieuquycach,
    pricing: data.pricing,
    session_token: data.session_token,
  });
};

export const getDataProductByIdAPI = (session_token, product_id) => {
  return axiosClient.get(
    `${END_POINT.PRODUCT_BY_ID}?session_token=${session_token}&product_id=${product_id}`
  );
};

export const getDataProductAPI = (session_token) => {
  return axiosClient.get(
    `${END_POINT.PRODUCT_ALL}?session_token=${session_token}`
  );
};

export const getAllStaffAPI = (session_token) => {
  return axiosClient.get(
    `${END_POINT.ALL_STAFF}?session_token=${session_token}`
  );
};

export const deleteStaffAPI = (data) => {
  return axiosClient.delete(END_POINT.CATEGORY, {
    data: {
      session_token: data.session_token,
      id: data.id,
    },
  });
};

export const postUpdateStaffAPI = (data) => {
  return axiosClient.put(END_POINT.UPDATE_STAFF, {
    session_token: data.session_token,
    user_id: data.id,
    username: data.username,
    password: data.password,
    permissions: data.permissions,
  });
};

export const postAddStaffAPI = (data) => {
  return axiosClient.post(END_POINT.ADD_STAFF, {
    username: data.username,
    password: data.password,
    permissions: data.permissions,
    session_token: data.session_token,
  });
};

export const getAllCategoryAPI = (session_token) => {
  return axiosClient.get(
    `${END_POINT.CATEGORY}?session_token=${session_token}`
  );
};

export const postAddCategoryAPI = (data) => {
  return axiosClient.post(END_POINT.CATEGORY, {
    session_token: data.session_token,
    category_name: data.category_name,
    description: data.description,
  });
};

export const deleteCategoryAPI = (data) => {
  return axiosClient.delete(END_POINT.CATEGORY, {
    data: {
      session_token: data.session_token,
      id: data.id,
    },
  });
};

export const postUpdateCategoryAPI = (data) => {
  return axiosClient.put(END_POINT.CATEGORY, {
    session_token: data.session_token,
    id: data.id,
    category_name: data.category_name,
    description: data.description,
  });
};

export const deletePrintIdAPI = (session_token, printer_id) => {
  return axiosClient.post(END_POINT.PRINT_DELETE_BY_ID, {
    session_token,
    printer_id,
  });
};

export const postUpdatePrintAPI = (
  address,
  city,
  company_name,
  district,
  email,
  note,
  phone,
  session_token,
  tax_code,
  ward,
  printer_id
) => {
  return axiosClient.post(END_POINT.PRINT_UPDATE, {
    address,
    city,
    company_name,
    district,
    email,
    note,
    phone,
    session_token,
    tax_code,
    ward,
    printer_id,
  });
};

export const getDataPrintIdAPI = (session_token, printer_id) => {
  return axiosClient.post(END_POINT.PRINT_BY_ID, {
    session_token,
    printer_id,
  });
};

export const postDataPrintAPI = (session_token, soluong, trang) => {
  return axiosClient.post(END_POINT.PRINT_ALL, {
    session_token,
    soluong,
    trang,
  });
};

export const postAddPrintAPI = (
  address,
  city,
  company_name,
  district,
  email,
  note,
  phone,
  session_token,
  tax_code,
  ward
) => {
  return axiosClient.post(END_POINT.PRINT_ADD, {
    address,
    city,
    company_name,
    district,
    email,
    note,
    phone,
    session_token,
    tax_code,
    ward,
  });
};

export const postDataCustomerAPI = (session_token) => {
  return axiosClient.post(END_POINT.CUSTOMER_ALL, {
    session_token,
  });
};

export const postAddCustomerAPI = (
  birth_year,
  customer_name,
  address,
  city,
  company_email,
  company_name,
  district,
  email,
  gender,
  note,
  phone,
  session_token,
  tax_code,
  ward
) => {
  return axiosClient.post(END_POINT.CUSTOMER_ADD, {
    birth_year,
    customer_name,
    address,
    city,
    company_email,
    company_name,
    district,
    email,
    gender,
    note,
    phone,
    session_token,
    tax_code,
    ward,
  });
};

export const postUpdateCustomerAPI = (
  birth_year,
  customer_name,
  address,
  city,
  company_email,
  company_name,
  district,
  email,
  gender,
  note,
  phone,
  session_token,
  tax_code,
  ward,
  customer_id
) => {
  return axiosClient.post(END_POINT.CUSTOMER_UPDATE, {
    birth_year,
    customer_name,
    address,
    city,
    company_email,
    company_name,
    district,
    email,
    gender,
    note,
    phone,
    session_token,
    tax_code,
    ward,
    customer_id,
  });
};

export const getDataCustomerIdAPI = (session_token, customer_id) => {
  return axiosClient.post(END_POINT.CUSTOMER_BY_ID, {
    session_token,
    customer_id,
  });
};

export const deleteCustomerIdAPI = (session_token, customer_id) => {
  return axiosClient.post(END_POINT.CUSTOMER_DELETE_BY_ID, {
    session_token,
    customer_id,
  });
};

export const postLoginAPI = (username, password) => {
  return axiosClient.post(END_POINT.LOGIN, {
    username,
    password,
  });
};
