import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../hooks/Api";
import { setLocalStorage } from "../hooks/LocalStorage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type PostVariables = {
  url: string;
  body: {
    username: string;
    password: string;
  };
};

const Login = ({
  setLoggedIn,
}: {
  setLoggedIn: Dispatch<SetStateAction<string>>;
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginSuccessful, setLoginSuccessful] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables),
    onSuccess: (data) => {
      if (typeof data === "string") {
        setError(data);
        setUsername("");
        setPassword("");
      } else {
        error && setError("");
        setLocalStorage("token", data.token);
        setLocalStorage("userId", data.result[0].userId);
        setLocalStorage("username", data.username);
        setLoginSuccessful(true);
        setTimeout(() => {
          setLoggedIn("token");
          navigate("/");
        }, 2000);
      }
    },
  });

  const login = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      url: "https://online-store-backend-zeta.vercel.app/users/login",
      body: {
        username: username,
        password: password,
      },
    });
    loginSuccessful && window.location.reload();
  };

  return (
    <div className="register-login">
      <h2>Login</h2>
      <form onSubmit={login}>
        <label>
          Username <br></br>
          <input
            className="form-input"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>
        <label>
          <div
            className="show-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide Password" : "Show Password"}
            {showPassword ? (
              <FontAwesomeIcon icon={faEyeSlash} />
            ) : (
              <FontAwesomeIcon icon={faEye} />
            )}
          </div>
          Password <br></br>
          <input
            className="form-input"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type="submit">Login</button>
      </form>

      {loginSuccessful && (
        <div className="login-successful-popup">
          Login Successful!
          <div className="loading-line"></div>
        </div>
      )}

      {error ? error : <div></div>}
    </div>
  );
};

export default Login;