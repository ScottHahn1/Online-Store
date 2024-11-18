import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";
import { useUserContext } from "../contexts/UserContext";

const fetchUser = async () => {
  try {
    const response = await axiosInstance.get('/api/users/me');
    return response.data || {};
  } catch (err) {
    console.log(err);
  }
};

const useAuth = () => {
  const { setUser } = useUserContext();

  const { data } = useQuery({
    queryKey: ['auth'],
    queryFn: fetchUser,
    retry: false
  });

  if (data) {
    setUser(data);
  }

  return { data };
};

export default useAuth;