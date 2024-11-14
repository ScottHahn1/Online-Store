import { faBars } from "@fortawesome/free-solid-svg-icons";
import "../styles/MobileMenu.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import axiosInstance from "../utils/AxiosInstance";
import { useQueryClient } from "@tanstack/react-query";

type Props = {
  loggedIn: boolean | null;
  setLoggedIn: Dispatch<SetStateAction<boolean | null>>;
  setShowCart: Dispatch<SetStateAction<boolean>>;
  blur: boolean;
};

const MobileMenu = ({ blur, setShowCart, loggedIn, setLoggedIn }: Props) => {
  const [showLinks, setShowLinks] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const queryClient = useQueryClient();

  const logout = async () => {
    await axiosInstance.post('/api/users/logout');
    queryClient.invalidateQueries({ queryKey: ['auth'] });
    window.location.reload();
    setLoggedIn(false);
    window.location.reload();
  };

  const handleCartClick = () => {
    loggedIn && setShowCart(true);
    showPopup && setShowPopup(false);
  };

  useEffect(() => {
    showPopup && setTimeout(() => setShowPopup(false), 3000);
  }, [showPopup]);

  return (
    <div className='mobile-nav' style={{ filter: blur ? 'blur(3px)' : '' }}>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <Link to="/">
          <h1 style={{ cursor: 'pointer', textDecoration: 'none' }}>
            <span style={{ color: 'whitesmoke' }}>AGGRO</span>{' '}
            <span style={{ color: 'red' }}>GAMING</span>
          </h1>
        </Link>
        <div
          className='hamburger-menu'
          onClick={() => setShowLinks(!showLinks)}
        >
          <FontAwesomeIcon
            icon={faBars}
            color='white'
            style={{ width: '1.5rem', height: '100%' }}
          />
        </div>
      </div>

      <div
        className='mobile-links'
        style={{ display: showLinks ? 'block' : 'none' }}
      >
        <ul>
          <Link to='/register'>
            <li>Register</li>
          </Link>

           {loggedIn ? (
            <Link to='/#'>
              <li onClick={logout}>Logout</li>
            </Link>
          ) : (
            <Link to='/login'>
              <li>Login</li>
            </Link>
          )}

          <HashLink to='/#categories' smooth={true}>
            <li>Categories</li>
          </HashLink>

          <Link to='/products'>
            <li>Products</li>
          </Link>

          <Link to='/#'>
            <li onClick={() => loggedIn ? handleCartClick() : setShowPopup(true)}>
              Cart
            </li>
          </Link>
        </ul>

        {showPopup && (
          <div className='mobile-login-popup'>
            <span className='mobile-login-popup-text'>Login required!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;