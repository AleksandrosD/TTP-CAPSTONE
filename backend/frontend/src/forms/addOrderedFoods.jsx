/* eslint-disable react/jsx-key */
/* eslint-disable react/prop-types */
import { useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function AddFoodForm({ hModal, foods, partyOrderId, handleFoodAdded }) {
  // eslint-disable-next-line no-unused-vars
  const [foodsInCategory, setFoodsInCategory] = useState(foods);
  const [foodQuantities, setFoodQuantities] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [totalFoodPrice, setTotalFoodPrice] = useState(0);

  const handleQuantityChange = (food, changeAmount) => {
    setFoodQuantities((prevQuantities) => ({
      ...prevQuantities,
      [food.id]: Math.max((prevQuantities[food.id] || 0) + changeAmount, 0),
    }));
  };

  const handleAddClick = async () => {

    if (!partyOrderId) {
      alert("Can't add food if there are no Orders. Cannot add food.");
      return;
    }

    const orderFoods = [];
    const selectedFoods = [];

    for (const foodId in foodQuantities) {
      if (foodQuantities[foodId] > 0) {
        orderFoods.push({
          FoodId: parseInt(foodId),
          PartyOrderId: partyOrderId,
          Quantity: foodQuantities[foodId],
        });
      }
    }

    for (const foodId in foodQuantities) {
      if (foodQuantities[foodId] > 0) {
        const selectedFood = foodsInCategory.find(food => food.id === parseInt(foodId));

        if (selectedFood) {
          selectedFoods.push({
            foodId: selectedFood.id,
            name: selectedFood.name,
            price: selectedFood.price,
            quantity: foodQuantities[foodId],
          });
        }
      }
    }

    if (orderFoods.length === 0) {
      return;
    }

    if (selectedFoods.length === 0) {
      return;
    }

    try {
      const response = await fetch('/api/restaurant/orderFoods', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderFoods }),
      });

      if (response.ok) {
        const data = await response.json();
        setTotalFoodPrice(data.totalFoodPrice || 0);
        setFoodQuantities({});
        handleFoodAdded(selectedFoods);
        hModal();

      } else {
        console.error('Error adding order foods:', response.statusText);
      }
    } catch (error) {
      console.error('Error adding order foods:', error);
    }
  };

  const handledeleteclick = async (food) => {
    try {
      const response = await fetch(`/api/restaurant/foodCategories/${food.FoodCategoryId}/foods/${food.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        // Update foodsInCategory by removing the deleted food item
        setFoodsInCategory((prevFoods) => prevFoods.filter((prevFood) => prevFood.id !== food.id));
      } else {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error deleting food:', error);
    }
  };

  return (
    <div className="py-5">
      <h1 className="text-center text-2xl p-4">Foods in Selected Category</h1>
      <div className="mx-auto">
        <div className="grid grid-cols-4 gap-x-4">
          <h1 className="">Delete Food</h1>
          <h1 className="">Name</h1>
          <h1 className="">Price</h1>
          <h1 className="">Quantity</h1>
        </div>
        <hr className="mt-4 mb-4 w-full border-solid border-t-2 border-gray-300" />
        {foodsInCategory.map((food) => (
          <div className="grid grid-cols-4 gap-x-4 items-center" key={food.id}>
            <div className="flex items-center">
              <button
                className="text-red-600 hover:text-red-800 font-bold"
                onClick={() => handledeleteclick(food)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <h1 className="">{food.name}</h1>
            <h1 className="">{food.price}</h1>
            <div className="flex items-center">
              <button onClick={() => handleQuantityChange(food, -1)} className="px-1">
                -
              </button>
              <span className="px-2">
                {foodQuantities[food.id] !== undefined ? foodQuantities[food.id] : 0}
              </span>
              <button onClick={() => handleQuantityChange(food, 1)} className="px-1">
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-12">
        <button
          onClick={handleAddClick}
          className="mx-auto bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 rounded-full border border-red-600"
        >
          Add
        </button>
      </div>
    </div>
  );
}

AddFoodForm.propTypes = {
  hModal: PropTypes.func.isRequired,
  fCategories: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
};
