import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteData } from "../utils/Api";
import { useEffect } from "react";

const RemoveFromCart = (userId: number, productId: number) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: () => deleteData(`https://online-store-backend-zeta.vercel.app/cart/delete/${userId}/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] })
  });

  useEffect(() => {
    productId && mutate();
  }, [productId])
}

export default RemoveFromCart;