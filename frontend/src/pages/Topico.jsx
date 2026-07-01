import { useParams } from "react-router-dom";

export default function Topico() {
    const { id } = useParams();
    return (
        <div>
            <h1>Topico</h1>
            <p> ID: {id} </p>
        </div>
    );
}