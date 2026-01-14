import Button from "./Button";

export const Modal = ({ isOpen,handleConfirm, onClose, title, description, buttonText }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="modal-container w-full flex flex-wrap items-center justify-center bg-white rounded-md">
          <h1 className="text-lg font-bold  capitalize w-full text-center text-black-3">
            {title}
          </h1>
          <h3 className="mt-4 mb-4 text-sm w-full font-inter font-normal text-center text-neutral-800">
            {description}
          </h3>
          <div className="mt-2 mb-5 flex space-x-4">
            <Button
              variant="secondary"
              className="px-10 font-normal text-base "
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              className="px-10 font-normal text-base"
              onClick={handleConfirm}
            >
              {buttonText}
            </Button>
          </div>
        </div>
      </div>
    );
  };