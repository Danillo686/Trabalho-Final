import { useEffect, useState } from "react";
import axios from "axios";
import { useEstudante } from "../context/EstudanteContext"; // 1. Importa o seu contexto

export default function PerfilEstudante() {
  const { estudante } = useEstudante(); // 2. Pega o estudante logado do Contexto Global
  const [nomeEstudante, setNomeEstudante] = useState("");
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  useEffect(() => {
    async function carregarNome() {
      // 3. Se não houver estudante logado no contexto, nem tenta buscar na API
      if (!estudante || !estudante.id) {
        setErro("Nenhum usuário logado.");
        setLoading(false);
        return;
      }

      try {
        // 4. Agora a URL usa o ID real e dinâmico do estudante logado!
        const response = await axios.get(`http://localhost:3000/estudante/${estudante.id}`);
        
        setNomeEstudante(response.data.nome); 
      } catch (error) {
        console.error("Erro ao puxar o nome do servidor:", error);
        setErro("Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    }

    carregarNome();
  }, [estudante]); // 5. Se o estudante mudar/logar, ele refaz a busca

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div>
      <h1>Área do Aluno</h1>
      <p>Bem-vindo de volta, <strong>{nomeEstudante}</strong>!</p>
    </div>
  );
}
