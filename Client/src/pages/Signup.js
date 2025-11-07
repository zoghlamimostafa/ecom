import React, { useEffect, useState } from 'react';
import { useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from '../contexts/TranslationContext';
import { registerUser } from '../features/user/userSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PhoneInput, { validateInternationalPhone } from '../components/PhoneInput';
import logo from '../images/logosanny.png';

const Signup = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, isError, errorMessage, isSuccess } = useSelector((state) => state.auth);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Schema de validation
  const signupSchema = yup.object({
    firstname: yup.string()
      .min(2, t('firstnameTooShort'))
      .required(t('firstnameRequired')),
    lastname: yup.string()
      .min(2, t('lastnameTooShort'))
      .required(t('lastnameRequired')),
    email: yup.string()
      .email(t('invalidEmail'))
      .required(t('emailRequired')),
    mobile: yup.string()
      .test('international-phone', 'Format de numéro de téléphone invalide', function(value) {
        if (!value) return false;
        return validateInternationalPhone(value);
      })
      .required(t('phoneRequired')),
    password: yup.string()
      .min(6, t('passwordTooShort'))
      .required(t('passwordRequired')),
    confirmPassword: yup.string()
      .oneOf([yup.ref('password'), null], t('passwordsDoNotMatch'))
      .required(t('confirmPasswordRequired')),
  });

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: signupSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: (values, { setSubmitting }) => {
      console.log('📝 Signup - Soumission du formulaire avec valeurs:', values);
      
      // Validation supplémentaire avant soumission
      if (!values.firstname || !values.lastname || !values.email || !values.mobile || !values.password || !values.confirmPassword) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        setSubmitting(false);
        return;
      }

      const { confirmPassword, ...formData } = values;
      console.log('✅ Signup - Envoi des données:', formData);
      dispatch(registerUser(formData));
      setSubmitting(false);
    },
  });

  useEffect(() => {
    console.log('📊 Signup - État:', { isSuccess, isError, errorMessage });
    
    if (isSuccess) {
      console.log('✅ Signup - Succès détecté');
      setShowSuccessMessage(true);
      toast.success('Compte créé avec succès ! Vous êtes maintenant connecté.');
      setTimeout(() => {
        navigate('/product');
      }, 1500);
    }
    if (isError) {
      console.log('❌ Signup - Erreur détectée:', errorMessage);
      toast.error(errorMessage || 'Erreur lors de la création du compte. Veuillez réessayer.');
    }
  }, [isSuccess, isError, errorMessage, navigate]);

  return (
    <div className="signup-bg">
      <div className="signup-card modern-signup-card">
        <div className="modern-signup-header">
          <img 
            src={logo} 
            alt="Logo Sanny" 
            className="modern-signup-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2 className="modern-signup-title">{t('createAccount')}</h2>
          <p className="modern-signup-subtitle">Rejoignez la communauté Sanny</p>
        </div>

        {showSuccessMessage ? (
          <div className="success-message">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h3>{t('accountCreatedSuccessfully')}</h3>
            <p>Redirection vers la boutique...</p>
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <form onSubmit={formik.handleSubmit} className="modern-signup-form">
            <div className="modern-form-row">
              <div className="modern-form-group">
                <label htmlFor="firstname" className="modern-label">
                  <i className="fas fa-user"></i>
                  {t('firstname')}
                </label>
                <input
                  type="text"
                  id="firstname"
                  name="firstname"
                  placeholder="Votre prénom"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`modern-input ${formik.touched.firstname && formik.errors.firstname ? 'error' : ''}`}
                />
                {formik.touched.firstname && formik.errors.firstname && (
                  <div className="modern-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {formik.errors.firstname}
                  </div>
                )}
              </div>

              <div className="modern-form-group">
                <label htmlFor="lastname" className="modern-label">
                  <i className="fas fa-user"></i>
                  Nom
                </label>
                <input
                  type="text"
                  id="lastname"
                  name="lastname"
                  placeholder="Votre nom"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`modern-input ${formik.touched.lastname && formik.errors.lastname ? 'error' : ''}`}
                />
                {formik.touched.lastname && formik.errors.lastname && (
                  <div className="modern-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {formik.errors.lastname}
                  </div>
                )}
              </div>
            </div>

            <div className="modern-form-group">
              <label htmlFor="email" className="modern-label">
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="votre@email.com"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={`modern-input ${formik.touched.email && formik.errors.email ? 'error' : ''}`}
              />
              {formik.touched.email && formik.errors.email && (
                <div className="modern-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {formik.errors.email}
                </div>
              )}
            </div>

            <div className="modern-form-group">
              <label htmlFor="mobile" className="modern-label">
                <i className="fas fa-phone"></i>
                Téléphone
              </label>
              <PhoneInput
                name="mobile"
                value={formik.values.mobile}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.mobile}
                touched={formik.touched.mobile}
                placeholder="Entrez votre numéro"
              />
            </div>

            <div className="modern-form-row">
              <div className="modern-form-group">
                <label htmlFor="password" className="modern-label">
                  <i className="fas fa-lock"></i>
                  Mot de passe
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`modern-input ${formik.touched.password && formik.errors.password ? 'error' : ''}`}
                />
                {formik.touched.password && formik.errors.password && (
                  <div className="modern-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {formik.errors.password}
                  </div>
                )}
              </div>

              <div className="modern-form-group">
                <label htmlFor="confirmPassword" className="modern-label">
                  <i className="fas fa-lock"></i>
                  {t('confirm')}
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`modern-input ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}`}
                />
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <div className="modern-error">
                    <i className="fas fa-exclamation-circle"></i>
                    {formik.errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>

            <button 
              type="submit" 
              className="modern-signup-btn" 
              disabled={isLoading}
            >
              <i className="fas fa-user-plus"></i>
              {isLoading ? t('creatingAccount') : t('createAccount')}
            </button>

            <div className="modern-login-section">
              <div className="modern-divider">
                <span>{t('alreadyHaveAccount')}</span>
              </div>
              <Link to="/my-Profile" className="modern-login-link">
                <i className="fas fa-sign-in-alt"></i>
                {t('login')}
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;
