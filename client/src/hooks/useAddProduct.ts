import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { postData } from "../utils/Api";
import { useUserContext } from "../contexts/UserContext";

type PostVariables = {
  url: string;
  body: {
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
  const { accessToken } = useUserContext();
  const queryClient = useQueryClient();
  const number = params.numOfProduct;

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables, accessToken),
    onSuccess: () => {
      params.setShowPopup(true);
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    }
  });
  
  const { user } = useUserContext();

  useEffect(() => {
    if (params.addToCart && user) {
      Array.from({ length: number }).map(_ => {
        return mutate({
          url: '/api/cart/add',
          body: {
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
  }, [params.addToCart, mutate, number, params, user]);
};

export default useAddProduct;