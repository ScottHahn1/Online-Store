import '../styles/Footer.css';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faLinkedin, faGithub, faPlaystation, faXbox, } from '@fortawesome/free-brands-svg-icons';
import { faChair, faCode, faComputerMouse, faGamepad, faHeadset, faHome, faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { HashLink } from 'react-router-hash-link';
import { Dispatch, SetStateAction } from 'react';

const Footer = ({ setCategory }: { setCategory: Dispatch<SetStateAction<string>> }) => {
    return (
        <footer>
            <div className="footer-links">
                <ul className="footer-nav-links">
                    <h2>Shop</h2>

                    <Link to="/products">
                        <li onClick={() => setCategory("Playstation Accessories")}>Playstation Accessories &nbsp; <FontAwesomeIcon icon={faPlaystation} /></li>
                    </Link>

                    <Link to="/products">
                        <li onClick={() => setCategory("PC Headsets")}>PC Headsets &nbsp; <FontAwesomeIcon icon={faHeadset} /></li>
                    </Link>

                    <Link to="/products">
                        <li onClick={() => setCategory("Xbox Accessories")}>Xbox Accessories &nbsp; <FontAwesomeIcon icon={faXbox} /></li>
                    </Link>

                    <Link to="/products">
                        <li onClick={() => setCategory("Mouses & Mouse Pads")}>Mouses/Mouse Pads &nbsp; <FontAwesomeIcon icon={faComputerMouse} /></li>
                    </Link>

                    <Link to="/products">
                        <li onClick={() => setCategory("Consoles")}>Consoles &nbsp; <FontAwesomeIcon icon={faGamepad} /></li>
                    </Link>

                    <Link to="/products">
                        <li onClick={() => setCategory("Keyboards")}>Keyboards &nbsp; <FontAwesomeIcon icon={faKeyboard} /></li>
                    </Link>

                    <Link to="/products">
                        <li onClick={() => setCategory("Gaming Chairs")}>Gaming Chairs &nbsp; <FontAwesomeIcon icon={faChair} /></li>
                    </Link>
                </ul>

                <ul className="social-media-links">
                    <h2>Links</h2>

                    <HashLink to="/#" smooth={true}>
                        <li>Home &nbsp; <FontAwesomeIcon icon={faHome} /></li>
                    </HashLink>
                    <a href="https://www.linkedin.com/in/scott-hahn" target="_blank" >
                        <li>LinkedIn &nbsp; <FontAwesomeIcon icon={faLinkedin} /></li>
                    </a>
                    <a href='https://github.com/ScottHahn1' target='_blank'>
                        <li>GitHub &nbsp; <FontAwesomeIcon icon={faGithub}/></li>  
                    </a>
                </ul>
            </div>

            <div className="made-by">
                Made by Scott Hahn
            </div>
        </footer>
    )
}

export default Footer;