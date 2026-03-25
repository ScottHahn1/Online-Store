import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";

export interface Category {
  id: number,
  name: string,
  image: string
};

const useCategories = () => {
    const { data, isLoading } = useQuery({
      queryKey: ['categories'],
      queryFn: () =>
        getData<Category[], {}>('/api/categories', {})
    });

    return { data, isLoading };
}

export default useCategories;