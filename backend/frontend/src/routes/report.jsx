import { useEffect, useContext, useState } from "react";
import { useNavigation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


function Report() {
    const { setCurrentUser } = useContext(AuthContext);
    const [currentUser, setCurrentU] = useState({});
    const navigation = useNavigation();

    useEffect(() => {
        const fetchCurrentUser = async () => {
          try {
            // Fetch the current user from API
            const response = await fetch("/api/auth/current_user");
            const { user } = await response.json();
            
            // Update the currentUser state
            setCurrentU(user);
          } catch (error) {
            console.error(error);
            setCurrentU(null); // Fix the typo here from setCurrentU to setCurrentUser
          }
        };
      
        // Call the function to fetch the current user when the component mounts
        fetchCurrentUser();
      }, []);

    const handleLogout = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/auth/logout", {
          method: "DELETE",
        });
        if (response.ok) {
          setCurrentUser(null);
          navigation.navigate("/login");
        }
      };

      const [realTime, setRealTime] = useState(Date.now());
      function getRealTime() {
        const currentTime = Date.now();
        return (Math.floor(currentTime / 1000) + 1) * 1000 - currentTime;
      }
    
      (async function () {
        let reduceTime = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          reduceTime = getRealTime();
          await sleep(reduceTime);
        }
      })();
    
    
      function sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
      }
    
    
      useEffect(() => {
        (async function () {
          let reduceTime = 0;
          // eslint-disable-next-line no-constant-condition
          while (true) {
            reduceTime = getRealTime();
            setRealTime(new Date());
            await sleep(reduceTime);
          }
        })();
      }, []);
return(
    <div>
   <nav className="flex-no-wrap relative flex w-full items-center justify-between bg-[#f1f1f1] shadow-md shadow-black/5 ">
  <img className="h-40 mx-10" src="/logo.png" alt="Runner Logo"></img>
  <div>
    <h2 className="text-5xl text-red-600">{currentUser.name}</h2>
  </div>

  <div className="flex flex-col items-center justify-center mx-10 text-lg">
    <div className="flex space-x-4">
      <button className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mt-4 rounded-full border border-red-600">
        <Link to="/user">
          Main
        </Link>
      </button>
    
      <button
        className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mt-4 rounded-full border border-red-600"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
    
    <div className="mt-4">{realTime.toLocaleString()}</div>
  </div>
</nav>

</div>
)
}

export default Report;