import React from 'react';

// Composant de test minimal pour Formik
const FormikTest = () => {
  const [testValue, setTestValue] = React.useState('');
  
  const handleDirectChange = (e) => {
    console.log('🔥 Direct change handler:', e.target.name, '=', e.target.value);
    setTestValue(e.target.value);
  };
  
  return (
    <div style={{
      position: 'fixed',
      bottom: '10px',
      left: '10px',
      background: '#ffeb3b',
      border: '2px solid #ff9800',
      padding: '10px',
      fontSize: '12px',
      zIndex: 10000
    }}>
      <h4>🧪 Test Direct Input</h4>
      <input 
        type="text"
        name="directTest"
        value={testValue}
        onChange={handleDirectChange}
        placeholder="Test direct input"
        style={{ marginBottom: '5px', display: 'block' }}
      />
      <div>Value: {testValue || "EMPTY"}</div>
      <div>Length: {testValue.length}</div>
    </div>
  );
};

export default FormikTest;