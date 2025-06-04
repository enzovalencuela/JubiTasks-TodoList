// No seu arquivo GoogleLoginButton.jsx
"use client";

import React from "react";
import GoogleIcon from "../../public/assets/googleIcon.svg";
import Image from "next/image";
import { auth, googleAuthProvider, signInWithPopup } from "../firebaseConfig";

function GoogleLoginButton({ onSuccess, onError }) {
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      if (onSuccess) {
        onSuccess(result.user);
      }
    } catch (error) {
      console.error(
        "Erro ao fazer login com o Google (componente GoogleLoginButton):",
        error
      );
      if (onError) {
        onError(error);
      }
    }
  };

  return (
    <button
      onClick={handleGoogleSignIn}
      className=" cursor-pointer shadow-md transition-all duration-240 hover:[transform:translateY(-.335rem)] hover:shadow-2xl relative flex items-center justify-center mt-[13px] bg-[radial-gradient(circle_at_center,var(--primary)_0%,var(--secondary)_70%)] rounded-4xl p-2 text-[#ffffff] font-[600] w-[312px]"
    >
      <Image className="absolute left-[10px]" src={GoogleIcon} alt="" />
      <span>Entre com sua conta Google</span>
    </button>
  );
}

export default GoogleLoginButton;
