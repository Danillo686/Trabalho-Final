import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../data/api";
import { useEstudante } from "../context/EstudanteContext";

export function useLogin() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const { login } = useEstudante();

    async function handleLogin(e) {

        e.preventDefault();

        setError("");

        try {

            setLoading(true);

            const response = await api.post("/login", {
                username,
                password
            });

            // Salva no Context e no localStorage
            login(
                response.data.usuario,
                response.data.token
            );

            navigate("/lobby");

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Erro ao fazer login."
            );

        } finally {

            setLoading(false);

        }

    }

    // ESTE RETURN FICA FORA DO HANDLELOGIN
    return {

        username,
        setUsername,

        password,
        setPassword,

        loading,

        error,

        handleLogin

    };

}