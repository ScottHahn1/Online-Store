import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { HashLink } from "react-router-hash-link";
import Logout from "./Logout";

type Props = {
  loggedIn: boolean | null;
  setShowCart: Dispatch<SetStateAction<boolean>>;
  blur: boolean;
};

const Navbar = ({ loggedIn, setShowCart, blur }: Props) => {
  const [showPopup, setShowPopup] = useState(false);

  const handleCartClick = () => {
    loggedIn && setShowCart(true);
    showPopup && setShowPopup(false);
  };

  useEffect(() => {
    showPopup && setTimeout(() => setShowPopup(false), 3000);
  }, [showPopup]);

  return (
    <nav style={{ filter: blur ? 'blur(3px)' : '' }}>
      <HashLink to="/#" smooth={true}>
        <h1 style={{ cursor: 'pointer', textDecoration: 'none' }}>
          <span style={{ color: 'whitesmoke' }}>AGGRO</span>{' '}
          <span style={{ color: 'red' }}>GAMING</span>
        </h1>
      </HashLink>

      <ul>
        <HashLink to='/#' smooth={true}>
          <li>HOME</li>
        </HashLink>

        <Link to='/products'>
          <li>PRODUCTS</li>
        </Link>

        <HashLink
          to='/#home-categories'
          smooth={true}
          scroll={(el) => {
            const yOffset = -100;
            const y = el.getBoundingClientRect().top + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }}
        >
          <li>CATEGORIES</li>
        </HashLink>
      </ul>

      <div className='login-register'>
        {loggedIn ? (
          <Logout />
        ) : (
          <Link to='/login'>
            <button>Login</button>
          </Link>
        )}

        <Link to='/register'>
          <button>Register</button>
        </Link>
      </div>

      <FontAwesomeIcon
        icon={faShoppingCart}
        color='white'
        size='2x'
        cursor='pointer'
        onClick={() => loggedIn ? handleCartClick() : setShowPopup(true)}
      />

      {showPopup && (
        <div className='login-popup'>
          <span className='login-popup-text'>Login required!</span>
        </div>
      )}
    </nav>
  );
};

export default Navbar;