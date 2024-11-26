import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "https://api.wemofy.in",
})
const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;
