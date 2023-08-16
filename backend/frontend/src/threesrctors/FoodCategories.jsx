import PropTypes from "prop-types";

export default function FoodCategories({ fCategories, onDelete, onClick }) {
  const handleDelete = () => {
    onDelete(fCategories.id);
  };

  const handleCategoryClick = async () => {
    try {
      const response = await fetch(
        `/api/restaurant/foodCategories/${fCategories.id}/foods`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const foods = await response.json();
      onClick(foods); // Pass the fetched foods to the click handler
    } catch (error) {
      console.error("Error fetching foods:", error);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center relative">
  <button
    className="bg-gray-300 hover:bg-gray-400 w-full py-6 my-1 px-10 rounded"
    onClick={handleCategoryClick}
  >
    {fCategories.type}
  </button>
  <button
    className="absolute top-0 right-0 text-red-600 hover:text-red-800 font-bold py-1 px-2 rounded"
    onClick={handleDelete}
  >
   X
  </button>
</div>

  );
}

FoodCategories.propTypes = {
  fCategories: PropTypes.shape({
    id: PropTypes.number.isRequired,
    type: PropTypes.string.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};
