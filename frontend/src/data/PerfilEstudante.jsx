/**
 * PerfilEstudante.jsx — Componente de perfil do estudante (não utilizado atualmente).
 *
 * Exibe o nome do estudante logado consumindo os dados do contexto global.
 * Nota: a rota GET /estudante/:id não existe no backend; este componente
 * foi corrigido para usar os dados já disponíveis no contexto, evitando
 * uma chamada desnecessária à API.
 */

import { useEstudante } from '../context/EstudanteContext';

export default function PerfilEstudante() {
    // Pega o estudante logado diretamente do contexto global (sem chamada à API)
    const { estudante } = useEstudante();

    if (!estudante) {
        return <p style={{ color: 'red' }}>Nenhum usuário logado.</p>;
    }

    return (
        <div>
            <h1>Área do Aluno</h1>
            <p>Bem-vindo de volta, <strong>{estudante.nome}</strong>!</p>
        </div>
    );
}
