import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../hooks/Api";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import "../styles/Products.css";
import useCategory from "../hooks/useCategory";
import Products from "../components/Products";

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
  column: string
  lastSeen: number | string | null
  lastSeenId: number | string | null
  prev: boolean | null
}

type Props = {
  category: string
  setCategory: Dispatch<SetStateAction<string>>
  blur: boolean
}

const ProductsPage = ({ category, setCategory, blur }: Props) => {
  const [lastSeenProduct, setLastSeenProduct] = useState<number | string | null>(null);
  const [lastSeenId, setLastSeenId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("price");
  const [products, setProducts] = useState<Data>([]);
  const [prev, setPrev] = useState<boolean | null>(null);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  const { data, isLoading } = useQuery({
    queryKey: ["allProducts", { lastSeenProduct, sortBy, page, category }],
    queryFn: () =>
      getProducts<Data, Query>(`http://localhost:7000/products`, { column: sortBy, lastSeen: lastSeenProduct, lastSeenId: lastSeenId , prev: prev }),
    enabled: !category,
  });

  const { data: categoryData } = useCategory(category, sortBy, lastSeenProduct, lastSeenId, prev);

  useEffect(() => {
    if (data && prev) {
      setPrev(null);
      setProducts(data.reverse());
    } else if (data && !prev) {
      setProducts(data);
    }
  }, [data])

  useEffect(() => {
    if (categoryData && prev) {
      setPrev(null);
      setProducts(categoryData.reverse());
    } else if (categoryData && !prev) {
      setProducts(categoryData);
    }
  }, [categoryData])

  useEffect(() => {
    page === 1 && setLastSeenProduct(null);
  }, [page])

  useEffect(() => {
    setPage(1);
  }, [sortBy, category])

  const handlePreviousClick = () => {
    page > 1 && setPrev(true);
    if (products) {
      if (sortBy === "price") {
        setLastSeenProduct(products[0].price);
      } else if (sortBy === "rating") {
        setLastSeenProduct(products[0].rating);
      } else {
        setLastSeenProduct(products[0].title);
      }
    }
    setPage(prev => prev - 1);
  }

  const handleNextClick = () => {
    prev && setPrev(null);

    switch (sortBy) {
      case "price":
        products && setLastSeenProduct(products[products.length - 1].price);
        products && setLastSeenId(products[products.length - 1].productId);
        break;

      case "title":
        products && setLastSeenProduct(products[products.length - 1].title);
        products && setLastSeenId(products[products.length - 1].productId);
        break;

      case "rating":
        products && setLastSeenProduct(products[products.length - 1].rating);
        products && setLastSeenId(products[products.length - 1].productId);
        break;
    }
    setPage(prev => prev + 1);
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.currentTarget.value);
    setLastSeenProduct(null);
  }
  
  return (
    <>
      {
        isLoading ? <div className="loading"></div>
        :
        <Products 
          blur={blur}
          category={category} setCategory={setCategory} 
          products={products} 
          handleSelect={handleSelect} handlePreviousClick={handlePreviousClick} handleNextClick={handleNextClick} 
          page={page} 
        />
      }
    </>
  );
};

export default ProductsPage;