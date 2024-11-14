import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";
import "../styles/Cart.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCartTotal from "../hooks/useCartTotal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CartItem from "./CartItem";
import QuantityButtons from "./QuantityButtons";
import { useUserContext } from "../contexts/UserContext";

export type Products = {
  count: number;
  brand: string;
  image: string;
  price: number;
  productId: number;
  rating: number;
  ratingCount: number;
  title: string;
  overview: string;
}[];

type Props = {
  setBlur: Dispatch<SetStateAction<boolean>>;
  setShowCart: Dispatch<SetStateAction<boolean>>;
};

const Cart = ({ setBlur, setShowCart }: Props) => {
  const [total, setTotal] = useState(0);
  const [numOfProducts, setNumOfProducts] = useState<number[]>([]);

  const { user } = useUserContext();

  const { data: products } = useQuery({
    queryKey: ["cart", user?.userId],
    queryFn: () =>
      getData<Products, { userId: number }>("/api/cart", { userId: user?.userId as number }),
    enabled: !!user?.userId
  });

  const { total: cartTotal } = useCartTotal(products, total, setTotal);

  useEffect(() => {
    setBlur(true);
  }, []);

  useEffect(() => {
    products && setNumOfProducts(() => products.map((product) => product.count));
  }, [products]);

  const handleMinusClick = (index: number, price: number) => {
    if (numOfProducts[index] > 0) {
      const newNumOfProducts = numOfProducts.map((num, i) => {
        if (i === index) {
          return num - 1
        } else {
          return num;
        }
      });

      setNumOfProducts(newNumOfProducts);
      setTotal(total - price);
    }
  };

  const handlePlusClick = (index: number, price: number) => {
    if (numOfProducts[index] < 10) {
      const newNumOfProducts = numOfProducts.map((num, i) => {
        if (i === index) {
          return num + 1;
        } else {
          return num;
        }
      });

      setNumOfProducts(newNumOfProducts);

      setTotal(cartTotal + price);
    }
  };

  const closeCart = () => {
    setBlur(false);
    setShowCart(false);
  };

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>Cart</h2>
        <FontAwesomeIcon
          icon={faXmark}
          cursor="pointer"
          onClick={closeCart}
          className="close-cart"
        />
      </div>

      <br></br>

      <div className="cart-items">
        {
          products?.map((product, index) => (
            <CartItem
              children={ 
                <QuantityButtons
                  isCart={true}
                  handleMinusClick={() => handleMinusClick(index, product.price)}
                  handlePlusClick={() => handlePlusClick(index, product.price)}
                  index={index}
                  numOfProducts={numOfProducts}
                />
              }
              product={product}
            />
          ))
        }
      </div>

      <div className="total">
        <h3 style={{ paddingLeft: "1rem" }}>Total</h3>

        <b style={{ paddingLeft: "1rem" }}>
            {products ? new Intl.NumberFormat("en-ZA", {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2,
                }).format(cartTotal)
            : "R0, 00"}
        </b>
      </div>
      <button className="checkout-btn">Checkout</button>
    </div>
  );
};

export default Cart;