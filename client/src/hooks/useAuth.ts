import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { useUserContext } from "../contexts/UserContext";
import { useEffect } from "react";

const useAuth = () => {
  const { user, setUser, setAccessToken } = useUserContext();

  const { data } = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      try {
        const refreshTokenRes = await axiosInstance.post('/api/users/refresh-token');
        const newAccessToken = refreshTokenRes.data.accessToken;

        setAccessToken(newAccessToken);

        const userRes = await axiosInstance.get('/api/users/me', {
          headers: { Authorization: `Bearer ${newAccessToken}` }
        });
        
        return userRes.data;
      } catch {
        return null;
      }
    },
    enabled: !user,
    retry: false
  });

  useEffect(() => {
    if (data !== undefined) {
      setUser(data);
    }
  }, [data, setUser])

  return { data };
};

export default useAuth;