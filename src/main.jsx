import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import App from './App';
// self-hosted fonts: no render-blocking third-party stylesheet, no extra connections
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/playfair-display/latin-400.css';
import '@fontsource/playfair-display/latin-500.css';
import '@fontsource/playfair-display/latin-600.css';
import '@fontsource/playfair-display/latin-400-italic.css';
import '@fontsource/playfair-display/latin-500-italic.css';
import 'lenis/dist/lenis.css';
import './styles.css';

const root = document.getElementById('root');
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// production pages arrive pre-rendered (scripts/prerender.mjs): hydrate instead of re-rendering
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
