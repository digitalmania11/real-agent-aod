import axios from "axios";


const axiosSecure = axios.create({
    baseURL: 'https://api.wemofy.in'
})

const useAxiosSecure = () => {
    return axiosSecure
};

export default useAxiosSecure;