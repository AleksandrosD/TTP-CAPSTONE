// import React from 'react';
import { useEffect, useContext, useState } from "react";
import {
  useNavigation,
  useLoaderData,
  Form,
} from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import First from "../threesrctors/first";
import Second from "../threesrctors/second";
import Third from "../threesrctors/third";

// eslint-disable-next-line no-unused-vars, react-refresh/only-export-components
export async function loader({ request }) {
  const response = await fetch("/api/auth/current_user");
  const tablesrespond = await fetch("/api/restaurant/rTables");
  const foodCategoriesRespond = await fetch("/api/restaurant/foodCategories");
  

  const fCategories = await foodCategoriesRespond.json();
  const tables = await tablesrespond.json();
  if (response.ok) {
    const { user } = await response.json();
    return { currentUser: user, tables, fCategories };
  }
  return { currentUser: null };
}


function Root() {
  const { currentUser } = useLoaderData();
  const { setCurrentUser } = useContext(AuthContext);
  const navigation = useNavigation();
///////////////////////////////////////////////////////
const [selectedTableId, setSelectedTableId] = useState(null);

const handleTableClick = (tableId) => {
  setSelectedTableId(tableId);
};

/////////////////////////////////////////////////////

  useEffect(() => {
    setCurrentUser(currentUser);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

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
  /////////////////////////////////////////////// Nav bar stuff/////////////////

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

  return (
    <div>
      <nav className="flex-no-wrap relative flex w-full items-center justify-between bg-[#f1f1f1] shadow-md shadow-black/5 ">
        <img
          className="h-40 mx-10"
          src="https://cdn.discordapp.com/attachments/669304891662925855/1133077409630007326/image.png"
          alt="Runner Logo"
        ></img>

        <div className="flex flex-col items-center justify-center mx-10 text-lg">
          <Form onSubmit={handleLogout}>
            <button className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mt-4 rounded-full border border-red-600">
              Logout
            </button>
          </Form>
          <div className="mt-4">{realTime.toLocaleString()}</div>
        </div>
      </nav>

      <div className="grid grid-cols-6 gap-4 m-4 ">
        <div className="border w-auto p-2 rounded col-span-1">
          <First onTableClick={handleTableClick}/>
        </div>
        <div className="border w-auto p-2 rounded col-span-4">
          <Second selectedTableId={selectedTableId}  />
        </div>
        <div className="border w-auto p-2 rounded col-span-1">
          <Third />
        </div>
      </div>
    </div>
  );
}

export default Root;
