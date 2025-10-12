import React, { useState } from 'react';
import axios from 'axios';
import { base_url } from '../utils/baseUrl';

const DiagnosticTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setResults(prev => [...prev, { test, status, message, data, timestamp: new Date() }]);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);

    // Test 1: Vérifier la configuration
    addResult('Configuration', 'info', `Base URL configurée: ${base_url}`);

    // Test 2: Test de connectivité backend
    try {
      const response = await axios.get(`${base_url}product/`);
      addResult('Backend Connectivity', 'success', 'Backend répond correctement', response.data);
    } catch (error) {
      addResult('Backend Connectivity', 'error', `Erreur backend: ${error.message}`, error);
    }

    // Test 3: Test de l'authentification
    const token = localStorage.getItem('user');
    if (token) {
      try {
        const parsed = JSON.parse(token);
        addResult('Authentication', 'info', 'Token trouvé dans localStorage', parsed);
      } catch {
        addResult('Authentication', 'error', 'Token corrompu dans localStorage');
      }
    } else {
      addResult('Authentication', 'warning', 'Aucun token trouvé - connectez-vous d\'abord');
    }

    // Test 4: Test des autres endpoints
    const endpoints = ['brand', 'category', 'color'];
    for (const endpoint of endpoints) {
      try {
        const response = await axios.get(`${base_url}${endpoint}/`);
        addResult(`Endpoint ${endpoint}`, 'success', `${endpoint} fonctionne`, response.data);
      } catch (error) {
        addResult(`Endpoint ${endpoint}`, 'error', `Erreur ${endpoint}: ${error.message}`);
      }
    }

    setLoading(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>🔧 Diagnostic Admin Sanny Store</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={runDiagnostics} 
          disabled={loading}
          style={{ 
            padding: '10px 20px', 
            marginRight: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Test en cours...' : 'Lancer les tests'}
        </button>
        
        <button 
          onClick={clearResults}
          style={{ 
            padding: '10px 20px', 
            backgroundColor: '#6c757d', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Effacer
        </button>
      </div>

      <div>
        {results.map((result, index) => (
          <div 
            key={index} 
            style={{ 
              padding: '10px', 
              margin: '5px 0', 
              borderRadius: '5px',
              backgroundColor: 
                result.status === 'success' ? '#d4edda' :
                result.status === 'error' ? '#f8d7da' :
                result.status === 'warning' ? '#fff3cd' : '#d1ecf1',
              border: `1px solid ${
                result.status === 'success' ? '#c3e6cb' :
                result.status === 'error' ? '#f5c6cb' :
                result.status === 'warning' ? '#ffeaa7' : '#bee5eb'
              }`
            }}
          >
            <strong>
              {result.status === 'success' ? '✅' : 
               result.status === 'error' ? '❌' : 
               result.status === 'warning' ? '⚠️' : 'ℹ️'} 
              {result.test}
            </strong>
            <div>{result.message}</div>
            {result.data && (
              <details style={{ marginTop: '5px' }}>
                <summary style={{ cursor: 'pointer' }}>Voir les détails</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto', maxHeight: '200px' }}>
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DiagnosticTest;
