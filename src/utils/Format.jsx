// hàm format tiền 
export const getCurrency = (money) => {
  return new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0, // Không có số thập phân
  }).format(Number(money)) + " đ";
}
// Hàm xử lý ngày tháng
export const formatDate = (dateString) => {
    if (!dateString) return "Không xác định"; // Xử lý nếu dateString là null hoặc undefined
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`; // Định dạng dd/mm/yyyy
  };