import { useQuery } from "@tanstack/react-query";
import { getData } from "../utils/Api";
import "../styles/Cart.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCartTotal from "../hooks/useCartTotal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import CartItem from "./CartItem";
import { useUserContext } from "../contexts/UserContext";
import Payment from "./Payment";

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
  const [showPayment, setShowPayment] = useState(false);

  const { user, accessToken } = useUserContext();

  const { data: products } = useQuery({
    queryKey: ["cart", user?.userId],
    queryFn: () =>
      getData<Products, { userId: number }>(
        "/api/cart", 
        {
          userId: user?.userId as number,
        },
        accessToken,
      ),
    enabled: !!user?.userId,
  });

  const { total: cartTotal } = useCartTotal(products, total, setTotal);

  useEffect(() => {
    setBlur(true);
  }, []);

  useEffect(() => {
    products &&
    setNumOfProducts(() => products.map((product) => product.count));
  }, [products]);

  const handleMinusClick = (index: number, price: number) => {
    setNumOfProducts((prev) => {
      const newNums = prev.map((num, i) =>
        i === index ? Math.max(num - 1, 0) : num,
      );
      return newNums;
    });

    if (numOfProducts[index] > 0) {
      setTotal((prevTotal) => prevTotal - price);
    }
  };

  const handlePlusClick = (index: number, price: number) => {
    setNumOfProducts((prev) => {
      const newNums = prev.map((num, i) =>
        i === index ? Math.min(num + 1, 10) : num,
      );
      return newNums;
    });

    if (numOfProducts[index] < 10) {
      setTotal((prevTotal) => prevTotal + price);
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
        {products?.map((product, index) => (
          <CartItem
            key={product.productId}
            children={
              <div className="add-remove-btn-cart">
                <button
                  className="minus-cart"
                  onClick={() => handleMinusClick(index, product.price)}
                >
                  -
                </button>

                {numOfProducts[index]}

                <button
                  className="plus-cart"
                  onClick={() => handlePlusClick(index, product.price)}
                >
                  +
                </button>
              </div>
            }
            product={product}
          />
        ))}
      </div>

      <div className="total">
        <h3 style={{ paddingLeft: "1rem" }}>Total</h3>

        <b style={{ paddingLeft: "1rem" }}>
          {products
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "ZAR",
                minimumFractionDigits: 2,
              }).format(cartTotal)
            : "R0. 00"}
        </b>
      </div>

      <button className="checkout-btn" onClick={() => setShowPayment(true)}>
        Checkout
      </button>

      {showPayment && user?.email && (
        <Payment email={user.email} amount={total} />
      )}
    </div>
  );
};

export default Cart;