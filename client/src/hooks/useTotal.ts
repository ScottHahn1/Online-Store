import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./Api";

const useTotal = (category: string) => {
    const { data: totalProducts } = useQuery({
        queryKey: ["totalProducts", category],
        queryFn: () =>
          getProducts<{ count: number }, { category: string }>(`http://localhost:7000/products/total`, { category: category })
    });

    return { totalProducts };
}

export default useTotal;