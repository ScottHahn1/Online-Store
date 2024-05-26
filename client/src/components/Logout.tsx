import { Dispatch, SetStateAction } from "react";
import { removeLocalStorage } from "../hooks/LocalStorage";

const Logout = ({
  setLoggedIn,
}: {
  setLoggedIn: Dispatch<SetStateAction<string>>;
}) => {
  const logout = () => {
    removeLocalStorage("token");
    removeLocalStorage("userId");
    removeLocalStorage("username");
    setLoggedIn("");
    window.location.reload();
  };

  return <button onClick={logout}>Logout</button>;
};

export default Logout;
