import React from 'react';
import { Routes, Route, useParams } from 'react-router-dom';

// Composant SectionEditor simplifié pour le test
const SimpleSectionEditor = () => {
  const { id } = useParams();
  // Simuler une recherche de section
  const sections = JSON.parse(localStorage.getItem('onepress-sections') || '[]');

  const foundSection = sections.find(s => s.id === id);
  
  if (!foundSection) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#ffebee' }}>
        <h2>❌ Section non trouvée</h2>
        <p><strong>ID recherché :</strong> {id}</p>
        <p><strong>Nombre de sections :</strong> {sections.length}</p>
        <div style={{ backgroundColor: '#f5f5f5', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
          <h4>IDs disponibles :</h4>
          <ul>
            {sections.map(s => (
              <li key={s.id}>
                <code>{s.id}</code> - {s.type} - {s.title || 'Sans titre'}
              </li>
            ))}
          </ul>
        </div>
        <button onClick={() => window.history.back()}>
          ← Retour
        </button>
      </div>
    );
  }
  
  return (
    <div style={{ padding: '20px', backgroundColor: '#e8f5e8' }}>
      <h2>✅ Section Editor Simple</h2>
      <p><strong>ID de la section :</strong> {id}</p>
      <p><strong>Type :</strong> {foundSection.type}</p>
      <p><strong>Titre :</strong> {foundSection.title || 'Sans titre'}</p>
      <p>Section trouvée et éditeur chargé !</p>
      <button onClick={() => window.history.back()}>
        ← Retour
      </button>
    </div>
  );
};

// Composant SectionList simplifié
const SimpleSectionList = () => {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f8ff' }}>
      <h2>📋 Liste des Sections</h2>
      <p>Interface d'administration simplifiée</p>
    </div>
  );
};

const AdminLayoutSimple = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#f5f5f5',
      padding: '20px'
    }}>
      <header style={{ 
        backgroundColor: '#2563eb', 
        color: 'white', 
        padding: '15px 20px',
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h1>🏠 Administration Simplifiée</h1>
        <p>URL: {window.location.pathname}</p>
      </header>
      
      <main>
        <Routes>
          <Route path="/" element={<SimpleSectionList />} />
          <Route path="section/:id" element={
            <div style={{ padding: '20px', backgroundColor: '#e8f5e8' }}>
              <h2>Test SectionEditor Route</h2>
              <p>ID: {window.location.pathname.split('/').pop()}</p>
              <p>La route fonctionne !</p>
            </div>
          } />
          <Route path="*" element={
            <div style={{ padding: '20px', backgroundColor: '#fff3cd' }}>
              <h3>⚠️ Route non trouvée</h3>
              <p>Path: {window.location.pathname}</p>
            </div>
          } />
        </Routes>
      </main>
    </div>
  );
};

export default AdminLayoutSimple;