/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';

export default function Table({ table, onDelete, onClick, highlighted }) {
  const handleDelete = () => {
    onDelete(table.id);
  };

  return (
    <div className="flex justify-center items-center">
      <div >
        <button className={`w-full py-2 my-1 px-10 rounded ${highlighted ? 'bg-red-600 text-white' : 'border border-red-500 text-gray-950 hover:bg-red-400 hover:text-white hover:delay-75'
          }`}
          onClick={onClick}
        >
          Table: {table.tableNum}
        </button>
      </div>
      <button
        className="text-red-600 hover:text-red-800 font-bold py-1 px-2 ml-2 rounded"
        onClick={handleDelete}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>
      </button>
    </div>
  );
}

Table.propTypes = {
  table: PropTypes.shape({
    id: PropTypes.number.isRequired,
    tableNum: PropTypes.number.isRequired,
  }).isRequired,
  onDelete: PropTypes.func.isRequired,
};
