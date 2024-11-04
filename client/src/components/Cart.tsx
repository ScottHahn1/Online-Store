import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../utils/Api";
import { getLocalStorage } from "../utils/LocalStorage";
import "../styles/Cart.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import useCartTotal from "../hooks/useCartTotal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import RemoveFromCart from "./RemoveFromCart";
import CartItem from "./CartItem";
import AddRemoveCart from "./AddRemoveCart";

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

  const { data: products } = useQuery({
    queryKey: ["cart"],
    queryFn: () =>
      getProducts<Products, { userId: number | string }>(
        "https://online-store-backend-zeta.vercel.app/cart",
        { userId: getLocalStorage("userId") }
      ),
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
        {
          products?.map((product, index) => (
            <CartItem
              children={ 
                <AddRemoveCart 
                  isCart={true}
                  handleMinusClick={() => handleMinusClick(index, product.price)}
                  handlePlusClick={() => handlePlusClick(index, product.price)}
                  index={index}
                  numOfProducts={numOfProducts}
                />
              }
              product={product}
              setItemToDelete={setItemToDelete}
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