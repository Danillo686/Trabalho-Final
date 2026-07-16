/**
 * main.jsx — Ponto de entrada da aplicação React.
 *
 * Inicializa o React, envolve o App com o BrowserRouter (para navegação)
 * e com o EstudanteProvider (contexto global do usuário logado).
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import { EstudanteProvider } from './context/EstudanteContext.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <BrowserRouter>
            <EstudanteProvider>
                <App />
            </EstudanteProvider>
        </BrowserRouter>
    </StrictMode>
);