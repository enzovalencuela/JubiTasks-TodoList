"use client";

import React, { useState } from "react";
import BackButton from "../../components/BackButton";
import patofaq from "../../../public/assets/pato-faq.png";
import Image from "next/image";

export default function HelpPage() {
  const [activeQuestion, setActiveQuestion] = useState(null);

  const faqItems = [
    {
      question: "Como faço para criar uma nova tarefa?",
      answer:
        "Para criar uma nova tarefa, vá para a tela inicial, clique no botão flutuante '+' no canto inferior direito e preencha os detalhes como título, descrição e prazo.",
    },
    {
      question: "Posso alterar o tema do aplicativo?",
      answer:
        "Sim! Na página de **Configurações**, você encontrará a opção 'Tema'. Clique no botão para alternar entre os temas claro e escuro.",
    },
    {
      question: "Como altero o tamanho das tarefas na tela inicial?",
      answer:
        "Para isso, basta ir em **Configurações**, em 'tamanho da tarefa' terá o tamanho que está configurado. Você pode escolher aquele que fica melhor para você: 'Pequeno', 'Médio' ou 'Grande'.",
    },
    {
      question: "Onde minhas tarefas são salvas?",
      answer:
        "Suas tarefas são salvas no banco de dados do back-end do JubiTasks, necessitando assim de internet para acessá-las.",
    },
    {
      question: "Existe um limite para o número de tarefas?",
      answer:
        "Não há um limite estrito imposto pelo aplicativo, mas o desempenho pode variar dependendo da quantidade de tarefas e da capacidade do seu dispositivo.",
    },
    {
      question: "Como entrar em contato com o suporte?",
      answer:
        "Atualmente, o suporte é feito através de nossa documentação e seções de ajuda. Se tiver uma dúvida específica que não encontrou aqui, por favor, verifique futuras atualizações para opções de contato direto.",
    },
  ];

  const toggleQuestion = (index) => {
    setActiveQuestion(activeQuestion === index ? null : index);
  };

  return (
    <div className="flex flex-col h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Central de Ajuda
        </h1>
        <p className="text-lg mb-10 font-semibold ">
          Opa! O Jubileu chegou pra te dar uma mãozinha! Que tal a gente dar uma
          olhadinha nas perguntas mais frequentes sobre como usar o nosso app?
        </p>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={patofaq}
            className="h-auto w-40 mb-10 object-cover"
            alt="pato"
            priority
          />
        </div>

        <section className="mb-14 text-left">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text w-fit">
            Perguntas Frequentes (FAQ)
          </h2>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--subbackground)] rounded-lg shadow-md overflow-hidden"
              >
                <button
                  className="flex justify-between items-center w-full p-4 text-left focus:outline-none bg-[var(--subbackground)]"
                  onClick={() => toggleQuestion(index)}
                >
                  <span className="font-semibold text-lg text-[var(--text)]">
                    {item.question}
                  </span>
                  <span
                    className={`text-xl transition-transform duration-300 ${
                      activeQuestion === index ? "rotate-90" : ""
                    }`}
                  >
                    ➤
                  </span>
                </button>
                {activeQuestion === index && (
                  <div className="p-4 pt-0 text-[var(--text-secondary)] bg-[var(--subbackground)]">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* --- */}

        <section className="text-left mb-14 ">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text w-fit">
            Dicas Rápidas
          </h2>
          <ul className="list-disc list-inside space-y-2 text-[var(--text)] bg-[var(--subbackground)] rounded-lg shadow-md p-4">
            <li>
              Mantenha o aplicativo atualizado para as últimas funcionalidades.
            </li>
            <li>
              Use a função de pesquisa para encontrar tarefas rapidamente.
            </li>
            <li>Organize suas tarefas com prazos para melhor gestão.</li>
            <li>Explore as Configurações para personalizar sua experiência.</li>
          </ul>
        </section>

        <section className="text-left">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text w-fit">
            Ainda Precisa de Ajuda?
          </h2>
          <p className="text-lg text-[var(--text)] bg-[var(--subbackground)] rounded-lg shadow-md p-4">
            Se você não encontrou a resposta para sua pergunta, considere
            verificar a documentação completa do aplicativo ou aguarde futuras
            atualizações para mais opções de suporte.
          </p>
        </section>
      </div>
    </div>
  );
}
