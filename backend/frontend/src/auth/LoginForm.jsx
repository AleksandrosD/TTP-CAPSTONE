import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function LoginForm() {
  const { currentUser, login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(false); // State to track login error
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (currentUser) {
    return <Navigate to="/user" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const credentials = { email, password };
    const loginSuccess = await login(credentials);

    if (!loginSuccess) {
      setLoginError(true);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setLoginError(false); // Clear login error when email changes
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setLoginError(false); // Clear login error when password changes
  };

  const isFormValid = email !== "" && password !== "";

  return (
    <div className="flex items-center justify-center h-screen font-serif">
      <div className="w-1/2 p-4">
        <img className="w-fit" src="/1.jpg" alt="Image" />
      </div>
      <div className="w-fit p-4">
        <img className="mx-auto" src="/logo.png" alt="Runner Logo" />
        <div className="w-96 mx-auto mb-20">
          <form
            method="post"
            className="flex flex-col gap-2 w-full text-center"
            onSubmit={handleSubmit}
          >
            <fieldset className="flex flex-col mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="bg-white border-4 border-gray-950 focus:outline-none p-2"
              />
            </fieldset>

            <fieldset className="flex flex-col mb-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="bg-white border-4 border-gray-950 focus:outline-none p-2"
              />
            </fieldset>
            <button
              className={`${isFormValid
                ? "bg-red-500 hover:bg-red-600 hover:duration-300"
                : "bg-gray-300"
                } text-white font-bold py-2 px-4 mt-4 rounded-full`}
              style={isFormValid ? {} : { cursor: "not-allowed" }}
              disabled={!isFormValid}
            >
              Login
            </button>
          </form>
          {loginError && (
            <p className="mt-2 text-red-500 text-center">Wrong Credentials</p>
          )}
          <p className="mt-4 text-center">
            Don&apos;t have an account yet?{' '}
            <Link to="/signup" className="text-blue-800">
              Sign Up
            </Link>{' '}
          </p>
        </div>
      </div>
    </div>
  );
}
