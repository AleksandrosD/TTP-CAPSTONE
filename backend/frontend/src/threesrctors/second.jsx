import { useState, useEffect } from "react";
import FoodCategories from "./FoodCategories";
import Form from "../forms/addFoodCategorryForm";
import AddFoodForm from "../forms/addFoodForm";
import AddOrderedFood from "../forms/addOrderedFoods";
import Modal from "../ui/modal";

// eslint-disable-next-line react/prop-types
export default function Second({ partyOrderId, isOrderStarted, handleOrderToggle, handleFoodAdded, selectedTableId, tableHasPartyOrder }) {
  const [fCategories, setFCategory] = useState([]);
  const [categoryData, setCategoryData] = useState({});
  const [sortedCategories, setSortedCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddFoodModalVisible, setIsAddFoodModalVisible] = useState(false);
  const [isAddOFModalVisible, setIsAddOFModalVisible] = useState(false);
  const [foodsInSelectedCategory, setFoodsInSelectedCategory] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const foodCategoriesRespond = await fetch("/api/restaurant/foodCategories");
        if (foodCategoriesRespond.ok) {
          const fC = await foodCategoriesRespond.json();
          setFCategory(fC);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData(); // Fetch data when component mounts

    const addFoodButton = document.getElementById("addFood");

    const handleAddFoodClick = () => {
      fetchData(); // Fetch data when the addFood button is clicked
    };

    addFoodButton.addEventListener("click", handleAddFoodClick);

    return () => {
      addFoodButton.removeEventListener("click", handleAddFoodClick);
    };
  }, []);


  const showModal = () => {
    setIsModalVisible(true);
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const showAddFoodModal = () => {
    setIsAddFoodModalVisible(true);
  };

  const hideAddFoodModal = () => {
    setIsAddFoodModalVisible(false);
  };

  const showAddOrderedFood = () => {
    setIsAddOFModalVisible(true);
  };

  const hideAddOrderedFood = () => {
    setIsAddOFModalVisible(false);
  };

  const onAddCategory = (newcategory) => {
    hideModal();
    setSortedCategories((cetegory) => {
      return [...cetegory, newcategory];
    });
  };

  useEffect(() => {
    const handleAddCategory = () => {
      if (!categoryData.type) {
        return;
      }

      const apiEndpoint = "/api/restaurant/foodCategories";

      fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          console.log("Response from server:", data);

          setSortedCategories((prevCategories) => [...prevCategories, data]);

          setCategoryData({});
        })
        .catch((error) => {
          console.error("Error during the POST request:", error);
        });
    };

    const addButton = document.getElementById("addCategoryButton");
    addButton.addEventListener("click", handleAddCategory);

    return () => {
      addButton.removeEventListener("click", handleAddCategory);
    };
  }, [categoryData]);

  useEffect(() => {
    const sortedCategories = [...fCategories].sort((a, b) =>
      a.type.localeCompare(b.type)
    );
    setSortedCategories(sortedCategories);
  }, [fCategories]);

  const handleDeleteCategory = (categoryId) => {
    const apiEndpoint = `/api/restaurant/foodCategories/${categoryId}`;

    fetch(apiEndpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        setSortedCategories((prevCategories) =>
          prevCategories.filter((category) => category.id !== categoryId)
        );
      })
      .catch((error) => {
        console.error("Error during the DELETE request:", error);
      });
  };

  const handleCategoryClick = async (categoryId) => {
    try {
      const response = await fetch(
        `/api/restaurant/foodCategories/${categoryId}/foods`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const foods = await response.json();

      if (foods.length > 0) {
        setFoodsInSelectedCategory(foods);
        showAddOrderedFood();
      } else {
        alert("No foods available in this category.");
      }
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  }

  const renderCategories = sortedCategories.map((category) => (
    <FoodCategories
      fCategories={category}
      key={category.id}
      onDelete={handleDeleteCategory}
      onClick={() => handleCategoryClick(category.id)}
    />
  ));

  return (
    <div className="flex flex-col h-[80vh] items-center justify-center py-15 shadow-md shadow-black/5">
      <div className="grid grid-cols-5 gap-4 mx-auto mb-auto overflow-y-auto">
        {renderCategories}
      </div>

      <Modal isVisible={isModalVisible} hideModal={hideModal}>
        <Form hModal={hideModal} onAddCategory={onAddCategory} />
      </Modal>

      <Modal isVisible={isAddFoodModalVisible} hideModal={hideAddFoodModal}>
        <AddFoodForm hModal={hideAddFoodModal} fCategories={fCategories} />
      </Modal>

      <Modal isVisible={isAddOFModalVisible} hideModal={hideAddOrderedFood}>
        <AddOrderedFood
          hModal={hideAddOrderedFood}
          foods={foodsInSelectedCategory}
          partyOrderId={partyOrderId}
          handleFoodAdded={handleFoodAdded}
        />
      </Modal>

      <div className="flex">
        <button
          id="addFood"
          className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 mr-4 rounded-full border border-red-600"
          onClick={showAddFoodModal}
        >
          Add Food
        </button>

        <button
          id="addCategoryButton"
          className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 rounded-full border border-red-600"
          onClick={showModal}
        >
          Add Menu Category
        </button>

        {!isOrderStarted && !tableHasPartyOrder && selectedTableId !== null ? (
          <button
            className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 ml-4 rounded-full border border-red-600"
            onClick={handleOrderToggle}
          >
            Start Order
          </button>
        ) : (console.log())}
      </div>
    </div>
  );
}
