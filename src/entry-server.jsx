// Build-time pre-render: the page's HTML is generated once so the first screen
// paints before any JavaScript runs; the browser then hydrates it (see main.jsx).
import { renderToString } from 'react-dom/server';
import App from './App';

export const render = () => renderToString(<App />);
