
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('y2k-marketplace-root');

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  const standardRoot = document.getElementById('root');
  if (standardRoot) {
    const root = ReactDOM.createRoot(standardRoot);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}
