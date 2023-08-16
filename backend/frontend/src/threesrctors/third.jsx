import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Third({
  orderedFood,
  partyTotal,
  isOrderStarted,
  handleOrderToggleClose,
  tableHasPartyOrder,
  handleFoodRemoved,
  partyOrderId
}) {
  const handleFoodRemoval = async (foodToRemove) => {
    try {
      const response = await fetch(`/api/restaurant/orderFoods/${foodToRemove.foodId}/${partyOrderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.error('Error deleting food:', response.statusText);
        return;
      }

      handleFoodRemoved(foodToRemove);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex flex-col h-[80vh] py-15 shadow-md shadow-black/5">
      <div className="">
        {isOrderStarted && orderedFood && tableHasPartyOrder ? (
          orderedFood.map((order, index) => (
            <div key={index} className="grid grid-cols-4 text-xl">
              <button
                className="text-red-500 hover:red-red-800 mb-2"
                onClick={() => {
                  console.log("Clicked on order:", order);
                  handleFoodRemoval(order);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
              <h1 className="mx-auto mb-2 col-span-1">{order.name}</h1>
              <h1 className="mx-auto mb-2 col-span-1">{order.quantity}</h1>
              <h1 className="mx-auto mb-2 col-span-1">
                ${order.price * order.quantity}
              </h1>
            </div>
          ))
        ) : (
          console.log()
        )}
      </div>


      {isOrderStarted && tableHasPartyOrder && (
        <div className="text-center mt-auto text-red-600 font-bold rounded-full">
          <h1 className="text-lg">Total: ${partyTotal}</h1>
          <hr className="mx-auto mt-4 mb-4 w-3/5 border-solid border-t-2 border-red-600" />
          <button
            className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 mt-4 rounded-full border border-red-600"
            onClick={handleOrderToggleClose}
          >
            DONE
          </button>
        </div>
      )}
    </div>
  );
}

Third.propTypes = {
  orderedFood: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      quantity: PropTypes.number.isRequired,
      price: PropTypes.number.isRequired,
      // Add any other relevant properties for the ordered food item
    })
  ).isRequired,
  partyTotal: PropTypes.number.isRequired,
  isOrderStarted: PropTypes.bool.isRequired,
  handleOrderToggleClose: PropTypes.func.isRequired,
  tableHasPartyOrder: PropTypes.bool.isRequired,
  handleFoodRemoved: PropTypes.func.isRequired,
  partyOrderId: PropTypes.number.isRequired,
};


// import PropTypes from "prop-types";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faTimes } from "@fortawesome/free-solid-svg-icons";

// export default function Third({
//   orderedFood,
//   partyTotal,
//   isOrderStarted,
//   handleOrderToggleClose,
//   tableHasPartyOrder,
//   handleFoodRemoved,
//   partyOrderId
// }) {
//   const handleFoodRemoval = async (foodToRemove) => {
//     try {
//       const response = await fetch(`/api/restaurant/orderFoods/${foodToRemove.foodId}/${partyOrderId}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       if (!response.ok) {
//         console.error('Error deleting food:', response.statusText);
//         return;
//       }

//       handleFoodRemoved(foodToRemove);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="flex flex-col h-[80vh] py-15 shadow-md shadow-black/5">
//       <div className="">
//         {isOrderStarted && orderedFood && tableHasPartyOrder ? (
//           orderedFood.map((order, index) => (
//             <div key={index} className="flex text-xl mb-2">
//               <h1 className="mx-auto">{order.name}</h1>
//               <h1 className="mx-auto">{order.quantity}</h1>
//               <h1 className="mx-auto">
//                 ${order.price * order.quantity}
//               </h1>
//               <button
//                 className="text-red-500 hover:red-red-800 mr-2"
//                 onClick={() => {
//                   console.log("Clicked on order:", order); // Log the order details
//                   handleFoodRemoval(order);
//                 }}
//               >
//                 <FontAwesomeIcon icon={faTimes} />
//               </button>
//             </div>
//           ))
//         ) : (
//           console.log()
//         )}
//       </div>
//       {isOrderStarted && tableHasPartyOrder && (
//         <div className="text-center mt-auto text-red-600 font-bold rounded-full">
//           <h1 className="text-lg">Total: ${partyTotal}</h1>
//           <hr className="mx-auto mt-4 mb-4 w-3/5 border-solid border-t-2 border-red-600" />
//           <button
//             className="bg-white hover:bg-red-600 hover:border-red-600 hover:text-white text-red-600 font-bold py-1 px-6 mb-4 mt-4 rounded-full border border-red-600"
//             onClick={handleOrderToggleClose}
//           >
//             DONE
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }


