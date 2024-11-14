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
import useWindowResize from "./hooks/useWindowResize";
import { getSessionStorage, setSessionStorage } from "./utils/LocalStorage";
import useAuth from "./hooks/useAuth";

const App = () => {
  const [loggedIn, setLoggedIn] = useState<boolean | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [blur, setBlur] = useState(false);
  const [clickedCategory, setClickedCategory] = useState(getSessionStorage("clickedCategory"));

  const { data: user } = useAuth();

  useEffect(() => {
    user && setLoggedIn(true);
  }, [user])

  useEffect(() => {
    clickedCategory && setSessionStorage('clickedCategory', clickedCategory);
  }, [clickedCategory]);

  const windowWidth = useWindowResize();
  
  const renderNav = windowWidth > 600 ? 
  <Navbar setShowCart={setShowCart} blur={blur} loggedIn={loggedIn} /> 
  :
  <MobileMenu setShowCart={setShowCart} blur={blur} loggedIn={loggedIn} setLoggedIn={setLoggedIn} />

  return (
    <div className="app">
      <BrowserRouter>
        {renderNav}
        {showCart && <Cart setBlur={setBlur} setShowCart={setShowCart} />}
        <Routes>
          <Route path='/' index element={<Home blur={blur} setCategory={setClickedCategory} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login loggedIn={loggedIn} setLoggedIn={setLoggedIn} />} />
          <Route path='/products' element={<ProductsPage loggedIn={loggedIn} category={clickedCategory} setCategory={setClickedCategory} blur={blur} />} />
          <Route path='/product' element={<Product blur={blur} loggedIn={loggedIn} />} />
        </Routes>
        <Footer setCategory={setClickedCategory} />
      </BrowserRouter>
    </div>
  );
};

export default App;