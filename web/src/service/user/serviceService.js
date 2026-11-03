import axios from "axios";
import API_URL from "../../config";

const getAllServices = async () => {
  const response = await axios.get(`${API_URL}/api/service/all`);
  return response.data;
};

const getServiceSubTypes = async () => {
  const response = await axios.get(`${API_URL}/api/serviceSubTypes`);
  return response.data;
};

export default {
  getAllServices,
  getServiceSubTypes,
};
