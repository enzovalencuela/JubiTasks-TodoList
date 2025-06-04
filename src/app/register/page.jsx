// src/app/register/page.js
"use client";

import Image from "next/image";
import React, { useState } from "react";
import Input from "../../components/Input";
import PatoImg from "../../../public/assets/splash-pato.png";
import Button from "../../components/Button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import InputPassword from "../../components/InputPassword";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isEmailFilled, setIsEmailFilled] = useState(false);
  const [isPasswordFilled, setIsPasswordFilled] = useState(false);
  const [isNameFilled, setIsNameFilled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const router = useRouter();

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (user) {
        const firebaseIdToken = await user.getIdToken();
        const response = await fetch(`${backendUrl}/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseIdToken}`,
          },
          body: JSON.stringify({
            name: name,
            email: email,
          }),
        });

        if (response.status === 409) {
          toast.error(
            <div>
              Este e-mail já está cadastrado.
              <Button
                buttonText="Fazer Login"
                buttonLink="/login"
                buttonStyle="mt-[20px]"
              />
            </div>,
            {
              duration: 5000,
              position: "top-center",
              closeOnClick: true,
              draggable: true,
              pauseOnHover: true,
            }
          );
          return;
        }

        if (!response.ok) {
          const errorData = await response.json();
          toast.error(
            `Erro ao cadastrar: ${errorData.message || "Tente novamente."}`
          );
          return;
        }
        toast.success("Cadastro realizado com sucesso!");
        localStorage.setItem("jwt_token", firebaseIdToken);
        localStorage.setItem("loggedInUserEmail", email);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Erro no cadastro (Firebase ou backend):", error);

      if (error.code === "auth/email-already-in-use") {
        toast.error(
          <div>
            Este e-mail já está em uso.
            <Button
              buttonText="Fazer Login"
              buttonLink="/login"
              buttonStyle="mt-[20px]"
            />
          </div>,
          {
            duration: 5000,
            position: "top-center",
            closeOnClick: true,
            draggable: true,
            pauseOnHover: true,
          }
        );
      } else if (error.code === "auth/weak-password") {
        toast.error("A senha deve ter pelo menos 6 caracteres.");
      } else {
        toast.error("Erro ao cadastrar. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-24 justify-center px-8 min-h-screen">
      <h2 className="text-[32px] font-[700] text-center pt-[30px]">
        Organize suas tarefas com Jubitasks!
      </h2>
      <div className="flex flex-col lg:flex-row justify-center lg:gap-24">
        <Image
          src={PatoImg}
          className="h-[200px] w-auto object-contain"
          alt="Pato"
          priority
        />

        <div className="flex flex-col items-center lg:mr-15">
          <form onSubmit={handleFormSubmit}>
            <Input
              type="text"
              id="name"
              name="name"
              label="Nome"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setIsNameFilled(e.target.value.trim() !== "");
              }}
              placeholder="seu nome"
            />
            <Input
              type="email"
              id="email"
              name="email"
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
              buttonText={isLoading ? "Enviando..." : "Cadastrar-se"}
              buttonStyle="mt-[20px]"
              onClick={handleFormSubmit}
              disabled={
                !isNameFilled ||
                !isEmailFilled ||
                !isPasswordFilled ||
                isLoading
              }
            />
          </form>
          <Link href="/login">
            <button className="cursor-pointer mt-[20px] self-center underline text-[#676767] hover:text-[#007bff] hover:no-underline">
              login
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
