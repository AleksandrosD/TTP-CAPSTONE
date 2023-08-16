import { useState } from "react";
import PropTypes from 'prop-types';

//import Books from "../Books"

const category = { type: "" }

export default function AddCategory({ hModal, onAddCategory }) {
  const [categoryState, setCategoryState] = useState(category);

  const handleInputChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setCategoryState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddCategoryFormSubmit = async (e) => {
    e.preventDefault();

    // Check if the category name is empty
    if (!categoryState.type.trim()) {
      alert("Category name cannot be empty!");
      return;
    }

    hModal();
    const preparedCategories = {
      ...categoryState,
    };

    const response = await fetch("/api/restaurant/foodCategories", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preparedCategories),
    });

    const newCategory = await response.json();
    console.log(newCategory);
    onAddCategory(newCategory);
    setCategoryState(category);
  };

  return (
    <div>
      <form
        className=" selection:bg-blue-200 flex flex-col gap-2 text-center "
      >
        <h1 className="text-3xl">Add a Food Category!</h1>

        <fieldset className="flex flex-col ">
          <label htmlFor="title">Category Name</label>
          <input
            onChange={handleInputChange}
            value={categoryState.type}
            type="text"
            name="type"
            id="type"
            className="bg-white border-4 focus:outline-none p-2"
          />
        </fieldset>
        <input
          className=" bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 mr-4 rounded-full border border-red-600"
          type="submit"
          onClick={handleAddCategoryFormSubmit}
        ></input>
      </form>
    </div>
  );
}

AddCategory.propTypes = {
  hModal: PropTypes.func.isRequired,
  onAddCategory: PropTypes.func.isRequired,
};