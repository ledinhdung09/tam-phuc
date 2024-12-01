import axios from "axios";

const axiosClient = axios.create({
  //baseURL: "http://localhost/Backend-API-Print-Shop/api/",
  //baseURL: "https://hcrm.online/public/tamphuc/api",
  baseURL: "https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;