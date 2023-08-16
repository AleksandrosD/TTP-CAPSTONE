/* eslint-disable react/prop-types */
export default function Third({ orderedFood, partyTotal, isOrderStarted, handleOrderToggleClose, tableHasPartyOrder}) {
  return (
    <div className="flex flex-col h-[80vh] py-15 shadow-md shadow-black/5">
      <div className="">
        {isOrderStarted && orderedFood && tableHasPartyOrder ? (
          orderedFood.map((order, index) => (
            <div key={index} className="grid grid-cols-3">
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

