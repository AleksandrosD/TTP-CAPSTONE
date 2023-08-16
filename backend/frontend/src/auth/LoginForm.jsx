import { Form,Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";




export default function LoginForm() {
  const { currentUser, login } = useContext(AuthContext);
  const [loginError, setLoginError] = useState(false); // State to track login error

  if (currentUser) {
    return <Navigate to="/user" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const credentials = Object.fromEntries(formData);
    const loginSuccess = await login(credentials);

    if (!loginSuccess) {
      setLoginError(true);
    }
  };

  return (
    <div className="flex flex-col items-center h-screen bg-[#f1f1f1]">
      <img className="mt-8" src="/logo.png" alt="Runner Logo" />
      <div className="mt-4 w-96"></div>
      <div>
        <form
          method="post"
          className="flex flex-col gap-2 w-96 text-center"
          onSubmit={handleSubmit}
        >
          <fieldset className="flex flex-col">
            <label htmlFor="title">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-white border-4 focus:outline-none p-2"
            />
          </fieldset>

          <fieldset className="flex flex-col">
            <label htmlFor="title">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="bg-white border-4 focus:outline-none p-2"
            />
          </fieldset>
          <button className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 mt-4 rounded-full">
            Login
          </button>
        </form>
        {loginError && (
          <p className="mt-2 text-red-500 text-center">Wrong Credentials</p>
        )}
        <p className="mt-4 text-center">
          Don't have an account yet?{' '}
          <Link to="/signup" className="text-red-500">
            Sign Up
          </Link>{' '}
        </p>
      </div>
    </div>
  );
}