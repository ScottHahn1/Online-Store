import { ChangeEvent, Dispatch, SetStateAction } from "react";
import "../styles/Products.css";
import { Link } from "react-router-dom";
import { getLocalStorage, setSessionStorage } from "../hooks/LocalStorage";
import AddToCart from "./AddToCart";
import Categories from "./Categories";
import useTotal from "../hooks/useTotal";

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

type Props = {
  category: string;
  setCategory: Dispatch<SetStateAction<string>>;
  products: Data;
  handleSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  handlePreviousClick: () => void;
  handleNextClick: () => void;
  page: number;
  blur: boolean;
};

const Products = ({
  category,
  setCategory,
  products,
  handleSelect,
  handlePreviousClick,
  handleNextClick,
  page,
  blur
}: Props) => {
  const { totalProducts } = useTotal(category);

  return (
    <div className="categories-products" style={{ filter: blur ? "blur(3px)" : "" }}>
      <Categories clickedCategory={category} setClickedCategory={setCategory} />

      {
        <div className="products-container">
          <div className="products-header">
            {category ? <h2>{category}</h2> : <h2>All Products</h2>}
            {totalProducts && <div>{totalProducts.count} items</div>}
            <select onChange={handleSelect} style={{ fontSize: "1.2rem" }}>
              <option value="price">Price</option>
              <option value="title">A-Z</option>
              <option value="rating">Rating</option>
            </select>
          </div>

          <div className="cards">
            {products.map((product) => (
              <div
                key={product.productId}
                className="card"
                onClick={() => {
                  setSessionStorage("product", product.productId);
                }}
              >
                <Link to={"/product"}>
                  <img src={product.image} alt={product.title} />
                </Link>
                <h4>{product.title}</h4>
                <p>
                  {product.rating} ({product.ratingCount} reviews)
                </p>
                <p>
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    minimumFractionDigits: 2,
                  }).format(product.price)}
                </p>

                <AddToCart
                  userId={getLocalStorage("userId")}
                  productId={product.productId}
                  title={product.title}
                  brand={product.brand}
                  price={product.price}
                  overview={product.overview}
                  image={product.image}
                  rating={product.rating}
                  ratingCount={product.ratingCount}
                />
              </div>
            ))}
          </div>

          <div className="pages">
            {page > 1 && (
              <button onClick={handlePreviousClick}>Previous</button>
            )}

            {totalProducts && products && (
              <div>
                Page: {page} of {Math.ceil(totalProducts.count / 50)}
              </div>
            )}

            {products && products.length > 49 && (
              <button onClick={handleNextClick}>Next</button>
            )}
          </div>
        </div>
      }
    </div>
  );
};

export default Products;
