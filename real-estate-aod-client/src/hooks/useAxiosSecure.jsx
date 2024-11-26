import axios from "axios";


const axiosSecure = axios.create({
    baseURL: 'http://realagent-aod.api.wemofy.in'
})

const useAxiosSecure = () => {
    return axiosSecure
};

export default useAxiosSecure;