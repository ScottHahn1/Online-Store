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
        setUser({ email: data.email, userId: data.userId, username: data.username });
        setAccessToken(data.token);
        setLoggedIn(true);
        setTimeout(() => navigate('/'), 2000);
    },
    onError: (err) => setError(err.message)
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

      <LoginForm
        handleSubmit={login}
        email={email}
        setEmail={setEmail}
        username={username}
        setUsername={setUsername}
        setShowPassword={setShowPassword}
        showPassword={showPassword}
        password={password}
        setPassword={setPassword}
        error={error}
      />

      {
        loggedIn && (
          <div>
            Login Successful! Redirecting to home page...
            <div className='loading-line'></div>
          </div>
        )
      }
    </div>
  );
};

export default Login;