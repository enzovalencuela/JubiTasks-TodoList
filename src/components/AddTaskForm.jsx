import React, { useState } from "react";

function AddTaskForm({ onClose, onTaskAdded, firebaseIdToken }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataPrazo, setDataPrazo] = useState("");
  const [prioridade, setPrioridade] = useState("Normal");
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!firebaseIdToken) {
      console.error(
        "Firebase ID Token não disponível. Não é possível adicionar tarefa."
      );
      return;
    }

    const newTask = {
      titulo,
      descricao,
      data_prazo: dataPrazo === "" ? null : dataPrazo,
      prioridade,
      estado_tarefa: "Pendente",
    };

    try {
      const response = await fetch(`${backendUrl}/tasks/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firebaseIdToken}`,
        },
        body: JSON.stringify(newTask),
      });

      if (response.ok) {
        const data = await response.json();
        onTaskAdded(data.insertId);
        onClose();
      } else {
        const errorData = await response.json();
        console.error("Erro ao adicionar tarefa:", errorData);
      }
    } catch (error) {
      console.error("Erro ao comunicar com o backend:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <div className="bg-[var(--subbackground)] text-[var(--text)] rounded-md p-6 w-[330px] z-50">
      <h2 className="text-xl font-semibold mb-4">Adicionar Nova Tarefa</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-3">
        <div>
          <label htmlFor="titulo" className="block  text-sm font-bold mb-2">
            Título:
          </label>
          <input
            type="text"
            id="titulo"
            className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="descricao" className="block  text-sm font-bold mb-2">
            Descrição:
          </label>
          <textarea
            id="descricao"
            className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="dataPrazo" className="block  text-sm font-bold mb-2">
            Data Prazo:
          </label>
          <input
            type="date"
            id="dataPrazo"
            className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            value={dataPrazo}
            onChange={(e) => setDataPrazo(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="prioridade" className="block  text-sm font-bold mb-2">
            Prioridade:
          </label>
          <select
            id="prioridade"
            className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            required
          >
            <option value="Baixa">Baixa</option>
            <option value="Normal">Normal</option>
            <option value="Alta">Alta</option>
            <option value="Urgente">Urgente</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleCancel}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Salvar
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddTaskForm;
