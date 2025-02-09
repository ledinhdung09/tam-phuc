import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://lumiaicreations.com/tam-phuc/Backend-API-Print-Shop/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
