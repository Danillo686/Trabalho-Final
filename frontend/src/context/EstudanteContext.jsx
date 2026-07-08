// src/context/EstudanteContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// 1) Cria o contexto:
const EstudanteContext = createContext();

// 2) Cria o Provider (vai "abraçar" o App no main.jsx):
export function EstudanteProvider({ children }) {
  const [estudante, setEstudante] = useState(null);
  const [progresso, setProgresso] = useState([]);
  const [trilha, setTrilha] = useState([]);


  function login(usuario, token) {
    setEstudante(usuario);

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuario)
    );

    localStorage.setItem(
      "token",
      token
    )
  }

  function logout() {
    setEstudante(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const usuarioSalvo = localStorage.getItem("usuario")

    if (usuarioSalvo) {
      setEstudante(
        JSON.parse(usuarioSalvo)
      );
    }
  }, []);

  return (
    <EstudanteContext.Provider
      value={{
        estudante,
        progresso,
        setProgresso,
        trilha,
        setTrilha,
        login,
        logout
      }}
    >
      {children}
    </EstudanteContext.Provider>
  );
}

// 3) Atalho para consumir o contexto nas telas:
export function useEstudante() {
  return useContext(EstudanteContext);
}