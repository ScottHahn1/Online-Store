import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";

const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  } catch (err) {
    console.log(err);
  }
};

const useAuth = () => {
  return useQuery({
    queryKey: ['auth'],
    queryFn: fetchUser,
    retry: false
  })
};

export default useAuth;