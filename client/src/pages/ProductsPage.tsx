import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useLayoutEffect, useState } from "react";
import "../styles/Products.css";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import Categories from "../components/Categories";
import { getData } from "../utils/Api";
import axiosInstance from "../utils/AxiosInstance";

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
};

type Props = {
  blur: boolean;
  category: string
  loggedIn: boolean | null;
  setCategory: Dispatch<SetStateAction<string>>
}

type QueryParams = {
  category: string;
  page: number;
  sortBy: string;
}

const ProductsPage = ({ category, setCategory, blur, loggedIn }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('price');

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.currentTarget.value);
    setCurrentPage(1); // changing the sortBy value will set the current page back to page 1
  }

  //get the total amount of products in a category
  const { data: totalProducts } = useQuery({
    queryKey: ['totalProducts', category],
    queryFn: () => getData<{ count: number }, { category: string }>('/api/products/total', { category: category })
  })

  //get all products in a category
  const { data: products, isLoading } = useQuery({
    queryKey: ['allProducts', category, currentPage, sortBy],
    queryFn: () => getData<Data[], QueryParams>(`${axiosInstance.defaults.baseURL}/api/products`, { category: category, page: currentPage, sortBy: sortBy }),
  });

  useEffect(() => {
    setCurrentPage(1); // changing the category will set the current page back to page 1
  }, [category])

  return (
    <div className='flex-space-between' style={{ filter: blur ? "blur(3px)" : "" }}>
      <Categories clickedCategory={category} setClickedCategory={setCategory} />
      {
        !isLoading &&
        <div className='products-container'>
          <div className='products-header'>
            { category ? <h2>{category}</h2> : <h2>All Products</h2> }
            { totalProducts && <div>{totalProducts.count} items</div> }
            <select onChange={handleSelect} style={{ fontSize: "1.2rem" }}>
              <option value='price'>Price</option>
              <option value='title'>A-Z</option>
              <option value='rating'>Rating</option>
            </select>
          </div>
          <div className='cards'>
            { products?.map(product => <ProductCard loggedIn={loggedIn} product={product} key={product.productId} />) }
          </div>
          <div className="pages">
            {
              currentPage > 1 &&
              <button onClick={() => {
                setCurrentPage((prev) => prev - 1)
              }}>
                <p>Previous</p>
              </button>
            }

            {
              totalProducts && 
              <div>
                Page: {currentPage} of {Math.ceil(totalProducts.count / 50)}
              </div>
            }

            {
              products && products.length > 49 && 
              <button onClick={() => setCurrentPage((prev) => prev + 1)}>
                <p>Next</p>
              </button>
            }
          </div>
        </div>
      }

      {
        isLoading && <div className='loading'></div>
      }
    </div>
  );
};

export default ProductsPage;