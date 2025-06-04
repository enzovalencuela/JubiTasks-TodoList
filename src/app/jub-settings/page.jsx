"use client";

import React, { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig";
import Image from "next/image";

// Componentes
import BackButton from "../../components/BackButton";
import ThemeButton from "../../components/ThemeSwitch2";

// Imagens
import patoConfig from "../../../public/assets/pato-config.png";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function SettingsPage() {
  const [tasks, setTasks] = useState([]);
  const [firebaseIdToken, setFirebaseIdToken] = useState(null);
  const [taskSize, setTaskSize] = useState("medium");

  // --- Efeito para Observar o Estado de Autenticação e Obter o Firebase ID Token ---
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const idToken = await currentUser.getIdToken();
          setFirebaseIdToken(idToken);
        } catch (error) {
          console.error("Erro ao obter Firebase ID Token:", error);
        }
      } else {
        setFirebaseIdToken(null);
        setTasks([]); // Limpa as tarefas se o usuário deslogar
      }
    });
    return () => unsubscribe();
  }, []);

  // --- Efeito para Buscar Tarefas do Backend (quando o token estiver disponível) ---
  useEffect(() => {
    const fetchTasksForSettings = async () => {
      if (firebaseIdToken) {
        try {
          const response = await fetch(`${backendUrl}/tasks`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${firebaseIdToken}`,
            },
          });
          if (response.ok) {
            const data = await response.json();
            setTasks(data); // Define as tarefas com os dados do backend
          } else {
            console.error(
              "Falha ao buscar tarefas para configurações:",
              response.status,
              await response.text()
            );
          }
        } catch (error) {
          console.error(
            "Erro de rede ao buscar tarefas para configurações:",
            error
          );
        }
      }
    };

    fetchTasksForSettings();
    // A lista de dependências garante que a busca seja executada novamente se o token mudar
  }, [firebaseIdToken, backendUrl]); // Adicione backendUrl também por boa prática, embora raramente mude.

  // --- Efeito para Carregar Preferências do LocalStorage (exceto tarefas) ---
  useEffect(() => {
    const savedTaskSize = localStorage.getItem("taskSize");
    if (savedTaskSize !== null) {
      setTaskSize(savedTaskSize);
    }

    const handleStorageChange = (event) => {
      if (event.key === "taskSize") {
        setTaskSize(event.newValue || "medium");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
  const handleTaskSizeChange = (event) => {
    const newSize = event.target.value;
    setTaskSize(newSize);
    localStorage.setItem("taskSize", newSize);
  };

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Configurações
        </h1>
        <p className="text-lg mb-10 font-semibold">
          Opa! Vamos configurar seu JubiTasks! Vamos dar uma olhada em algumas
          alterações possíveis?
        </p>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={patoConfig}
            className="h-auto w-40 mb-10 object-cover"
            alt="pato"
            priority
          />
        </div>

        <div className="flex flex-col items-center justify-center w-full gap-14 mb-14 bg-[var(--subbackground)] rounded-lg shadow-md p-2 py-4">
          <div className="w-full flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">Tema</span>
            </div>
            <div>
              <ThemeButton />
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <span className="text-2xl font-semibold">
                Tamanho das Tarefas
              </span>
            </div>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-white py-2 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:ring-opacity-50 transition-all duration-300 ease-in-out cursor-pointer"
                value={taskSize}
                onChange={handleTaskSizeChange}
              >
                <option value="small" className="text-black bg-white">
                  Pequeno
                </option>
                <option value="medium" className="text-black bg-white">
                  Médio
                </option>
                <option value="large" className="text-black bg-white">
                  Grande
                </option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-white">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 6.757 7.586 5.343 9z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
