import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../hooks/Api";
import { getLocalStorage } from "../hooks/LocalStorage";
import "../styles/Cart.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCartTotal from "../hooks/useCartTotal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import RemoveFromCart from "./RemoveFromCart";

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
  const [itemToDelete, setItemToDelete] = useState(0);

  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: () =>
      getProducts<Products, { userId: number | string }>(
        "https://online-store-backend-zeta.vercel.app/cart",
        { userId: getLocalStorage("userId") }
      ),
  });

  const { total: cartTotal } = useCartTotal(data, total, setTotal);

  useEffect(() => {
    setBlur(true);
  }, []);

  useEffect(() => {
    data && setNumOfProducts(() => data.map((product) => product.count));
  }, [data]);

  const handleMinusClick = (index: number, price: number) => {
    const nextCounters = numOfProducts.map((num, i) => {
      if (i === index && num > 0) {
        return num - 1;
      } else {
        return num;
      }
    });

    setNumOfProducts(nextCounters);

    const newTotal = cartTotal - price;
    newTotal >= 0 && setTotal(newTotal);
  };

  const handlePlusClick = (index: number, price: number) => {
    const nextCounters = numOfProducts.map((num, i) => {
      if (i === index && num < 10) {
        return num + 1;
      } else {
        return num;
      }
    });

    setNumOfProducts(nextCounters);

    const newTotal = cartTotal + price;
    if (newTotal >= 0 && numOfProducts[index] < 10) {
      setTotal(newTotal);
    }
  };

  const closeCart = () => {
    setBlur(false);
    setShowCart(false);
  };

  RemoveFromCart(getLocalStorage("userId"), itemToDelete);

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
        {data?.map((product, index) => (
          <div className="cart-item" key={product.productId}>
            <div>
              <img src={product.image} width="70%" alt={product.title} />
            </div>

            <div
              className="flex-column"
              style={{ justifyContent: "center", gap: "1rem" }}
            >
              <div style={{ textAlign: "start" }}>{product.title}</div>
              <div style={{ textAlign: "start" }}>
                <b>
                  {new Intl.NumberFormat("en-ZA", {
                    style: "currency",
                    currency: "ZAR",
                    minimumFractionDigits: 2,
                  }).format(product.price)}
                </b>
              </div>
            </div>

            <div
              className="flex-column"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <div
                style={{ cursor: "pointer" }}
                onClick={() => setItemToDelete(product.productId)}
              >
                <FontAwesomeIcon
                  icon={faTrashCan}
                  fontSize="1.3rem"
                  color="red"
                />
              </div>

              <div className="add-remove-btn-cart ">
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
            </div>
          </div>
        ))}

        <div className="total-checkout">
          <h3 style={{ paddingLeft: "1rem" }}>Total</h3>

          <b style={{ paddingLeft: "1rem" }}>
            {data
              ? new Intl.NumberFormat("en-ZA", {
                  style: "currency",
                  currency: "ZAR",
                  minimumFractionDigits: 2,
                }).format(cartTotal)
              : "R0, 00"}
          </b>

          <button className="checkout-btn">Checkout</button>
        </div>
      </div>
    </div>
  );
};

export default Cart;