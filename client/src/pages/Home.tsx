import "../styles/Home.css";
import HomeCategories from "../components/HomeCategories";
import { Dispatch, SetStateAction } from "react";
import { Link } from "react-router-dom";

type Props = {
  blur: boolean,
  setCategory: Dispatch<SetStateAction<string>>
}

const Home = ({ blur, setCategory }: Props) => {
  const image = require("../assets/images/hero-dark.jpg");

  return (
    <div className="home" style={{ filter: blur ? "blur(3px)" : "" }}>
      <div className="banner" style={{ backgroundImage: `url(${image})` }}>
        <div className="banner-text">
          <h1>
            Stay ahead of the competition, <br></br> at an affordable price.
          </h1>

          <p>
            Tired of losing? Tired of not being able to rank up? Look no further than Aggro Gaming,
            your one stop shop in order to become the gamer you know you can be. From headsets to controllers to keyboards and more,
            whatever gaming equipment you need, we'll provide at competitve prices. Stay equipped, stay aggressive, stay winning!
          </p>

          <Link to="/products">
            <button className="shop-now-btn">Start Shopping</button>
          </Link>
        </div>
      </div>

      <HomeCategories setCategory={setCategory} />
    </div>
  );
};

export default Home;