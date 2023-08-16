import { Link, Form, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";



export default function SignupForm() {
  const { currentUser, signup } = useContext(AuthContext);
  
  if (currentUser) {
    return <Navigate to="/user" />;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const credentials = Object.fromEntries(formData);
    await signup(credentials);
  };

  return (
    <div className="flex flex-col items-center h-screen bg-[#f1f1f1]">
      <img
        className="mt-8"
        src="/logo.png"
        alt="Runner Logo"
      />
      <div className="mt-4 w-96"></div>
      <div>
        <Form
          method="post"
          className=" selection:bg-blue-200 w-96 flex flex-col gap-2 text-center "
          onSubmit={handleSubmit}
        >
          <fieldset className="flex flex-col ">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              className="bg-white border-4 focus:outline-none p-2"
            />
          </fieldset>
          <fieldset className="flex flex-col  ">
            <label htmlFor="rName">Restaurant Name</label>
            <input
              id="rName"
              type="text"
              name="rName"
              className="bg-white border-4 focus:outline-none p-2"
            />
          </fieldset>
          <fieldset className="flex flex-col  ">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="bg-white border-4 focus:outline-none p-2"
            />
          </fieldset>
          <fieldset className="flex flex-col  ">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="bg-white border-4 focus:outline-none p-2"
            />
          </fieldset>

          <button className="bg-gray-300 hover:bg-gray-400 text-white font-bold py-2 px-4 mt-4 rounded-full">
            Sign Up
          </button>
        </Form>
        <p className="mt-4 text-center"> Already a member?   <Link to="/login" className="text-red-500" >Login</Link> </p>
      </div>
    </div>
  );
}
