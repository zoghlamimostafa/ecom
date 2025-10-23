import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../features/user/userSlice';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';
import '../styles/auth-minimalist.css';
import logoSanny from '../images/logosanny.png';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const response = await dispatch(forgotPassword(email)).unwrap();
      setMessage({ 
        type: 'success', 
        text: '✅ Email envoyé ! Vérifiez votre boîte de réception (et les spams). Un lien de réinitialisation vous a été envoyé.' 
      });
      setEmail('');
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.message || 'Une erreur est survenue. Veuillez vérifier que votre email est correct.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Meta title="Réinitialiser le mot de passe" />
      <div className="auth-minimalist-wrapper">
        <div className="auth-minimalist-container">
          <div className="auth-logo-section">
            <img src={logoSanny} alt="Sanny Store" />
            <h2>Mot de passe oublié ?</h2>
            <p>Entrez votre email pour réinitialiser</p>
          </div>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.type === 'success' ? '✅' : '❌'} {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-minimalist-form">
            <div className="auth-form-group">
              <label htmlFor="email">Adresse email</label>
              <input 
                id="email"
                type="email" 
                name="email" 
                placeholder="votre@email.com" 
                className="auth-form-input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                disabled={isLoading}
              />
            </div>
                    
            <button 
              className="auth-submit-btn" 
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="auth-loading"></span>
                  Envoi en cours...
                </>
              ) : (
                'Réinitialiser le mot de passe'
              )}
            </button>
          </form>

          <div className="auth-links">
            <Link to="/login">← Retour à la connexion</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
