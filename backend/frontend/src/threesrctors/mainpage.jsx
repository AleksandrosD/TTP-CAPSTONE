import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const videoPath = "/videoplayback.mp4"; // Replace with the actual path to your video file
const logoUrl = "/logo.png";

export default function Main() {
  const [showLogoAndPurpose, setShowLogoAndPurpose] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLogoAndPurpose(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-screen h-screen  overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoPath} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showLogoAndPurpose && (
        <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center">
          {/* Logo */}
          <img
            src={logoUrl}
            alt="Logo"
            className="h-64 md:h-96  opacity-0 animate-fade-in"
            style={{
              animationDuration: "1s",
              animationDelay: "0.1s",
              animationFillMode: "forwards",
            }}
          />

          {/* Purpose */}
          <div
            className="text-white text-center  px-8 opacity-0 animate-fade-in"
            style={{
              animationDuration: "1s",
              animationDelay: "0.5s",
              animationFillMode: "forwards",
            }}
          >
            <div className="text-white text-center mt-4 md:mt-8">
              <h1 className="text-3xl md:text-4xl font-semibold">
                Our Purpose
              </h1>
              <p className="text-lg md:text-xl mt-2">
                Our purpose is to empower small restaurants with a user-friendly
                application that efficiently
                <br />
                tracks their orders and expenses. By streamlining these
                processes, we aim to alleviate the
                <br />
                administrative burden on restaurant owners, allowing them to
                focus more on delivering exceptional
                <br />
                dining experiences to their valued customers. Our mission is to
                contribute to the growth and
                <br />
                success of these establishments, enabling them to thrive in the
                competitive culinary landscape.
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="mt-8 md:mt-12 flex flex-col space-y-4 md:space-y-0 md:flex-row opacity-0 animate-fade-in"
            style={{
              animationDuration: "1s",
              animationDelay: "1s",
              animationFillMode: "forwards",
            }}
          >
            <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold mr-2">
              <Link to="/login" className="text-red-500">
                Log In
              </Link>
            </button>
            <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold mr-2">
              <Link to="/signup" className="text-red-500">
                Sign Up
              </Link>
            </button>
            <button className="bg-white text-black px-6 py-2 rounded-lg font-semibold">
              <a href="/how-to-use" className="text-red-500">
                How to Use
              </a>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
