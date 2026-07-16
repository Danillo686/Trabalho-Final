/**
 * Entrada.jsx — Componente de navegação auxiliar (não utilizado nas rotas atuais).
 *
 * Exibia links de navegação para as principais telas da aplicação.
 * Mantido como referência, mas substituído pelo Lobby na navegação principal.
 * Corrigido: os <li> agora estão dentro de um <ul> (HTML semântico correto).
 */

import { Link } from 'react-router-dom';
import { useEstudante } from '../context/EstudanteContext.jsx';

export default function Entrada() {
    const { estudante } = useEstudante();

    return (
        <div>
            <h1>Bem-vindo, {estudante?.nome}!</h1>
            <h2>Navegar</h2>
            <ul>
                <li><Link to="/diagnostico">Diagnóstico</Link></li>
                <li><Link to="/trilha">Trilha</Link></li>
                <li><Link to="/painel">Painel</Link></li>
            </ul>
        </div>
    );
}