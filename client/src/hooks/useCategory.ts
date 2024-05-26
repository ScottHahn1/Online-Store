import { useQuery } from "@tanstack/react-query";
import { getProducts } from "./Api";

type Data = {
  brand: string;
  category: {
    id: number;
    name: string;
    image: string;
  };
  image: string;
  price: number;
  productId: number;
  rating: number;
  ratingCount: number;
  title: string;
  overview: string;
}[];

type Query = {
  category: string
  column: string
  lastSeen: number | string | null
  lastSeenId: number | string | null
  prev: boolean | null
}

const useCategory = (category: string, sortBy: string, lastSeenProduct: number | string | null, lastSeenId: number | string | null, prev: boolean | null) => {
  const { data } = useQuery({
    queryKey: ["category", { category, sortBy, lastSeenProduct }],
    queryFn: () =>
      getProducts<Data, Query>(`https://online-store-backend-zeta.vercel.app/categories/${category}`, { category: category, column: sortBy, lastSeen: lastSeenProduct, lastSeenId: lastSeenId, prev: prev }),
    enabled: !!category
  });

  return { data };
}

export default useCategory;