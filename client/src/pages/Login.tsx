import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useState } from "react";
import { useNavigate } from "react-router-dom";
import { postData } from "../utils/Api";
import { useUserContext } from "../contexts/UserContext";
import LoginForm from "../components/LoginForm";

type LoginProps = {
  loggedIn: boolean | null;
  setLoggedIn: Dispatch<SetStateAction<boolean | null>>;
}

type PostVariables = {
  url: string;
  body: {
email: string;
    username: string;
    password: string;
  }
};

const Login = ({ loggedIn, setLoggedIn }: LoginProps) => {
const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(true);

  const navigate = useNavigate();

  const { setUser, setAccessToken } = useUserContext();

  const { mutate } = useMutation({
    mutationFn: (variables: PostVariables) => postData(variables),
    onSuccess: (data) => {
      if (data.success) {      
        setUser({ email: data.email, userId: data.userId, username: data.username });
        setAccessToken(data.token);
        setLoggedIn(true);
setTimeout(() => navigate('/'), 2000);
      } else {                  
        setError(data.message);
              }
    }
  });

  const login = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    mutate({
      url: '/api/users/login',
      body: {
email: email,
        username: username,
        password: password,
      },
    });
    
    setError('')
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