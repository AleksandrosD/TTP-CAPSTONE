import PropTypes from 'prop-types';

function Modal({ isVisible, hideModal, children }) {
  if (!isVisible) {
    return null;
  }


  return (
    <div onClick={hideModal} className="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex justify-center items-center">
      <div onClick={(e) => e.stopPropagation()} className="max-w-xl w-3/4 mx-auto flex flex-col">
        <div className="bg-white text-gray-800 p-8">
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isVisible: PropTypes.bool.isRequired,   // Indicates whether the modal is visible
  hideModal: PropTypes.func.isRequired,   // Function to hide or close the modal
  children: PropTypes.node.isRequired    // Content to be rendered within the modal
};

export default Modal;