// components/TaskCard.jsx
import React, { useState, useCallback, useMemo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  MdOutlineDragIndicator,
  MdExpandMore,
  MdExpandLess,
  MdDeleteOutline,
} from "react-icons/md";

const getPriorityColor = (priority) => {
  switch (priority) {
    case "Urgente":
      return "bg-red-500 text-white";
    case "Alta":
      return "bg-orange-500 text-white";
    case "Normal":
      return "bg-green-300 text-gray-800";
    case "Baixa":
      return "bg-blue-400 text-white";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const getDueDateStatus = (dueDate) => {
  if (!dueDate) {
    return { text: "Indefinido", className: "text-gray-400 bg-gray-100" };
  }

  let taskDueDate;

  if (typeof dueDate === "string" && dueDate.match(/^\d{4}-\d{2}-\d{2}$/)) {
    const [year, month, day] = dueDate.split("-").map(Number);
    taskDueDate = new Date(Date.UTC(year, month - 1, day));
  } else {
    taskDueDate = new Date(dueDate);
  }

  if (isNaN(taskDueDate.getTime())) {
    console.warn(
      "Formato de data inválido recebido em getDueDateStatus:",
      dueDate
    );
    return {
      text: "Data Inválida",
      className: "bg-red-200 text-red-700 font-semibold",
    };
  }

  const displayDate = new Date(taskDueDate);
  displayDate.setUTCHours(12, 0, 0, 0);

  const today = new Date();
  const todayUTC = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const oneDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.round(
    (taskDueDate.getTime() - todayUTC.getTime()) / oneDay
  );

  if (daysDifference < 0) {
    return {
      text: `Atrasada (${displayDate.toLocaleDateString("pt-BR")})`,
      className: "bg-red-200 text-red-700 font-semibold",
    };
  }
  if (daysDifference <= 3) {
    return {
      text: `Próxima (${displayDate.toLocaleDateString("pt-BR")})`,
      className: "bg-yellow-200 text-yellow-700",
    };
  }
  return {
    text: `Prazo: ${displayDate.toLocaleDateString("pt-BR")}`,
    className: "bg-green-100 text-green-700",
  };
};

function TaskCardComponent({
  tarefa,
  onTaskDeleted,
  onTaskUpdated,
  isDraggable,
  id,
  firebaseIdToken,
  taskSize,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const initialFormData = useMemo(() => {
    let formattedDate = "";
    if (tarefa.data_prazo) {
      try {
        const dateObj = new Date(tarefa.data_prazo);
        if (!isNaN(dateObj.getTime())) {
          formattedDate = dateObj.toISOString().split("T")[0];
        }
      } catch (error) {
        console.error(
          "Erro ao processar data_prazo:",
          tarefa.data_prazo,
          error
        );
        formattedDate = "";
      }
    }

    return {
      titulo: tarefa.titulo,
      descricao: tarefa.descricao || "",
      data_prazo: formattedDate,
      prioridade: tarefa.prioridade,
    };
  }, [tarefa.titulo, tarefa.descricao, tarefa.data_prazo, tarefa.prioridade]);

  const [editFormData, setEditFormData] = useState(initialFormData);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = useMemo(
    () => ({
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.8 : 1,
      boxShadow: isDragging ? "0px 4px 10px rgba(0, 0, 0, 0.2)" : "none",
    }),
    [transform, transition, isDragging]
  );

  // --- Funções para aplicar classes de tamanho --------------------------------------------------------
  const getCardSizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "w-[235px] min-h-[120px] p-3"; // Menor largura e altura mínima, menos padding
      case "medium":
      default:
        return "w-[335px] sm:w-[340px] xl:w-[300px] min-h-[100px] p-4"; // Padrão
      case "large":
        return "w-[400px] min-h-[220px] p-6"; // Maior largura e altura mínima, mais padding
    }
  }, [taskSize]);

  const getTitleSizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "text-base"; // Título menor
      case "large":
        return "text-2xl"; // Título maior
      case "medium":
      default:
        return "text-lg"; // Título padrão
    }
  }, [taskSize]);

  const getDescriptionSizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "text-xs"; // Descrição menor
      case "large":
        return "text-base"; // Descrição maior
      case "medium":
      default:
        return "text-sm"; // Descrição padrão
    }
  }, [taskSize]);

  const getDatePrioritySizeClasses = useCallback(() => {
    switch (taskSize) {
      case "small":
        return "text-xs px-1.5 py-0.5"; // Texto menor, padding menor
      case "large":
        return "text-base px-3 py-1.5"; // Texto maior, padding maior
      case "medium":
      default:
        return "text-xs px-2 py-1"; // Padrão
    }
  }, [taskSize]);

  // --- Fim das funções para aplicar classes de tamanho ---

  const makeApiRequest = useCallback(
    async (
      endpoint,
      method,
      body,
      successCallback,
      errorMsgPrefix,
      setLoadingState
    ) => {
      if (!firebaseIdToken) {
        console.error(
          "Firebase ID Token não disponível. Não é possível completar a ação."
        );
        alert("Sessão expirada ou não autenticada. Faça login novamente.");
        return false;
      }

      setLoadingState(true);
      try {
        const response = await fetch(`${backendUrl}${endpoint}`, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${firebaseIdToken}`,
          },
          body: body ? JSON.stringify(body) : undefined,
        });
        if (response.ok) {
          const responseData =
            method === "DELETE" || response.status === 204
              ? {}
              : await response.json().catch(() => ({}));
          successCallback(responseData);
          return true;
        } else {
          const errorData = await response
            .json()
            .catch(() => ({ message: response.statusText }));
          console.error(`${errorMsgPrefix}:`, errorData);
          alert(
            `${errorMsgPrefix}: ${errorData.message || response.statusText}`
          );
          if (response.status === 401 || response.status === 403) {
            alert("Sessão expirada ou não autorizada. Faça login novamente.");
          }
          return false;
        }
      } catch (error) {
        console.error("Erro ao comunicar com o backend:", error);
        alert(`Erro de conexão: ${errorMsgPrefix.toLowerCase()}.`);
        return false;
      } finally {
        setLoadingState(false);
      }
    },
    [backendUrl, firebaseIdToken]
  );

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;
    await makeApiRequest(
      `/tasks/${tarefa.id_tarefa}`,
      "DELETE",
      null,
      () => {
        onTaskDeleted(tarefa.id_tarefa);
      },
      "Erro ao deletar tarefa",
      setIsDeleting
    );
  }, [isDeleting, makeApiRequest, tarefa.id_tarefa, onTaskDeleted]);

  const handleStatusChange = useCallback(
    async (event) => {
      if (isUpdatingStatus) return;
      const newStatus = event.target.checked ? "Finalizada" : "Pendente";
      await makeApiRequest(
        `/tasks/${tarefa.id_tarefa}/status`,
        "PUT",
        { estado_tarefa: newStatus },
        () => {
          onTaskUpdated({
            id_tarefa: tarefa.id_tarefa,
            estado_tarefa: newStatus,
          });
        },
        "Erro ao atualizar estado",
        setIsUpdatingStatus
      );
    },
    [isUpdatingStatus, makeApiRequest, tarefa.id_tarefa, onTaskUpdated]
  );

  const handleEditSave = useCallback(async () => {
    if (isSavingEdit) return;
    const payload = {
      ...editFormData,
      data_prazo: editFormData.data_prazo || null,
      estado_tarefa: tarefa.estado_tarefa,
    };
    const success = await makeApiRequest(
      `/tasks/${tarefa.id_tarefa}`,
      "PUT",
      payload,
      () => {
        onTaskUpdated({ id_tarefa: tarefa.id_tarefa, ...payload });
        setIsEditing(false);
      },
      "Erro ao atualizar tarefa",
      setIsSavingEdit
    );
  }, [
    isSavingEdit,
    makeApiRequest,
    tarefa.id_tarefa,
    tarefa.estado_tarefa,
    editFormData,
    onTaskUpdated,
  ]);

  const handleEditChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const resetFormAndExitEdit = useCallback(() => {
    setIsEditing(false);
    setEditFormData(initialFormData);
  }, [initialFormData]);

  const handleEditCancel = useCallback(
    (e) => {
      e.stopPropagation();
      resetFormAndExitEdit();
    },
    [resetFormAndExitEdit]
  );

  const toggleExpand = useCallback(
    (e) => {
      e.stopPropagation();
      setIsExpanded((prev) => !prev);
      if (isEditing && isExpanded) {
        resetFormAndExitEdit();
      }
    },
    [isEditing, isExpanded, resetFormAndExitEdit]
  );

  const openEditMode = useCallback(
    (e) => {
      e.stopPropagation();
      setEditFormData(initialFormData);
      setIsEditing(true);
      if (!isExpanded) setIsExpanded(true);
    },
    [initialFormData, isExpanded]
  );

  const dueDateInfo = useMemo(
    () => getDueDateStatus(tarefa.data_prazo),
    [tarefa.data_prazo]
  );
  const priorityClasses = useMemo(
    () => getPriorityColor(tarefa.prioridade),
    [tarefa.prioridade]
  );
  const isLoading = isDeleting || isUpdatingStatus || isSavingEdit;

  const cardBaseClasses =
    "flex flex-col items-start bg-[var(--bgcard)] shadow-md rounded-md p-4 mb-2 w-[335px] sm:w-[340px] xl:w-[300px] min-h-[100px]";
  const cardAnimationClasses = isDragging
    ? ""
    : "transition-shadow duration-300";
  const cardDraggableClass = isDraggable ? "touch-action-none" : "";

  const isTaskCompleted = tarefa.estado_tarefa === "Finalizada";

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`relative rounded-lg shadow-lg flex flex-col justify-between transition-all duration-300 ease-in-out ${getCardSizeClasses()} ${
        isTaskCompleted
          ? "bg-[var(--taskcompleted)] opacity-60"
          : "bg-[var(--subbackground)]"
      } border border-[var(--details)] ${cardAnimationClasses} $`}
      onClick={
        !isDraggable && !isEditing && !isExpanded ? openEditMode : undefined
      }
    >
      <div className="flex flex-row w-full justify-between items-start gap-2">
        {isDraggable && (
          <div
            className={`flex items-center justify-center cursor-grab text-gray-400 hover:text-gray-600 active:text-blue-500 py-1 flex-shrink-0 ${cardDraggableClass}`}
            {...listeners}
          >
            <MdOutlineDragIndicator size={24} />
          </div>
        )}
        {!isDraggable && <div className="w-[24px] mr-2 flex-shrink-0"></div>}

        <div
          className="flex-grow min-w-0"
          onClick={!isDraggable && !isEditing ? openEditMode : undefined}
        >
          {isEditing ? (
            <input
              type="text"
              name="titulo"
              value={editFormData.titulo}
              onChange={handleEditChange}
              className={`font-semibold text-[var(--text)] border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-full ${getTitleSizeClasses()}`}
              placeholder="Título da Tarefa"
              disabled={isLoading}
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <h3
              className={`font-semibold  text-start ${getTitleSizeClasses()} ${
                !isExpanded ? "truncate-text" : ""
              } ${
                isTaskCompleted
                  ? "line-through text-gray-500"
                  : "text-[var(--text)]"
              }`}
            >
              {tarefa.titulo}
            </h3>
          )}
        </div>

        {!isEditing && (
          <div className="flex items-center gap-1 flex-shrink-0">
            <label
              className="flex items-center cursor-pointer p-1"
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                checked={isTaskCompleted}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus || isDeleting}
              />
            </label>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              className="p-1 text-red-500 hover:text-red-700 disabled:text-gray-400"
              disabled={isLoading}
            >
              <MdDeleteOutline size={22} />
            </button>
            <button
              onClick={toggleExpand}
              className="p-1 text-gray-500 hover:text-gray-700"
            >
              {isExpanded ? (
                <MdExpandLess size={24} />
              ) : (
                <MdExpandMore size={24} />
              )}
            </button>
          </div>
        )}
      </div>
      <div
        className={`w-full mt-2 ${isDraggable ? "pl-[calc(24px+0.5rem)]" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {(isExpanded || isEditing) && (
          <>
            {isEditing ? (
              <textarea
                name="descricao"
                value={editFormData.descricao}
                onChange={handleEditChange}
                className={`text-[var(--subText)] w-full border-b border-gray-300 focus:outline-none focus:border-blue-500 mt-1 resize-y max-h-40 min-h-[60px] overflow-y-auto bg-transparent ${getDescriptionSizeClasses()}`}
                rows={3}
                placeholder="Descrição da Tarefa"
                disabled={isLoading}
              />
            ) : (
              tarefa.descricao && (
                <p
                  className={`text-[var(--subText)] mt-1 break-words text-start whitespace-pre-wrap max-h-24 overflow-y-auto w-full ${getDescriptionSizeClasses()}`}
                >
                  {tarefa.descricao}
                </p>
              )
            )}
          </>
        )}

        {!isTaskCompleted && (
          <div className="flex gap-2 mt-2 items-center">
            {isEditing ? (
              <input
                type="date"
                name="data_prazo"
                value={editFormData.data_prazo}
                onChange={handleEditChange}
                className={`text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent flex-grow ${getDatePrioritySizeClasses()}`}
                disabled={isLoading}
              />
            ) : (
              <p
                className={`rounded-md inline-block flex-grow ${
                  dueDateInfo.className
                } ${getDatePrioritySizeClasses()}`}
              >
                {dueDateInfo.text}
              </p>
            )}

            {isEditing ? (
              <select
                name="prioridade"
                value={editFormData.prioridade}
                onChange={handleEditChange}
                className={`text-gray-500 border-b border-gray-300 focus:outline-none focus:border-blue-500 bg-transparent w-2/5 ${getDatePrioritySizeClasses()}`}
                disabled={isLoading}
              >
                <option value="Baixa">Baixa</option>{" "}
                <option value="Normal">Normal</option>
                <option value="Alta">Alta</option>{" "}
                <option value="Urgente">Urgente</option>
              </select>
            ) : (
              <p
                className={`rounded-md inline-block font-medium w-2/5 text-center ${priorityClasses} ${getDatePrioritySizeClasses()}`}
              >
                {tarefa.prioridade}
              </p>
            )}
          </div>
        )}

        {(isExpanded || isEditing) && (
          <div className="flex items-center gap-2 mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditSave();
                  }}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline disabled:bg-gray-400"
                  disabled={isLoading}
                >
                  Salvar
                </button>
                <button
                  onClick={handleEditCancel}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline disabled:bg-gray-300"
                  disabled={isLoading}
                >
                  Cancelar
                </button>
                {isExpanded && (
                  <button
                    onClick={toggleExpand}
                    className="p-1 text-gray-500 hover:text-gray-700 ml-auto"
                    title="Fechar detalhes"
                  >
                    <MdExpandLess size={24} />
                  </button>
                )}
              </>
            ) : (
              isExpanded && (
                <button
                  onClick={openEditMode}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-xs focus:outline-none focus:shadow-outline"
                >
                  Editar Tarefa
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(TaskCardComponent);
