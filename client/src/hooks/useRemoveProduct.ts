import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData } from "../utils/Api";

const useRemoveProduct = (productId: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => deleteData(`/api/cart/delete/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
  });

  return mutate;
}

export default useRemoveProduct;