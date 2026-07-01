import { Link } from "react-router-dom";
import { useEstudante } from "../context/EstudanteContext.jsx";

export default function Entrada() {

    const { estudante } = useEstudante(); //Pega o estudante logado do Contexto Global

    return (
        <div>
            <h1 className="name_display">Bem-vindo {estudante?.nome}!</h1>
            <h1 className="navigation-title">Navegar</h1>
            <div className="navigation">
                <li>
                    <Link to="/diagnostico">Diagnostico</Link>
                </li>
                <li>
                    <Link to="/painel">Painel</Link>
                </li>
                <li>
                    <Link to="/topico">Topico</Link>
                </li>
                <li>
                    <Link to="/trilha">Trilha</Link>
                </li>
            </div>
        </div>
    );
}