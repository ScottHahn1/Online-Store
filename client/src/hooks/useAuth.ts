import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { useUserContext } from "../contexts/UserContext";
import { useEffect } from "react";

const refreshToken = async () => {
  try {
    const response = await axiosInstance.post('/api/users/refresh-token');
    return response.data.accessToken;
  } catch (error) {
    return error;
  }
}

const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me');
    return response.data;
  } catch (error: any) {
    if (error.response.status === 401) {
      const newToken = await refreshToken();
      if (newToken) {
        const response = await axiosInstance.get('/api/users/me');
        return response.data;
      }
    }
  }
};

const useAuth = () => {
  const { setUser } = useUserContext();

  const { data } = useQuery({
    queryKey: ['auth'],
    queryFn: fetchUser,
    retry: false
  });

  useEffect(() => {
    if (data) {
      setUser(data);
    }
  }, [data, setUser])

  return { data };
};

export default useAuth;