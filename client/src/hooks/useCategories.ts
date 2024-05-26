import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./Api";

type Data = {
  id: number,
  name: string,
  image: string
}[];

const useCategories = () => {
    const { data, isLoading } = useQuery({
      queryKey: ["categories"],
      queryFn: () =>
        getProducts<Data, {}>("http://localhost:7000/categories", {})
    });

    return { data, isLoading };
}

export default useCategories;