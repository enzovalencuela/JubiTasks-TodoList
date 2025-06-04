import React, { useState, useEffect, useCallback } from "react";

function InputSearch({ tarefas, onSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      onSearch(searchTerm);
    }, 100);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, onSearch]);

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchClick = useCallback(() => {
    onSearch(searchTerm);
  }, [searchTerm, onSearch]);

  const handleClearClick = () => {
    setSearchTerm("");
  };

  return (
    <div className="relative flex items-center justify-center w-[320px] lg:w-[80vw] max-w-[600px]">
      <input
        type="text"
        placeholder="Pesquisar tarefas..."
        value={searchTerm}
        onChange={handleInputChange}
        className="bg-[var(--subbackground)] w-full text-gray-700 px-4 py-2 border border-[var(--text)] rounded-3xl mt-5 focus:outline-none focus:ring focus:var(--primary) pr-10 placeholder-[var(--text)]"
      />
      <div className="absolute right-10 lg:right-[10px] top-[40px] transform -translate-y-1/2 flex items-center space-x-2">
        {searchTerm && (
          <button
            onClick={handleClearClick}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="h-5 w-5 fill-current" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

export default InputSearch;