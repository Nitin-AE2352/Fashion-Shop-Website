
/* =========================================
   IMPORT REACT LIBRARIES
========================================= */

import React from 'react';
import ReactDOM from 'react-dom/client';

/* =========================================
   IMPORT MAIN APP AND GLOBAL CSS
========================================= */

import App from './App.jsx';
import './index.css';
import './App.css';

/* =========================================
   RENDER WEBSITE
========================================= */

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
