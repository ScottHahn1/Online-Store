import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData } from "../utils/Api";
import { useUserContext } from "../contexts/UserContext";

const useRemoveProduct = (productId: number) => {
  const queryClient = useQueryClient();

  const { user } = useUserContext();

  const { mutate } = useMutation({
    mutationFn: () => deleteData(`/api/cart/delete/${user?.userId}/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
  });

  return mutate;
}

export default useRemoveProduct;