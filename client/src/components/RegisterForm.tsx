import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction, useState } from "react";

interface Props {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  setError: Dispatch<SetStateAction<string>>;
  error: string;
  setPassword: Dispatch<SetStateAction<string>>;
  password: string;
  confirmPassword: string;
  setConfirmPassword: Dispatch<SetStateAction<string>>;
}

const RegisterForm = ({
  handleSubmit,
  username,
  setUsername,
  setError,
  error,
  setPassword,
  password,
  confirmPassword,
  setConfirmPassword
}: Props) => {
  const [showPassword, setShowPassword] = useState(true);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setUsername(e.target.value);
    setError('');
  };

  const isFormValid =
  username.length > 0 && password.length >= 8 && password === confirmPassword;

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username:</label>

        <input
          className="form-input"
          id="username"
          type="text"
          value={username}
          onChange={(e) => handleUsername(e)}
        />

        {username.length < 5 && (
          <p className="input-hint"> Username must be at least 5 characters </p>
        )}

        {error && <p className="input-error"> {error} </p>}
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

      <div className="form-group">
        <label htmlFor="confirm">Confirm Password:</label>

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
          id="confirm"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

      <button type='submit' disabled={!isFormValid}>
        Sign Up
      </button>
    </form>
  );
};

export default RegisterForm;