import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faPencilAlt,
  faCog,
  faInfoCircle,
  faQuestionCircle,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import { signOut } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useRouter } from "next/navigation";

// Variantes para animações do menu
const sidebarVariants = {
  open: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.3,
    },
  },
  closed: {
    x: "100%",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      duration: 0.3,
    },
  },
};

const MenuHamburguer = ({ profilePicture }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [userName, setUserName] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(
    "/assets/default-avatar.png"
  );
  const menuRef = useRef(null);
  const router = useRouter();
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          const response = await fetch(`${backendUrl}/user-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.name) {
            setUserName(data.name);
          } else {
            setUserName(user.displayName || "Usuário Anônimo");
          }
        } catch (error) {
          console.error("Erro ao buscar nome do usuário no backend:", error);
          setUserName(user.displayName || "Usuário Anônimo");
        }

        setProfilePhotoUrl(user.photoURL || "/assets/default-avatar.png");
        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const date = new Date(creationTime);
          const formattedDate = date.toLocaleDateString();
          setCreationDate(formattedDate);
        }
      } else {
        setUserName(null);
        setCreationDate(null);
        setProfilePhotoUrl("/assets/default-avatar.png");
      }
    });

    return () => unsubscribe();
  }, [backendUrl]);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (isLargeScreen) {
      setIsOpen(true);
      return;
    }
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLargeScreen]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        router.push("/");
        setIsOpen(false);
      })
      .catch((error) => {
        console.error("Erro ao fazer logout:", error);
      });
  };

  return (
    <div className="text-[#fff5ee]">
      {/* Botão do Menu Hamburguer */}
      <button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden text-[var(--primary)] hover:text-[#8b8b8b] transition-colors cursor-pointer"
        aria-label="Abrir Menu"
      >
        <FontAwesomeIcon icon={faBars} size="2x" />
      </button>

      {/* Menu Lateral */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={menuRef}
            variants={sidebarVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 right-0 lg:left-0 h-screen w-80 bg-background shadow-lg z-50 p-6 space-y-8 border-l border-gray-200 dark:border-gray-700 overflow-y-auto bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] overflow-hidden"
          >
            {/* Cabeçalho do Menu */}
            <div className="flex flex-row items-start justify-between mb-4">
              <div className="flex flex-row items-center justify-between gap-2">
                <div className="relative w-[66px] h-[66px] rounded-full  border-2 border-[var(--secondary)] shadow-xl flex-shrink-0">
                  <img
                    src={profilePhotoUrl}
                    alt="Foto de Perfil"
                    className="w-full h-full object-cover rounded-full overflow-hidden"
                  />
                </div>
                <div className="flex flex-col">
                  {userName && (
                    <h3 className="text-lg font-semibold text-white">
                      {userName}
                    </h3>
                  )}
                  {creationDate && (
                    <p className="text-sm text-gray-300">
                      Conta criada em: {creationDate}
                    </p>
                  )}
                </div>
              </div>
              <button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="lg:hidden text-gray-700 dark:text-gray-300 transition-colors"
                aria-label="Fechar Menu"
              >
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            </div>
            <div className="flex items-center justify-between ">
              <h2 className="text-xl font-semibold text-white mt-6">Menu</h2>
            </div>
            <div className="space-y-6 flex-grow">
              {/* Editar Perfil */}
              <button
                variant="ghost"
                className="w-full justify-start text-start text-white cursor-pointer font-semibold
                                relative overflow-hidden group py-2 px-4 transition-all duration-300
                                hover:rounded-full hover:bg-[var(--background-2)] hover:shadow-md"
                onClick={() => {
                  router.push("/edit-profile");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faPencilAlt} className="mr-2" />
                <span
                  className="relative z-10 inline-block
                                  group-hover:bg-gradient-to-b group-hover:from-[var(--primary)] group-hover:to-[var(--secondary)]
                                  group-hover:text-transparent group-hover:bg-clip-text"
                >
                  Editar Perfil
                </span>
              </button>

              {/* Configurações */}
              <button
                variant="ghost"
                className="w-full justify-start text-start text-white cursor-pointer font-semibold
                                relative overflow-hidden group py-2 px-4 transition-all duration-300
                                hover:rounded-full hover:bg-[var(--background-2)] hover:shadow-md"
                onClick={() => {
                  router.push("/jub-settings");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faCog} className="mr-2" />
                <span
                  className="relative z-10 inline-block
                                  group-hover:bg-gradient-to-b group-hover:from-[var(--primary)] group-hover:to-[var(--secondary)]
                                  group-hover:text-transparent group-hover:bg-clip-text"
                >
                  Configurações
                </span>
              </button>

              {/* Sobre Nós */}
              <button
                variant="ghost"
                className="w-full justify-start text-start text-white cursor-pointer font-semibold
                                relative overflow-hidden group py-2 px-4 transition-all duration-300
                                hover:rounded-full hover:bg-[var(--background-2)] hover:shadow-md"
                onClick={() => {
                  router.push("/about-us");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faInfoCircle} className="mr-2" />
                <span
                  className="relative z-10 inline-block
                                  group-hover:bg-gradient-to-b group-hover:from-[var(--primary)] group-hover:to-[var(--secondary)]
                                  group-hover:text-transparent group-hover:bg-clip-text"
                >
                  Sobre Nós
                </span>
              </button>

              {/* Central de Ajuda */}
              <button
                variant="ghost"
                className="w-full justify-start text-start text-white cursor-pointer font-semibold
                                relative overflow-hidden group py-2 px-4 transition-all duration-300
                                hover:rounded-full hover:bg-[var(--background-2)] hover:shadow-md"
                onClick={() => {
                  router.push("/help");
                  setIsOpen(false);
                }}
              >
                <FontAwesomeIcon icon={faQuestionCircle} className="mr-2" />
                <span
                  className="relative z-10 inline-block
                                  group-hover:bg-gradient-to-b group-hover:from-[var(--primary)] group-hover:to-[var(--secondary)]
                                  group-hover:text-transparent group-hover:bg-clip-text"
                >
                  Central de Ajuda
                </span>
              </button>
            </div>

            {/* Botão de Logout */}
            <div className="absolute bottom-[60px] w-full pr-12">
              <button
                variant="ghost"
                className="w-full text-start text-white cursor-pointer font-semibold
                                relative overflow-hidden group py-2 px-4 transition-all duration-300
                                hover:rounded-full hover:bg-[var(--background-2)] hover:shadow-md"
                onClick={handleLogout}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                <span
                  className="relative z-10 inline-block
                                  group-hover:bg-gradient-to-b group-hover:from-[var(--primary)] group-hover:to-[var(--secondary)]
                                  group-hover:text-transparent group-hover:bg-clip-text"
                >
                  Sair
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuHamburguer;
