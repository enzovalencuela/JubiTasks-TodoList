import React from "react";
import Button from "./Button";
import ButtonRed from "./ButtonRed";

const ConfirmModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)] z-50">
      <div className="h-[200px] w-[340px] bg-[var(--subbackground)] rounded-2xl  p-4 flex flex-col justify-center text-center text-red-600">
        <h3 className="text-lg font-semibold mb-4">{message}</h3>
        <div className="flex justify-around mt-auto gap-2">
          <Button
            buttonText="Cancelar"
            buttonStyle=" hover:bg-gray-600 font-semibold py-2 rounded-3xl focus:outline-none focus:shadow-outline transition-all duration-300"
            onClick={onCancel}
          />
          <ButtonRed
            buttonText="Confirmar"
            buttonStyle="hover:bg-red-600 text-white font-semibold py-2 rounded-3xl focus:outline-none focus:shadow-outline transition-all duration-300"
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
