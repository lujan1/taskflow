import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// ARCHIVOS DIVIDIDOS Y ORGANIZADOS DESDE LA NUEVA CARPETA
import './styles/global.css';
import './styles/auth.css';
import './styles/navbar.css';
import './styles/header.css';
import './styles/tasks.css'; // Agregado para el control de tus tarjetas

// Capturamos el contenedor físico del index.html de forma segura
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('❌ Error crítico: No se encontró el contenedor con id "root" en tu index.html');
}

// Inicialización del árbol de componentes de React 18
ReactDOM.createRoot(rootElement).render(
  // NOTA: React.StrictMode duplica los renders en desarrollo. 
  // Si experimentas llamadas dobles accidentales al backend, puedes comentarlo.
  <React.StrictMode>
    <App />
  </React.StrictMode>
);