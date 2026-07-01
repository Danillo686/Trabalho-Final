import { useState } from "react";
import api from "../data/api.js";
import { useEstudante } from "../context/EstudanteContext.jsx"; // Importa o contexto
import { useNavigate } from "react-router-dom";

export function useAuth() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { setEstudante } = useEstudante(); // Pega a função para salvar o estudante globalmente
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirm) {
      setError("As senhas não coincidem!");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/cadastro", { username, password, passwordConfirm });

      // O back-end precisa retornar o ID gerado pelo MySQL (ex: { id: 5, nome: "João" })
      // Você salva isso no seu Contexto Global:
      setEstudante(response.data.usuario); 

      
      alert("Login realizado com sucesso!");
      navigate('/entrada');
    } catch (err) {
      setError(err.response?.data?.message || "Erro ao fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return {
    username,
    setUsername,
    password,
    setPassword,
    passwordConfirm,
    setPasswordConfirm,
    loading,
    error,
    handleLogin,
  };
}
