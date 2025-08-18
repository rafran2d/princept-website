import React from 'react';

const AdminLayoutTest = () => {
  console.log('🧪 AdminLayoutTest - Fichier test chargé sans imports complexes');
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#e3f2fd' }}>
      <h1>🧪 AdminLayoutTest</h1>
      <p>URL: {window.location.pathname}</p>
      <p>Ce composant test n'a que des imports React basiques.</p>
      <p>Si vous voyez ce message, le problème vient des imports dans AdminLayout.js</p>
    </div>
  );
};

export default AdminLayoutTest;