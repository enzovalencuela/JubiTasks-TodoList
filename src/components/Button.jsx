import Link from "next/link";
import React from "react";

function Button({ buttonText, buttonStyle, buttonLink, disabled, onClick }) {
  const buttonClasses = `${buttonStyle} 
  inline-block 
  cursor-pointer
  shadow-md
  transition-all 
  duration-240 
  hover:[transform:translateY(-.335rem)] 
  hover:shadow-2xl 
  bg-[radial-gradient(circle_at_center,var(--primary),var(--secondary))] 
  rounded-4xl 
  p-2 
  text-[#ffffff] 
  font-[600] 
  w-[312px] 
  ${
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer hover:brightness-110"
  }`;

  if (buttonLink && !disabled) {
    return (
      <Link href={buttonLink} className="w-full">
        {" "}
        {/* Adicione className para o Link ocupar a largura */}
        <button className={buttonClasses} onClick={onClick} disabled={disabled}>
          {buttonText}
        </button>
      </Link>
    );
  }

  return (
    <button className={buttonClasses} onClick={onClick} disabled={disabled}>
      {buttonText}
    </button>
  );
}

export default Button;
