import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../hooks/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons";

type PostVariables = {
  url: string;
  body: {
    username: string;
    password: string;
  };
};

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [registerSuccessful, setRegisterSuccessful] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables),
    
    onSuccess: (data) => {
      if (data.sqlMessage) {
        setRegisterSuccessful(false);
        setError("Username already exists! Pick a different username");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      } else {
        error && setError("");
        setRegisterSuccessful(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    },
  });

  const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username && password && confirmPassword) {
      if (password === confirmPassword) {
        mutate({
          url: "https://online-store-backend-zeta.vercel.app/users/register",
          body: {
            username: username,
            password: password,
          },
        });
      } else {
        setError("Passwords don't match!");
        setUsername("");
        setPassword("");
        setConfirmPassword("");
      }
    } else {
      setError("Username/Password can not be empty!");
    }
  };

  return (
    <div className="register-login">
      <h2>Register</h2>
      <form onSubmit={signUp}>
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
          <div className="show-password" onClick={ () => setShowPassword(!showPassword) }>
            { showPassword ? "Hide Password" : "Show Password" }
            { showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
          </div>
          Password <br></br>
          <input
            className="form-input"
            type={ showPassword ? "text" : "password" }
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          <div className="show-password" onClick={ () => setShowPassword(!showPassword) }>
            { showPassword ? "Hide Password" : "Show Password" }
            { showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
          </div>
          Confirm Password <br></br>
          <input
            className="form-input"
            type={ showPassword ? "text" : "password" }
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </label>
        
        <button type="submit">Sign Up</button>
      </form>

      {
        registerSuccessful && (
          <div>
            Register Successful! Redirecting to login...
            <div className="loading-line"></div>
          </div>
        )
      }

      {
        error ? error 
        : 
        <div></div>
      }
    </div>
  );
};

export default Register;