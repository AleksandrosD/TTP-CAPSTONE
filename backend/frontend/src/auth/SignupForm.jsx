import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

export default function SignupForm() {
  const { currentUser, signup } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [rName, setRestaurantName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (currentUser) {
    return <Navigate to="/login" />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const credentials = {
      username,
      rName,
      email,
      password,
    };
    await signup(credentials);
  };

  const isFormValid = username !== "" && rName !== "" && email !== "" && password !== "";

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-1/2 p-4">
        <img className="w-full" src="/2.jpg" alt="Image" />
      </div>
      <div className="w-1/2">
        <img
          className="w-42 h-32 mx-auto"
          src="/logo.png"
          alt="Runner Logo"
        />
        <h1 className="text-3xl text-center">This Is Where Incredible Starts...</h1>
        <p className="text-center">Start Today!</p>
        <div className="mt-10 w-fit mx-auto p-4 rounded-xl">
          <div className="mt-4 w-96">
            <form
              method="post"
              className="selection:bg-blue-200 w-full flex flex-col gap-2 text-center"
              onSubmit={handleSubmit}
            >
              <fieldset className="flex flex-col mb-2">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-white border-2 border-gray-950 focus:outline-none p-2"
                />
              </fieldset>
              <fieldset className="flex flex-col mb-2">
                <label htmlFor="rName">Restaurant Name</label>
                <input
                  id="rName"
                  type="text"
                  name="rName"
                  value={rName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                  className="bg-white border-2 border-gray-950 focus:outline-none p-2"
                />
              </fieldset>
              <fieldset className="flex flex-col mb-2">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white border-2 border-gray-950 focus:outline-none p-2"
                />
              </fieldset>
              <fieldset className="flex flex-col mb-2">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-white border-2 border-gray-950 focus:outline-none p-2"
                />
              </fieldset>
              <button
                className={`${isFormValid
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-gray-300"
                  } text-white font-bold py-2 px-4 mt-4 rounded-full`}
                style={{ border: "none" }}
                disabled={!isFormValid}
              >
                Sign Up
              </button>
            </form>
            <p className="mt-4 text-center">
              Already a member?{" "}
              <Link to="/login" className="text-blue-800 underline">
                Login
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
