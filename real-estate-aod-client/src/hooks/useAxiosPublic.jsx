import axios from "axios";

const axiosPublic = axios.create({
  baseURL: "http://realagent-aod.api.wemofy.in",
})
const useAxiosPublic = () => {
  return axiosPublic
}

export default useAxiosPublic;
