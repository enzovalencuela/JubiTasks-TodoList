"use client";

import React, { useState, useEffect, useRef } from "react";
import BackButton from "../../components/BackButton";
import ConfirmModal from "../../components/ConfirmModal";
import {
  auth,
  storage,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  deleteUser,
} from "../../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import Image from "next/image";
import patoConfig from "../../../public/assets/pato-config.png";
import { LineSpinner } from "ldrs/react";
import "ldrs/react/LineSpinner.css";

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-[var(--primary)] group-hover:text-[var(--secondary)]"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.828-2.828z" />
  </svg>
);

const SaveIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-green-500 group-hover:text-green-700"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const CancelIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-red-500 group-hover:text-red-700"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

export default function EditarPerfil() {
  const [userData, setUserData] = useState(null);
  const [currentProfilePhoto, setCurrentProfilePhoto] = useState(
    "/assets/default-avatar.png"
  );
  const [newProfilePhotoPreview, setNewProfilePhotoPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [creationDate, setCreationDate] = useState(null);
  const [accountName, setAccountName] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const fileInputRef = useRef(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUserData(user);
        setCurrentProfilePhoto(user.photoURL || "/assets/default-avatar.png");

        const creationTime = user.metadata?.creationTime;
        if (creationTime) {
          const date = new Date(creationTime);
          const formattedDate = date.toLocaleDateString("pt-BR");
          setCreationDate(formattedDate);
        }

        try {
          setLoading(true);
          const idToken = await user.getIdToken();
          const response = await fetch(`${backendUrl}/user-data`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            if (data.foto_perfil) {
              setCurrentProfilePhoto(data.foto_perfil);
            }
            if (data.name) {
              setAccountName(data.name);
              setNewAccountName(data.name);
            }
          } else {
            console.error(
              "Erro ao buscar dados do usuário no backend:",
              data.message
            );
            setErrorMessage(
              `Erro ao carregar dados do perfil: ${data.message}`
            );
          }
        } catch (error) {
          console.error("Erro na requisição de dados do usuário:", error);
          setErrorMessage("Erro de rede ao carregar dados do perfil.");
        } finally {
          setLoading(false);
        }
      } else {
        setUserData(null);
        setCreationDate(null);
        setCurrentProfilePhoto("/assets/default-avatar.png");
        setAccountName("");
        setNewAccountName("");
      }
    });

    return () => unsubscribe();
  }, [backendUrl]);

  const displayPhoto = newProfilePhotoPreview || currentProfilePhoto;

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setSelectedFile(file);
      setNewProfilePhotoPreview(URL.createObjectURL(file));

      await handlePhotoUpload(file);
    } else {
      setSelectedFile(null);
      setNewProfilePhotoPreview(null);
    }
  };

  const handlePhotoUpload = async (fileToUpload) => {
    if (!fileToUpload || !userData) {
      setErrorMessage("Nenhuma foto selecionada ou usuário não logado.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const storageRef = ref(
        storage,
        `profile_photos/${userData.uid}/${fileToUpload.name}`
      );
      await uploadBytes(storageRef, fileToUpload);
      const photoURL = await getDownloadURL(storageRef);

      await updateProfile(userData, { photoURL });
      setCurrentProfilePhoto(photoURL);
      setNewProfilePhotoPreview(null);
      setSelectedFile(null);

      const idToken = await userData.getIdToken();
      const response = await fetch(`${backendUrl}/update-profile-photo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ photoURL }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao sincronizar foto com o backend."
        );
      }

      setSuccessMessage("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar foto de perfil:", error);
      setErrorMessage(
        `Erro ao atualizar foto de perfil: ${
          error.message || "Tente novamente."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAccountName = async (e) => {
    e.preventDefault();
    if (!userData) {
      setErrorMessage("Usuário não logado.");
      return;
    }
    if (!newAccountName || newAccountName === accountName) {
      setErrorMessage("Por favor, insira um novo nome diferente do atual.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const idToken = await userData.getIdToken();
      const response = await fetch(`${backendUrl}/update-account-name`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ newAccountName }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || "Erro ao atualizar nome da conta no backend."
        );
      }

      setAccountName(newAccountName);
      setSuccessMessage("Nome da conta atualizado com sucesso!");
      setIsEditingName(false);
    } catch (error) {
      console.error("Erro ao atualizar nome da conta:", error);
      setErrorMessage(
        `Erro ao atualizar nome da conta: ${
          error.message || "Tente novamente."
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!userData) {
      setErrorMessage("Usuário não logado.");
      return;
    }
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setErrorMessage("Por favor, preencha todos os campos de senha.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("A nova senha e a confirmação não coincidem.");
      return;
    }
    if (newPassword.length < 6) {
      setErrorMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const credential = EmailAuthProvider.credential(
        userData.email,
        currentPassword
      );
      await reauthenticateWithCredential(userData, credential);

      await updatePassword(userData, newPassword);

      setSuccessMessage("Senha atualizada com sucesso!");
      setNewPassword("");
      setConfirmNewPassword("");
      setCurrentPassword("");
    } catch (error) {
      console.error("Erro ao mudar senha:", error);
      if (error.code === "auth/requires-recent-login") {
        setErrorMessage(
          "Sua sessão expirou. Por favor, faça login novamente para mudar sua senha."
        );
      } else if (error.code === "auth/invalid-credential") {
        setErrorMessage("Senha atual incorreta.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage(
          "A nova senha é muito fraca. Ela deve ter pelo menos 6 caracteres."
        );
      } else {
        setErrorMessage(
          `Erro ao mudar senha: ${error.message || "Tente novamente."}`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (!userData) {
      setErrorMessage("Usuário não logado.");
      return;
    }

    setConfirmModal({
      isVisible: true,
      message:
        "Tem certeza que deseja deletar sua conta? Esta ação é irreversível e deletará todos os seus dados.",
      onConfirm: async () => {
        setConfirmModal(null);
        setLoading(true);
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
          const idToken = await userData.getIdToken();
          const response = await fetch(`${backendUrl}/delete-user-data`, {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${idToken}`,
            },
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(
              data.message || "Erro ao deletar dados no backend."
            );
          }

          await deleteUser(userData);

          setSuccessMessage("Conta deletada com sucesso!");
        } catch (error) {
          console.error("Erro ao deletar conta:", error);
          if (error.code === "auth/requires-recent-login") {
            setErrorMessage(
              "Sua sessão expirou. Por favor, faça login novamente para deletar sua conta."
            );
          } else {
            setErrorMessage(
              `Erro ao deletar conta: ${error.message || "Tente novamente."}`
            );
          }
        } finally {
          setLoading(false);
        }
      },
      onCancel: () => setConfirmModal(null),
    });
  };

  return (
    <div className="flex flex-col w-screen lg:w-[calc(100vw-320px)] justify-self-end items-center p-2 transition-all duration-300 text-[var(--text)]">
      <div className="font-semibold text-xl absolute top-24 left-5 lg:right-[calc(100vw-770px)] flex flex-row gap-4 justify-center items-center">
        <BackButton /> Voltar
      </div>
      <div className="flex flex-col justify-center justify-items-center text-center container mx-auto py-10 px-4 sm:px-6 lg:px-12">
        <h1 className="text-3xl font-extrabold bg-gradient-to-b from-[var(--primary)] to-[var(--secondary)] text-transparent bg-clip-text pb-4 mb-4 mt-18">
          Editar Perfil
        </h1>
        <p className="text-lg mb-10 font-semibold ">
          Opa! O jubileu está aqui para te ajudar com a costumização do seu
          perfil. Vamos la?
        </p>
        <div className="flex flex-col justify-center items-center">
          <Image
            src={patoConfig}
            className="h-auto w-40 mb-10 object-cover"
            alt="pato"
            priority
          />
        </div>

        {/* Mensagens de Feedback e Modal de Confirmação */}
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full bg-[#000000a5] bg-opacity-50 flex justify-center items-center  z-50">
            <LineSpinner size="40" stroke="3" speed="1" color="white" />
          </div>
        )}
        {errorMessage && (
          <div className="z-50 fixed top-0 left-0 w-full h-full bg-[#000000a5] bg-opacity-50 flex justify-center p-4 items-center">
            <div className="bg-[var(--subbackground)] rounded-lg border border-red-500 p-6 flex flex-col items-center text-center text-red-500 max-w-sm w-full z-50">
              <h3 className="text-xl font-bold mb-4">Erro!</h3>
              <p className="mb-6">{errorMessage}</p>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
                onClick={() => setErrorMessage(null)}
              >
                Entendi
              </button>
            </div>
          </div>
        )}
        {successMessage && (
          <div className="z-50 fixed top-0 left-0 w-full h-full bg-[#000000a5] bg-opacity-50 flex justify-center p-4 items-center">
            <div className="bg-[var(--subbackground)] rounded-lg border border-green-500 p-6 flex flex-col items-center text-center text-green-500 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Sucesso!</h3>
              <p className="mb-6">{successMessage}</p>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-full transition duration-200"
                onClick={() => setSuccessMessage(null)}
              >
                Ok!
              </button>
            </div>
          </div>
        )}
        {confirmModal && confirmModal.isVisible && (
          <ConfirmModal
            message={confirmModal.message}
            onConfirm={confirmModal.onConfirm}
            onCancel={confirmModal.onCancel}
          />
        )}

        <div className="space-y-8 p-4">
          {/* Seção Principal: Foto, Nome e Informações da Conta */}
          <section className="bg-[var(--subbackground)] rounded-xl shadow-lg p-6 md:p-8 flex flex-col sm:justify-center sm:flex-row items-center  gap-8">
            {/* Foto de Perfil */}
            <div className="relative w-40 h-40 rounded-full  border-4 border-[var(--primary)] shadow-xl flex-shrink-0">
              <img
                src={displayPhoto}
                alt="Foto de Perfil"
                className="w-full h-full object-cover rounded-full overflow-hidden"
              />
              <button
                onClick={handlePhotoClick}
                className="absolute bottom-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition duration-200"
                aria-label="Alterar foto de perfil"
                disabled={loading}
              >
                <EditIcon />
              </button>
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
            </div>

            {/* Nome, Email e Data de Criação */}
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <div className="mb-4 flex flex-col items-center sm:items-start w-full">
                {isEditingName ? (
                  <form
                    onSubmit={handleUpdateAccountName}
                    className="flex flex-col sm:flex-row items-center gap-2 w-full"
                  >
                    <input
                      type="text"
                      value={newAccountName}
                      onChange={(e) => setNewAccountName(e.target.value)}
                      className="text-2xl font-bold text-[var(--text)] bg-[var(--subbackground)] text-center border-b-[1px]  focus:outline-none  w-full max-w-sm"
                      placeholder="Novo nome de usuário"
                      required
                    />
                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <button
                        type="submit"
                        className="p-2 rounded-full bg-green-100 hover:bg-green-200 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          loading ||
                          !newAccountName ||
                          newAccountName === accountName
                        }
                        aria-label="Salvar nome"
                      >
                        <SaveIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingName(false);
                          setNewAccountName(accountName);
                        }}
                        className="p-2 rounded-full bg-red-100 hover:bg-red-200 transition duration-200"
                        aria-label="Cancelar edição do nome"
                      >
                        <CancelIcon />
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-2xl font-bold text-[var(--text)]">
                      {accountName || "Nome de Usuário Não Definido"}
                    </h2>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="p-1 rounded-full hover:bg-gray-100 transition duration-200 group"
                      aria-label="Editar nome de usuário"
                    >
                      <EditIcon />
                    </button>
                  </div>
                )}
                <p className="text-lg text-[var(--subText)] mb-1">
                  {userData?.email || "Email não disponível"}
                </p>
                {creationDate && (
                  <p className="text-md text-[var(--subText)]">
                    Membro Desde: {creationDate}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Seção: Mudar Senha */}
          <section className="bg-[var(--subbackground)] rounded-xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text)] text-center">
              Mudar Senha
            </h2>
            <form
              onSubmit={handleChangePassword}
              className="flex flex-col items-center"
            >
              <div className="w-full max-w-md mb-4">
                <label
                  htmlFor="currentPassword"
                  className="block text-[var(--subText)] text-sm font-semibold mb-2"
                >
                  Senha Atual:
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="shadow-sm appearance-none border border-[var(--border)] rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)]"
                  placeholder="Sua senha atual"
                  required
                />
              </div>
              <div className="w-full max-w-md mb-4">
                <label
                  htmlFor="newPassword"
                  className="block text-[var(--subText)] text-sm font-semibold mb-2"
                >
                  Nova Senha:
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="shadow-sm appearance-none border border-[var(--border)] rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)]"
                  placeholder="Sua nova senha"
                  required
                />
              </div>
              <div className="w-full max-w-md mb-6">
                <label
                  htmlFor="confirmNewPassword"
                  className="block text-[var(--subText)] text-sm font-semibold mb-2"
                >
                  Confirmar Nova Senha:
                </label>
                <input
                  type="password"
                  id="confirmNewPassword"
                  name="confirmNewPassword"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="shadow-sm appearance-none border border-[var(--border)] rounded-lg w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-[var(--background)]"
                  placeholder="Confirme sua nova senha"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                Mudar Senha
              </button>
            </form>
          </section>

          {/* Seção: Deletar Conta */}
          <section className="bg-[var(--subbackground)] rounded-xl shadow-lg p-6 md:p-8 flex flex-col items-center mb-12">
            <h2 className="text-2xl font-bold mb-6 text-[var(--text)] text-center">
              Deletar Conta
            </h2>
            <p className="text-red-500 mb-6 text-center max-w-prose">
              Esta ação é irreversível e deletará permanentemente todos os seus
              dados da plataforma. Tenha certeza antes de prosseguir.
            </p>
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full focus:outline-none focus:shadow-outline transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleDeleteAccount}
              disabled={loading}
            >
              Deletar Minha Conta
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
