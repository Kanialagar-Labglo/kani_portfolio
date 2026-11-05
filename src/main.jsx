import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Bootstrap and custom styles load before antd so antd's component styles win where they overlap.
import './styles/bootstrap.scss';
import './styles/fonts.css';
import './styles/tokens.css';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
