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

  const signUp = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();

    if (username.length < 5) {
      setError("Username must be at least 5 characters");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    setError("");

    mutate({
      url: "/api/users/register",
      body: {
        username,
        password,
      },
    });
  };

  return (
    <div className="register-login">
      <h2>Register</h2>

      <RegisterForm
        handleSubmit={signUp}
        username={username}
        setUsername={setUsername}
        setError={setError}
        error={error}
        setPassword={setPassword}
        password={password}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
      />

      {registerSuccessful && (
        <div>
          Register Successful! Redirecting to login...
          <div className="loading-line"></div>
        </div>
      )}
    </div>
  );
};

export default Register;