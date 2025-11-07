import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from "yup";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../features/user/userSlice';
import { useTranslation } from '../contexts/TranslationContext';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';
import '../styles/auth-minimalist.css';
import logoSanny from '../images/logosanny.png';

const Login = () => {
  const { t } = useTranslation();
  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  
  // Récupérer la page d'où vient l'utilisateur
  const from = location.state?.from?.pathname || '/';

  const personSchema = yup.object({
    email: yup.string().nullable().email(t('invalidEmail')).required(t('emailRequired')),
    password: yup.string().required(t('passwordRequired')),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: personSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
      setTimeout(() => {
        if (authState.isSuccess)
          navigate(from, { replace: true });
      }, 300);
    },
  });

  useEffect(() => {
    if (authState.auth !== null && authState.isError === false) {
      navigate(from, { replace: true });
    }
  }, [authState, navigate, from]);

  return (
    <>
      <SEOEnhancer 
        title={t('loginPageTitle')}
        description={t('loginPageDescription')}
        keywords={t('loginPageKeywords')}
        pageType="login"
      />
      <Meta title={t('login')} />
      <div className="auth-minimalist-wrapper">
        <div className="auth-minimalist-container">
          <div className="auth-logo-section">
            <img src={logoSanny} alt="Sanny Store" />
            <h2>{t('welcomeBack') || 'Bienvenue !'}</h2>
            <p>{t('loginToYourAccount') || 'Connectez-vous à votre compte'}</p>
          </div>

          {authState.isError && (
            <div className="auth-message error">
              ❌ {authState.message || 'Erreur de connexion'}
            </div>
          )}
          
          <form onSubmit={formik.handleSubmit} className="auth-minimalist-form">
            <div className="auth-form-group">
              <label htmlFor="email">{t('email') || 'Email'}</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder={t('enterYourEmail') || 'votre@email.com'}
                className="auth-form-input"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <small style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                  {formik.errors.email}
                </small>
              )}
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">{t('password') || 'Mot de passe'}</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder={t('enterYourPassword') || '••••••••'}
                  className="auth-form-input"
                  style={{ paddingRight: '50px' }}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  title={showPassword ? 'Masquer' : 'Afficher'}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {formik.touched.password && formik.errors.password && (
                <small style={{ color: '#dc3545', fontSize: '13px', marginTop: '4px', display: 'block' }}>
                  {formik.errors.password}
                </small>
              )}
            </div>

            <div style={{ textAlign: 'right', marginTop: '-4px', marginBottom: '8px' }}>
              <Link 
                to="/forgot-password" 
                style={{ 
                  color: '#FF7A00', 
                  fontSize: '14px', 
                  textDecoration: 'none', 
                  fontWeight: '700',
                  transition: 'all 0.2s ease',
                  display: 'inline-block'
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = '#FF9F40';
                  e.target.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = '#FF7A00';
                  e.target.style.transform = 'translateX(0)';
                }}
              >
                🔑 {t('forgotPassword') || 'Mot de passe oublié ?'}
              </Link>
            </div>

            <button 
              type="submit" 
              className="auth-submit-btn" 
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? (
                <>
                  <span className="auth-loading"></span>
                  {t('loggingIn') || 'Connexion...'}
                </>
              ) : (
                t('login') || 'Se connecter'
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>{t('or') || 'ou'}</span>
          </div>

          <div className="auth-extra-info">
            <p>
              {t('noAccountYet') || 'Pas encore de compte ?'}{' '}
              <Link to="/sign-up">{t('createAccount') || 'Créer un compte'}</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
