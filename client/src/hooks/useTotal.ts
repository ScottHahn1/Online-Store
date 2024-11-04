import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../utils/Api";

const useTotal = (category: string) => {
    const { data: totalProducts } = useQuery({
        queryKey: ["totalProducts", category],
        queryFn: () =>
          getProducts<{ count: number }, { category: string }>(`https://online-store-backend-zeta.vercel.app/products/total`, { category: category })
    });

    return { totalProducts };
}

export default useTotal;