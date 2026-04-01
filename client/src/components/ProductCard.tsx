import { Link } from "react-router-dom";
import { setSessionStorage } from "../utils/LocalStorage";
import AddProductToCart from "./AddProductToCart";

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
  loggedIn: boolean | null;
  product: Data;
};

const ProductCard = ({ loggedIn, product }: Props) => {
  const slugifyProduct = (productTitle: string) => {
    return productTitle.toLowerCase().replaceAll("&", "and").replaceAll(" ", "-");
  }

  return (
    <div
      className='card'
      onClick={() => {
        setSessionStorage('product', product.productId);
      }}
    >
      <Link to={`/product/${product.productId}/${slugifyProduct(product.title)}`}>
        <div className="product-image-wrapper">
          <img src={product.image} alt={product.title} className="product-image" />
        </div>
      </Link>
      
      <div className="product-title-tooltip">
        <h4 className="product-title">
          {product.title}
        </h4>

        <div className="product-tooltip">
            {product.title}
        </div>
      </div>

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