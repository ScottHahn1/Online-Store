import { useQuery } from "@tanstack/react-query";
import { ChangeEvent, useEffect, useLayoutEffect, useState } from "react";
import "../styles/Products.css";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import Categories from "../components/Categories";
import { getData } from "../utils/Api";
import { useSearchParams } from "react-router-dom";
import useCategories from "../hooks/useCategories";

type Data = {
  brand: string;
  categoryId: number;
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
  loggedIn: boolean | null;
}

type QueryParams = {
  categoryId: number | undefined;
  page: number;
  sortBy: string;
}

const Products = ({ blur, loggedIn }: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('price');
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");

  const slugify = (categoryName: string) => {
    return categoryName?.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
  }

  const { data: categories, isLoading: isCategoriesLoading } = useCategories();

  const selectedCategory = categories?.find(category => {
    return slugify(category.name) == categoryParam;
  })

  const categoryId = selectedCategory?.id;

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  });

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.currentTarget.value);
    setCurrentPage(1);
  }

  const { data: totalProducts } = useQuery({
    queryKey: ['totalProducts', categoryId],
    queryFn: () => getData<{ count: number }, { categoryId: number | undefined }>('/api/products/total', { categoryId })
  })

  const { data: products, isLoading } = useQuery({
    queryKey: ['allProducts', categoryId, currentPage, sortBy],
    queryFn: () => getData<Data[], QueryParams>('/api/products', { categoryId, page: currentPage, sortBy }),
  });

  useEffect(() => {
    setCurrentPage(1); 
  }, [categoryParam])

  return (
    <div className='flex-space-between' style={{ filter: blur ? "blur(3px)" : "" }}>
      { categories && <Categories categories={categories} isLoading={isCategoriesLoading} />  }

      {
        !isLoading &&
        <div className='products-container'>
          <div className='products-header'>
            { 
              categoryParam ? 
              <h2>{categories?.find(category => {
                  return slugify(category.name) == categoryParam
                })?.name}
              </h2> 
              : 
              <h2>All Products</h2> 
            }

            { totalProducts && <div>{totalProducts.count} items</div> }

            <select onChange={handleSelect} style={{ fontSize: "1.2rem" }}>
              <option value="price">Price</option>
              <option value="title">A-Z</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="cards">
            { products?.map(product => 
                <ProductCard loggedIn={loggedIn} product={product} key={product.productId} />
              ) 
            }
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

export default Products;