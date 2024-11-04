import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { postData } from "../utils/Api";

type PostVariables = {
  url: string;
  body: {
    userId: number;
    productId: number;
    title: string;
    brand: string;
    price: number;
    overview: string;
    image: string;
    rating: number;
    ratingCount: number;
  };
};

type Params = {
  addToCart: boolean;
  setAddToCart: Dispatch<SetStateAction<boolean>>;
  numOfProduct: number;
  userId: number;
  productId: number;
  title: string;
  brand: string;
  price: number;
  overview: string;
  image: string;
  rating: number;
  ratingCount: number;
  setShowPopup: Dispatch<SetStateAction<boolean>>
};

const useAddProduct = ({ ...params }: Params) => {
  const queryClient = useQueryClient();
  const number = params.numOfProduct;

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables),
    onSuccess: () => {
      params.setShowPopup(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    }
  });

  useEffect(() => {
    if (params.addToCart) {
      Array.from({ length: number }).map(_ => {
        mutate({
          url: "https://online-store-backend-zeta.vercel.app/cart/add",
          body: {
            userId: params.userId,
            productId: params.productId,
            title: params.title,
            brand: params.brand,
            price: params.price,
            overview: params.overview,
            image: params.image,
            rating: params.rating,
            ratingCount: params.ratingCount,
          },
        });
      });
      params.setAddToCart(false);
    }
  }, [params.addToCart]);
};

export default useAddProduct;