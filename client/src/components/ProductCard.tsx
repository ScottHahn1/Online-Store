import { Link } from "react-router-dom";
import { setSessionStorage } from "../utils/LocalStorage";
import AddProductToCart from "./AddProductToCart";

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
  loggedIn: boolean | null;
  product: Data;
};

const ProductCard = ({ loggedIn, product }: Props) => {
  return (
    <div
      className='card'
      onClick={() => {
        setSessionStorage('product', product.productId);
      }}
    >
      <Link to={'/product'}>
        <img src={product.image} alt={product.title} />
      </Link>
      <h4>{product.title}</h4>
      <p>
        {product.rating} ({product.ratingCount} reviews)
      </p>
      <p>
        {new Intl.NumberFormat('en-ZA', {
          style: 'currency',
          currency: 'ZAR',
          minimumFractionDigits: 2,
        }).format(product.price)}
      </p>

      <AddProductToCart
        loggedIn={loggedIn}
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
  ) 
};

export default ProductCard;