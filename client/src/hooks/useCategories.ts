import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";

type Data = {
  id: number,
  name: string,
  image: string
}[];

const useCategories = () => {
    const { data, isLoading } = useQuery({
      queryKey: ['categories'],
      queryFn: () =>
        getData<Data, {}>('/api/categories', {})
    });

    return { data, isLoading };
}

export default useCategories;