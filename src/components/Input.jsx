import React from "react";

function Input({ type, id, label, value, onChange, placeholder }) {
  return (
    <div className="flex flex-col mb-4">
      <label
        className="text-[var(--text)] font-[700] text-[17px] family-[Roboto]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="bg-[#D9D9D9] rounded-4xl py-2 px-4 text-[#000000] font-[600] w-[312px]"
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

export default Input;
