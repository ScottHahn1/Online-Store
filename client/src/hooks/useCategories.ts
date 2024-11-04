import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../utils/Api";

type Data = {
  id: number,
  name: string,
  image: string
}[];

const useCategories = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["categories"],
      queryFn: () =>
        getProducts<Data, {}>("https://online-store-backend-zeta.vercel.app/categories", {})
    });

    return { data, isLoading };
}

export default useCategories;