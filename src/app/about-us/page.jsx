"use client";
import "ldrs/react/LineSpinner.css";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import patoDiferente from "../../../public/assets/pato-diferente.png";
import BackButton from "../../components/BackButton";
import enzoImg from "../../../public/assets/enzo.png";
import jeanImg from "../../../public/assets/jean.png";
import jonImg from "../../../public/assets/jon.png";
import nicolasImg from "../../../public/assets/nicolas.png";
import laraImg from "../../../public/assets/Lara.png";
const originalTeamMembers = [
  //array com as informações de cada membro
  {
    name: "Edilson Enzo",
    role: "Front-end Developer",
    image: enzoImg,
  },
  {
    name: "Nicolas",
    role: "UI designer",
    image: nicolasImg,
  },
  {
    name: "Jean Flávio",
    role: "Front-end developer",
    image: jeanImg,
  },
  {
    name: "Lara Eridan",
    role: "Back-end Developer",
    image: laraImg,
  },
  {
    name: "Jonathan Amaral",
    role: "Mobile Developer",
    image: jonImg,
  },
];

function shuffleArray(array) {
  //escolher aleatoriamente a ordem em que os membros aparecem na tela para não ter estrelismo
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function about() {
  const [page, setPage] = useState(0);
  const [teamMembers] = useState(() => shuffleArray(originalTeamMembers));
  const totalPages = Math.ceil(teamMembers.length / 3);
  const paginate = (direction) => {
    setPage((prev) => {
      //arrow function que troca de página
      const newPage = prev + direction;
      return Math.max(0, Math.min(newPage, totalPages - 1));
    });
  };

  const currentMembers = teamMembers.slice(page * 3, page * 3 + 3);

  return (
    <div className="flex flex-col min-h-screen w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-8 transition-all duration-300 [var(--subText)]">
      <div className="absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flew-col gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>

      <section className="flex flex-col justfy-center items-center text-center w-full">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4  mt-18">
          Sobre nós
        </h1>
        <p className="text-lg mb-10 font-semibold">
          O que acontece quando 5 programadores, motivados pelo Mega P.S., se
          juntam para encarar esse desafio?
        </p>
        <Image
          src={patoDiferente}
          className="h-auto w-40 mb-10 object-cover"
          alt="pato"
          priority
        />
      </section>

      <section className="w-full p-6 bg-[var(--subbackground)] /70 backdrop-blur rounded-xl shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => paginate(-1)}
            disabled={page === 0}
            className="w-10 h-10 rounded-full bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center disabled:opacity-30 transition hover:scale-110"
          >
            <ArrowLeft size={24} className="text-white" />
          </button>
          <h2 className="text-3xl font-bold text-center flex-1 text-[var(--text)]">
            Time CodeQuack
          </h2>
          <button
            onClick={() => paginate(1)}
            disabled={page >= totalPages - 1}
            className="w-10 h-10 rounded-full bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] flex items-center justify-center disabled:opacity-30 transition hover:scale-110"
          >
            <ArrowRight size={24} className="text-white" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <AnimatePresence initial={false} mode="wait">
            {currentMembers.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.4 }}
                className="bg-[var(--background-2)] rounded-2xl shadow-lg p-6 text-center hover:shadow-2xl transition-shadow"
              >
                <div className="w-36 h-36 rounded-full p-1 mx-auto mb-6 bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)]">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={128}
                      height={128}
                      className="w-32 h-32 rounded-full object-cover"
                    />
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900">
                  {member.name}
                </h3>
                <p className="text-gray-600">{member.role}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      <section className="w-full my-16 bg-[var(--subbackground)] backdrop-blur rounded-xl p-6 shadow-md space-y-6">
        <div className="mb-6">
          <h3 className="text-xl font-bold text-[var(--text)] mb-2">
            📌 Descrição do Projeto
          </h3>
          <p className="text-[var(--text)] font-bold">
            O JubiTasks é uma aplicação web desenvolvida para otimizar o
            gerenciamento de tarefas pessoais e profissionais, proporcionando
            uma experiência intuitiva e eficiente ao usuário. Nosso objetivo com
            o JubiTasks é oferecer uma ferramenta robusta e flexível que ajude o
            usuário a manter suas atividades organizadas e seus prazos sob
            controle
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[var(--text)] mb-2">
            🎯 Desafio
          </h3>
          <p className="text-[var(--text)] font-bold">
            O projeto foi construído sobre uma base tecnológica moderna e
            performática. Next.js, um framework React que nos permitiu criar um
            CRUD de alto desempenho; Autenticação: Utilizamos o Firebase
            Authentication para um sistema de registro e login seguro e
            eficiente; Para o backend, utilizamos o PostgreSQL, que interage com
            o Firebase, Node por ser uma Linguagem Única (back e front), o
            TypeScrypt que permite ao código Node.js ser robusto e compreensível
            e Express que serviu como o 'esqueleto' para organizar e responder
            as requisições do front. O JubiTasks representa não apenas o
            cumprimento dos requisitos de um CRUD de tarefas, mas também a
            aplicação de boas práticas de desenvolvimento web, a preocupação com
            a experiência do usuário e a criação de um produto funcional e
            agradável de usar.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[var(--text)] mb-2">
            🛠️ Processo
          </h3>
          <p className="text-[var(--text)] font-bold">
            Inicialmente, o projeto teve um início um pouco mais gradual. Isso
            se deveu à necessidade de garantir que todos os membros da equipe
            pudessem aprofundar seus conhecimentos e se alinhar plenamente com
            as tecnologias e ferramentas específicas de suas respectivas
            funções. Esse período foi, na verdade, um investimento estratégico
            em capacitação. Posteriormente, priorizou-se a implementação dos
            módulos de registro e login. Entendemos que essas funcionalidades,
            embora pareçam simples na superfície, são o alicerce de qualquer
            aplicação com dados de usuário. A aderência ao protótipo de design
            no Figma nos permitiu focar na implementação da lógica de negócios,
            sabendo que a aparência e a usabilidade já estavam bem definidas.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-[var(--text)] mb-2">
            🙏 Agradecimento
          </h3>
          <p className="text-[var(--text)] font-bold ">
            Gostaríamos de expressar nossa mais sincera gratidão pela
            oportunidade de apresentar o JubiTasks. Além da avaliação, este
            processo seletivo representou uma jornada de aprendizado inestimável
            para toda a nossa equipe. Somos gratos pelos cursos gratuitos que
            foram disponibilizados. O conhecimento adquirido através desses
            recursos foi fundamental e decisivo para a nossa capacitação e para
            a construção do projeto que acabamos de demonstrar. Estamos
            verdadeiramente entusiasmados com a possibilidade de integrar uma
            equipe como a Mega Jr.
          </p>
        </div>
      </section>
      <div className="text-2xl flex flex-col items-center justify-end h-full mb-10">
        <button buttonText="Voltar" buttonLink="/dashboard" />
      </div>
    </div>
  );
}
