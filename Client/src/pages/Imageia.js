import React, { useState } from 'react';
import axios from 'axios';
import { FaUser } from 'react-icons/fa';

const Imageia = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [result, setResult] = useState(null);
  const [sizeIdentified, setSizeIdentified] = useState(false);
  const [pointureIdentified, setPointureIdentified] = useState(false);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setErrorMessage('');
    setResult(null); // Réinitialiser le résultat lorsque l'image est changée
  };

  const handleImageUpload = async () => {
    if (!image) {
      setErrorMessage('Veuillez sélectionner une image.');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await axios.post('http://localhost:4000/images/detect-face', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setResult(response.data);

      // Simuler l'identification du size et de la pointure
      // Remplacer ce code par la vraie logique d'identification
      setTimeout(() => {
        setSizeIdentified(true);
        setPointureIdentified(true);
      }, 2000);
    } catch (error) {
      console.error(error);
      setErrorMessage('Une erreur s\'est produite lors de la requête.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Télécharger une image</h1>
      <label htmlFor="imageUpload" style={{ marginBottom: '20px', cursor: 'pointer' }}>
        <FaUser size={100} style={{ marginBottom: '10px' }} />
        <br />
        <span style={{ fontSize: '20px' }}>Sélectionner une image</span>
      </label>
      <input
        type="file"
        id="imageUpload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
      {errorMessage && <p style={{ color: 'red', marginBottom: '20px', textAlign: 'center' }}>{errorMessage}</p>}
      <button
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          transition: 'background-color 0.3s',
          outline: 'none'
        }}
        onClick={handleImageUpload}
        disabled={loading}
      >
        {loading ? 'Chargement...' : 'Télécharger'}
      </button>
      {result && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', borderRadius: '5px', padding: '20px', width: '100%' }}>
          <h2 style={{ marginBottom: '10px' }}>Résultat :</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(result, null, 2)}</pre>
          <p style={{ textAlign: 'center', marginTop: '20px' }}>Size identifié : {sizeIdentified ? 'Oui' : 'Non'}</p>
          <p style={{ textAlign: 'center' }}>Pointure identifiée : {pointureIdentified ? 'Oui' : 'Non'}</p>
        </div>
      )}
    </div>
  );
};

export default Imageia;
