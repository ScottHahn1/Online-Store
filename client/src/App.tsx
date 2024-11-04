import { useEffect, useState } from "react";
import "./styles/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Product from "./pages/Product";
import ProductsPage from "./pages/ProductsPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./components/Cart";
import Footer from "./components/Footer";
import MobileMenu from "./components/MobileMenu";
import {
  getLocalStorage,
  getSessionStorage,
  setSessionStorage,
} from "./utils/LocalStorage";

const App = () => {
  const [showCart, setShowCart] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clickedCategory, setClickedCategory] = useState(
    getSessionStorage("clickedCategory")
  );
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [loggedIn, setLoggedIn] = useState(getLocalStorage("token"));

  useEffect(() => {
    clickedCategory && setSessionStorage("clickedCategory", clickedCategory);
  }, [clickedCategory]);

  const setWindowDimensions = () => {
    setWindowWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", setWindowDimensions);
    return () => {
      window.removeEventListener("resize", setWindowDimensions);
    };
  }, []);

  return (
    <div className="app">
      <BrowserRouter>
        {windowWidth > 600 ? (
          <Navbar
            setShowCart={setShowCart}
            blur={blur}
            loggedIn={loggedIn}
            setLoggedIn={setLoggedIn}
          />
        ) : (
          <MobileMenu setShowCart={setShowCart} blur={blur} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
        )}
        {showCart && <Cart setBlur={setBlur} setShowCart={setShowCart} />}
        <Routes>
          <Route
            path="/"
            index
            element={<Home blur={blur} setCategory={setClickedCategory} />}
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} />} />
          <Route
            path="/products"
            element={
              <ProductsPage
                category={clickedCategory}
                setCategory={setClickedCategory}
                blur={blur}
              />
            }
          />
          <Route path="/product" element={<Product blur={blur} />} />
        </Routes>
        <Footer setCategory={setClickedCategory} />
      </BrowserRouter>
    </div>
  );
};

export default App;
