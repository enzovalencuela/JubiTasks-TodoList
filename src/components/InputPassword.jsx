import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function InputPassword({ label, id, value, onChange, placeholder, ...props }) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative flex flex-col mb-4">
      <label
        className="text-[var(--text)] font-[700] text-[17px] family-[Roboto]"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        className="bg-[#D9D9D9] rounded-4xl py-2 px-4 text-[#000000] font-[600] w-[312px]"
        type={showPassword ? "text" : "password"}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
      <div
        className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center cursor-pointer"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? (
          <EyeSlashIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        ) : (
          <EyeIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

export default InputPassword;
