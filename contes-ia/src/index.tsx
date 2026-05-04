import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const rootEl = document.getElementById('root') as HTMLElement;

/**
 * Marque la page comme "prete" apres le 1er paint de React.
 * Le CSS dans index.html masque #root tant que .app-ready n'est pas la,
 * pour eviter le FOUC (styled-components v6 n'inline pas ses styles dans
 * le HTML prerendu — il faut attendre l'hydratation).
 *
 * Double rAF pour garantir qu'au moins une frame de paint a eu lieu.
 */
function markAppReady() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('app-ready');
    });
  });
}

// Si le HTML est deja pre-rendu, on hydrate au lieu de render
if (rootEl.hasChildNodes()) {
  ReactDOM.hydrateRoot(
    rootEl,
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

markAppReady();

reportWebVitals();
