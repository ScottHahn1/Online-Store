import { useEffect, useState } from "react";
import useAddProduct from "../hooks/useAddProduct";
import AddRemoveCart from "./AddRemoveCart";

type ProductProps = {
  userId: number;
  productId: number;
  title: string;
  brand: string;
  price: number;
  overview: string;
  image: string;
  rating: number;
  ratingCount: number;
}; 

const AddProductToCart = ({
  userId,
  productId,
  title,
  brand,
  price,
  overview,
  image,
  rating,
  ratingCount,
}: ProductProps) => {
  const [addToCart, setAddToCart] = useState(false);
  const [numOfProduct, setNumOfProduct] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);

  useAddProduct({
    addToCart,
    setAddToCart,
    numOfProduct,
    userId,
    productId,
    title,
    brand,
    price,
    overview,
    image,
    rating,
    ratingCount,
    setShowPopup
  });

  const handleAddToCart = () => {
    if (userId) {
      showError && setShowError(false);
      setAddToCart(true);
    } else {
      addToCart && setAddToCart(false);
      setShowError(true);
    }
  }

  useEffect(() => {
    showPopup && setTimeout(() => setShowPopup(false), 3000);
  }, [showPopup])

  useEffect(() => {
    showError && setTimeout(() => setShowError(false), 3000);
  }, [showError])

  const handlePlusClick = () => {
    if (numOfProduct < 10) {
      setNumOfProduct(prev => prev + 1);
    }
  };

  const handleMinusClick = () => {
    setNumOfProduct(prev => 
      prev !== 0 ? prev - 1 : prev
    )
  }

  return (
    <>
      <AddRemoveCart
        isCart={false}
        handleMinusClick={handleMinusClick}
        handlePlusClick={handlePlusClick}
        numOfProducts={numOfProduct}
      />
      <button className="add-to-cart-btn" onClick={handleAddToCart}>
        Add To Cart
      </button>

      {showPopup && (
        <div className="product-popup">
          <span className="product-popup-text">Added To Cart</span>
        </div>
      )}

       {showError && (
        <div className="login-popup">
          <span className="login-popup-text">Login Required!</span>
        </div>
      )}
    </>
  );
};

export default AddProductToCart;