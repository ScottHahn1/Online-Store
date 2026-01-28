import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  email: string;
  setEmail: Dispatch<SetStateAction<string>>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  setShowPassword: Dispatch<SetStateAction<boolean>>;
  showPassword: boolean;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  error: string;
}

const LoginForm = ({
  handleSubmit,
  email,
  setEmail,
  username,
  setUsername,
  setShowPassword,
  showPassword,
  password,
  setPassword,
  error
}: Props) => {
  const isFormValid =
  username.length > 0 && password.length >= 8;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="email">Email:</label>

        <input
          className="form-input"
          id="email"
          type="email"
          placeholder="example@email.com"
          pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="username">Username:</label>

        <input
          className="form-input"
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        {username.length < 5 && (
          <p className="input-hint"> Username must be at least 5 characters </p>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password:</label>

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

        <input
          className="form-input"
          id="password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password.length < 8 && (
          <p className="input-hint">Password must be at least 8 characters</p>
        )}
      </div>

      { error }
    
      <button type="submit" disabled={!isFormValid}>
        Login
      </button>
    </form>
  );
};

export default LoginForm;