import { useEffect, useContext, useState } from "react";
import { useNavigation, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Report() {
  const { setCurrentUser } = useContext(AuthContext);
  const [currentUser, setCurrentU] = useState({});
  const [dailyReports, setDailyReports] = useState([]);
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
        setCurrentU(null);
      }
    };

    const fetchDailyReports = async () => {
      try {
        // Fetch dailyReports data for the current user's RestaurantId
        const response = await fetch(`/api/restaurant/dailyReports/${currentUser.id}`);
        const reports = await response.json();

        // Update the dailyReports state
        setDailyReports(reports.map(report => ({
          ...report,
          eCost: report.eCost,
          sCost: report.sCost
        })));
      } catch (error) {
        console.error(error);
      }
    };

    // Call the functions to fetch data when the component mounts
    fetchCurrentUser();
    fetchDailyReports();
  }, [currentUser.id]);

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

  const handleEditECost = async (reportIndex, newECost) => {
    try {
      const response = await fetch(`/api/restaurant/dailyReports/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eCost: newECost }),
      });

      if (response.ok) {
        const updatedReports = [...dailyReports];
        updatedReports[reportIndex].eCost = newECost;
        setDailyReports(updatedReports);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditSCost = async (reportIndex, newSCost) => {
    try {
      const response = await fetch(`/api/restaurant/dailyReports/${currentUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sCost: newSCost }),
      });

      if (response.ok) {
        const updatedReports = [...dailyReports];
        updatedReports[reportIndex].sCost = newSCost;
        setDailyReports(updatedReports);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <nav className="flex-no-wrap relative flex w-full items-center justify-between ">
        <img className="h-40 mx-10" src="/logo.png" alt="Runner Logo"></img>
        <div>
          <h2 className="text-5xl text-red-600">{currentUser.name}</h2>
        </div>

        <div className="flex flex-col items-center justify-center mx-10 text-lg">
          <div className="flex space-x-4">
            <button className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mt-4 rounded border border-red-600">
              <Link to="/user">
                Main
              </Link>
            </button>

            <button
              className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mt-4 rounded border border-red-600"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>

          <div className="mt-4">{realTime.toLocaleString()}</div>
        </div>

        <style>
          {`
      nav::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background-color: #e0e0e0;
      }
    `}
        </style>
      </nav>


      <div className="mt-60">
        <div>
          <h1 className="text-center text-5xl mt-8 text-red-600">Daily Reports</h1>
          <hr className="mt-4 w-1/2 mx-auto border-solid border-t-2 border-gray-300" />
        </div>
        <div>
          {Array.isArray(dailyReports) && dailyReports.length > 0 ? (
            dailyReports.map((report, index) => (
              <div key={index} className="grid">
                <div className="flex gap-4 justify-center items-center text-xl">
                  <p>Date: {new Date(report.date).toLocaleDateString()}</p>
                  <p>Party Orders Total: {report.partyOrderTotal}</p>
                  <p>Employee Cost: {report.eCost}</p>
                  <p>Supply Cost: {report.sCost}</p>
                  <p>Net Profit: {report.partyOrderTotal - report.eCost - report.sCost}</p>
                </div>
                <div className="grid text-center mt-10 text-xl mx-auto">
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const newECost = parseFloat(e.target.elements.eCost.value);
                      await handleEditECost(index, newECost);
                      e.target.elements.eCost.value = 0; // Reset the input to 0
                    }}
                    className="mb-5"
                  >
                    <label>
                      Edit Employee Cost:
                      <input
                        className="text-center border border-black rounded mx-5"
                        type="number"
                        name="eCost"
                        defaultValue={0}
                        step="1"
                        min="0"
                      />
                    </label>
                    <button className="px-3 py-1 border-2 border-red-600 text-center hover:bg-red-600 hover:text-white rounded" type="submit">Update</button>
                  </form>

                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const newSCost = parseFloat(e.target.elements.sCost.value);
                      await handleEditSCost(index, newSCost);
                      e.target.elements.sCost.value = 0; // Reset the input to 0
                    }}
                    className="mb-5 ml-7"
                  >
                    <label>
                      Edit Supply Cost:
                      <input
                        className="text-center border border-black rounded mx-5"
                        type="number"
                        name="sCost"
                        defaultValue={0}
                        step="1"
                        min="0"
                      />
                    </label>
                    <button className="px-3 py-1 border-2 border-red-600 text-center hover:bg-red-600 hover:text-white rounded" type="submit">Update</button>
                  </form>
                </div>
              </div>
            ))
          ) : (
            <p>No daily report available</p>
          )}
        </div>
      </div>

    </div>
  );
}

export default Report;
