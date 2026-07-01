src/
  components/   →  componentes reutilizáveis (Botao, Card, Loading...)
  pages/        →  uma pasta/arquivo por tela (rota)
  context/      →  Context API (estado global do estudante/progresso)
  hooks/        →  hooks personalizados (opcional)
  data/         →  dados/constantes e configuração do axios
  App.jsx       →  definição das rotas da aplicação
  main.jsx      →  ponto de entrada da aplicação

  Front: 
  npm install react-router-dom axios

  Backend: 
  (O cors permite que seu app React converse com a API, e o dotenv protege as senhas do seu banco)

  npm init -y
  npm install express mysql2 cors dotenv




  import api from "../data/api.js";

// Busca a lista de trilhas na API:
const resposta = await api.get("/trilhas");
console.log(resposta.data);



Banco(data_base):
use data_base;

create table usuarios (
	id int primary key auto_increment,
    name_user varchar(120) not null,
    password_user varchar(120) not null,
    confirm_password varchar(120) not null
);

select * from usuarios