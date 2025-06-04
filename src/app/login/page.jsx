// src/app/login/page.js
"use client";

import Image from "next/image";
import React, { useState } from "react";
import Input from "../../components/Input";
import InputPassword from "../../components/InputPassword";
import GoogleLoginButton from "../../components/ButtonGoogle";
import PatoImg from "../../../public/assets/splash-pato.png";
import Button from "../../components/Button";
import { auth } from "../../firebaseConfig";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const firebaseIdToken = await user.getIdToken();
        const backendResponse = await fetch(`${backendUrl}/user-data`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseIdToken}`,
          },
        });

        if (backendResponse.ok) {
          const backendData = await backendResponse.json();
          localStorage.setItem("jwt_token", firebaseIdToken);
          localStorage.setItem("loggedInUserEmail", backendData.email);

          router.push("/dashboard");
        } else {
          const errorText = await backendResponse.text();
          console.error(
            "Erro do backend após login Firebase:",
            backendResponse.status,
            errorText
          );
          setErrorMessage(
            "Erro ao obter dados do usuário no backend. Tente novamente."
          );
        }
      }
    } catch (error) {
      console.error("Erro ao fazer login com e-mail/senha (Firebase):", error);
      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        setErrorMessage("E-mail ou senha inválidos.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage(
          "Muitas tentativas de login. Tente novamente mais tarde."
        );
      } else {
        setErrorMessage("Erro ao fazer login. Verifique seu e-mail e senha.");
      }
    }
  };

  const handleGoogleLoginSuccess = async (user) => {
    if (user) {
      const firebaseIdToken = await user.getIdToken();
      try {
        const response = await fetch(`${backendUrl}/google-login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseIdToken}`,
          },
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
          }),
        });

        if (response.ok) {
          localStorage.setItem("jwt_token", firebaseIdToken);
          localStorage.setItem("loggedInUserEmail", user.email);
          router.push("/dashboard");
        } else {
          console.error(
            "Erro na resposta do backend ao sincronizar dados do Google:",
            response.status,
            await response.text()
          );
          setErrorMessage(
            "Erro ao sincronizar dados do Google com o servidor."
          );
        }
      } catch (error) {
        console.error(
          "Erro ao fazer requisição para sincronização do Google (CATCH):",
          error
        );
        setErrorMessage("Erro de conexão ao sincronizar com o servidor.");
      }
    }
  };

  return (
<div className="flex flex-col items-center gap-24 justify-center px-8 min-h-screen">
      <h2 className="text-[32px] font-[700] text-center pt-[30px]">
        Jubileu está esperando sua próxima tarefa!
      </h2>
      <div className="flex flex-col lg:flex-row justify-center lg:gap-24">
        <Image
          src={PatoImg}
          className="h-[200px] w-auto object-contain"
          alt="Pato"
          priority
        />

        <div className="flex flex-col items-center lg:mr-15">
          <form onSubmit={handleFormSubmit} className="mb-6">
            <Input
              type="email"
              id="email"
              label="E-mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setIsEmailFilled(e.target.value.trim() !== "");
              }}
              placeholder="seu@email.com"
            />
            <InputPassword
              id="password"
              label="Senha"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setIsPasswordFilled(e.target.value.trim() !== "");
              }}
              placeholder="sua senha"
            />
            <Button
              buttonText="Entrar"
              buttonStyle="mt-[25px]"
              type="submit"
              disabled={!isEmailFilled || !isPasswordFilled}
            />
          </form>
          <GoogleLoginButton onSuccess={handleGoogleLoginSuccess} />
          {/* Adicione as classes de hover aqui! */}
          <Link href="/register">
            <button className="cursor-pointer mt-[20px] self-center underline text-[#676767] hover:text-[#007bff] hover:no-underline">
              cadastrar-se
            </button>
          </Link>
        </div>
      </div>

      {/* Renderização condicional da mensagem de erro */}
      {errorMessage && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="h-[200px] w-[340px] bg-zinc-900 rounded-2xl border border-[#ffffff] p-4 flex flex-col justify-center text-center text-red-600">
            <h3>{errorMessage}</h3>
            <Button
              buttonText="Fechar"
              buttonStyle="mt-[20px] self-center"
              onClick={() => setErrorMessage("")}
            />
            <Link href="/register">
              {/* Este já estava correto */}
              <button className="cursor-pointer mt-[20px] self-center underline text-[#676767] hover:text-[#007bff] hover:no-underline">
                cadastrar-se
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default Login;