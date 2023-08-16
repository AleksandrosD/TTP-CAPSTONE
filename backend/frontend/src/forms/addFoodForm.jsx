import { useState } from "react";
import PropTypes from "prop-types";

const initialFoodState = {
  name: "",
  price: "",
  FoodCategoryId: "",
};

export default function AddFoodForm({ hModal, fCategories }) {
  const [foodData, setFoodData] = useState(initialFoodState);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === "price" && (isNaN(value) || parseFloat(value) <= 0)) {
      console.log("No No No");
      return;
    }

    setFoodData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCategoryFormSubmit = async (e) => {
    e.preventDefault();

    // Check if any required field is empty
    if (!foodData.name.trim() || !foodData.price || !foodData.FoodCategoryId) {
      alert("All fields must be filled out!");
      return;
    }

    hModal();
    const preparedFoods = {
      ...foodData,
    };

    const response = await fetch(
      `/api/restaurant/foodCategories/${foodData.FoodCategoryId}/foods`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preparedFoods),
      }
    );

    const newFood = await response.json();
    console.log(newFood);

    setFoodData(initialFoodState);
  };

  return (
    <div>
      <form className="selection:bg-blue-200 flex flex-col gap-2 text-center">
        <h1 className="text-3xl">Add a Food!</h1>

        <fieldset className="flex flex-col">
          <label htmlFor="name">Food Name</label>
          <input
            onChange={handleInputChange}
            value={foodData.name}
            type="text"
            name="name"
            id="name"
            className="bg-white border-4 focus:outline-none p-2"
          />
        </fieldset>

        <fieldset className="flex flex-col">
          <label htmlFor="price">Food Price</label>
          <input
            onChange={handleInputChange}
            value={foodData.price}
            type="text"
            name="price"
            id="price"
            className="bg-white border-4 focus:outline-none p-2"
          />
        </fieldset>

        {fCategories && fCategories.length > 0 ? (
          <fieldset className="flex flex-col">
            <label htmlFor="FoodCategoryId">Food Category</label>
            <select
              name="FoodCategoryId"
              id="FoodCategoryId"
              onChange={handleInputChange}
              value={foodData.FoodCategoryId}
              className="bg-white border-4 focus:outline-none p-2"
            >
              <option value="">Select a category</option>
              {fCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.type}
                </option>
              ))}
            </select>
          </fieldset>
        ) : (
          console.log("Nothing to see here")
        )}

        <input
          className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 mr-4 rounded-full border border-red-600"
          type="submit"
          onClick={handleAddCategoryFormSubmit}
        ></input>
      </form>
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
