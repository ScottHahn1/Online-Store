import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../hooks/Api";
import "../styles/Product.css";
import { getLocalStorage, getSessionStorage } from "../hooks/LocalStorage";
import Rating from "../components/Rating";
import Similar from "../components/Similar";
import AddToCart from "../components/AddToCart";

type Data = {
  productId: number;
  title: string;
  brand: string;
  image: string;
  overview: string;
  price: number;
  rating: number;
  ratingCount: number;
  category: {
    name: string;
  };
};

const Product = ({ blur }: { blur: boolean }) => {
  const { data, isLoading } = useQuery({
    queryKey: ["product"],
    queryFn: () =>
      getProducts<Data, {}>(
        `http://localhost:7000/products/${getSessionStorage("product")}`
      ),
    enabled: !!getSessionStorage("product"),
  });

  return (
    <div style={{ filter: blur ? "blur(3px)" : "" }}>
      {!isLoading && data && (
        <div className="product">
          <div className="product-image-description">
            <img src={data.image} alt={data.title} />
            <p className="product-description">{data.overview}</p>
          </div>

          <div className="product-info">
            <div className="product-brand">{data.brand}</div>

            <div className="product-title">{data.title}</div>

            <div className="product-price">
              {new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2,
              }).format(data.price)}
            </div>

            <Rating rating={data.rating} ratingCount={data.ratingCount} />
            <AddToCart
              userId={getLocalStorage("userId")}
              productId={data.productId}
              title={data.title}
              brand={data.brand}
              price={data.price}
              overview={data.overview}
              image={data.image}
              rating={data.rating}
              ratingCount={data.ratingCount}
            />
          </div>
        </div>
      )}

      {isLoading && <div className="loading"></div>}

      {data && !isLoading && (
        <Similar
          product={data}
          productId={data.productId}
          category={data.category.name}
        />
      )}
    </div>
  );
};

export default Product;
