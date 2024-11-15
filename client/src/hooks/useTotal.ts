import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";

const useTotal = (category: string) => {
    const { data: totalProducts } = useQuery({
        queryKey: ['totalProducts', category],
        queryFn: () =>
          getData<{ count: number }, { category: string }>('/api/products/total', { category: category })
    });

    return { totalProducts };
}

export default useTotal;