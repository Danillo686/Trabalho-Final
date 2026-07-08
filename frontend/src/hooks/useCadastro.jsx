import { useState } from "react";
import api from "../data/api.js"
import { useNavigate } from "react-router-dom";

export function useCadastro() {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate() 

    async function handleCadastro(e){
        e.preventDefault();

        setError("");

        if(password !== passwordConfirm){
            return setError("As senhas não conferem")
        }
        
        try {
            setLoading(true);

            const response = await api.post('/cadastro', {username, password, passwordConfirm})
            alert(response.data.message);
            navigate('/');
        } catch (err) {
            setError(
                err.response?.data?.message || "Erro ao cadastrar."
            )
        } finally {
            setLoading(false);
        }
        
    }

    return {
        username,
        setUsername,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,
        loading,
        error,
        handleCadastro,
    }
}