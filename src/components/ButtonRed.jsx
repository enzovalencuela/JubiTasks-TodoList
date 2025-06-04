import Link from "next/link";
import React from "react";

function ButtonRed({ buttonText, buttonStyle, buttonLink, disabled, onClick }) {
  const buttonClasses = `${buttonStyle} bg-[radial-gradient(circle_at_center,var(--buttonRed),var(--buttonLightRed))] rounded-4xl p-2 text-[#ffffff] font-[600] w-[312px] ${
    disabled
      ? "opacity-50 cursor-not-allowed"
      : "cursor-pointer hover:brightness-110"
  }`;

  if (buttonLink && !disabled) {
    return (
      <Link href={buttonLink} className="w-full">
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

export default ButtonRed;
