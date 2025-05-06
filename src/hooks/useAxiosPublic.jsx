import axios from "axios";
// assignment12-silk.vercel.app
// http://localhost:5000

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_Render_Server_BaseURL,
  withCredentials: true,
})

const useAxiosPublic = () => {
  return axiosPublic
};

export default useAxiosPublic;
