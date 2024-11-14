import { useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/AxiosInstance";

const Logout = () => {
  const queryClient = useQueryClient();
  
  const logout = async () => {
    await axiosInstance.post('/api/users/logout');
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    window.location.reload();
  };

  return <button onClick={logout}>Logout</button>;
};

export default Logout;