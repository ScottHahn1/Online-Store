import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../utils/Api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useUserContext } from "../contexts/UserContext";

type LoginProps = {
  loggedIn: boolean | null;
  setLoggedIn: Dispatch<SetStateAction<boolean | null>>;
}

type PostVariables = {
  url: string;
  body: {
    username: string;
    password: string;
  }
};

const Login = ({ loggedIn, setLoggedIn }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();

  const { setUser } = useUserContext();

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables),
    onSuccess: (data) => {
      if (data.success) {      
        setUser({ userId: data.userId, username: data.username })
        error && setError("");
        setLoggedIn(true);
      } else {                  
        setError(data.message);
        setUsername('');
        setPassword('');
      }
    }
  });

  const login = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({
      url: '/api/users/login',
      body: {
        username: username,
        password: password,
      },
    });
    setTimeout(() => navigate('/'), 2000);
  };

  return (
    <div className='register-login'>
      <h2>Login</h2>
      <form onSubmit={login}>
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
          <div className='show-password' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? 'Hide Password' : 'Show Password'}
            {showPassword ? <FontAwesomeIcon icon={faEyeSlash} /> : <FontAwesomeIcon icon={faEye} />}
          </div>
          Password 
          <br></br>
          <input
            className='form-input'
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <button type='submit'>Login</button>
      </form>

      {
        loggedIn && (
          <div>
            Login Successful! Redirecting to home page...
            <div className='loading-line'></div>
          </div>
        )
      }

      {error && error}
    </div>
  );
};

export default Login;