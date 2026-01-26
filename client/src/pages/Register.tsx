import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../utils/Api";
import RegisterForm from "../components/RegisterForm";

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
      if (data.error) {
        setRegisterSuccessful(false);
        setError("Username already exists! Pick a different username");
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
          url: '/api/users/register',
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
      setError('Username/Password can not be empty!');
    }
  };

  return (
    <div className='register-login'>
      <h2>Register</h2>
      <form onSubmit={signUp}>
        <label>
          Username <br></br>
          <input
            className='form-input'
            type='text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </label>

        <label>
          <div className='show-password' onClick={ () => setShowPassword(!showPassword) }>
            { showPassword ? 'Hide Password' : 'Show Password' }
            { showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
          </div>
          Password 
          <br></br>
          <input
            className='form-input'
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <label>
          <div className='show-password' onClick={ () => setShowPassword(!showPassword) }>
            { showPassword ? 'Hide Password' : 'Show Password' }
            { showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} /> }
          </div>
          Confirm Password <br></br>
          <input
            className='form-input'
            type={ showPassword ? 'text' : 'password' }
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
            <div className='loading-line'></div>
          </div>
        )
      }

      { error && error }
    </div>
  );
};

export default Register;