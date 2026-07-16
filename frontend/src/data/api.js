/**
 * api.js — Instância centralizada do Axios para o frontend.
 *
 * Configura a URL base do backend para que todos os outros arquivos
 * usem esta instância ao invés de chamar axios diretamente com URLs absolutas.
 * Se precisar mudar a URL do servidor, altere apenas aqui.
 */

import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000',
});

export default api;