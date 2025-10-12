import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from "formik";
import * as yup from "yup";
import CustomInput from '../components/CustomInput';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../features/user/userSlice';
import { useTranslation } from '../contexts/TranslationContext';
import Meta from '../components/Meta';
import SEOEnhancer from '../components/SEOEnhancer';

const Login = () => {
  const { t } = useTranslation();
  const authState = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
          navigate('/');
      }, 300);
    },
  });

  useEffect(() => {
    if (authState.auth !== null && authState.isError === false) {
      navigate('/');
    }
  }, [authState, navigate]);

  return (
    <>
      <SEOEnhancer 
        title={t('loginPageTitle')}
        description={t('loginPageDescription')}
        keywords={t('loginPageKeywords')}
        pageType="login"
      />
      <Meta title={t('login')} />
      <div className="login-bg">
      <div className="login-decorations">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
      <div className="login-center">
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo-container">
              <img src="/logo192.png" alt="Logo Sanny" className="login-logo" />
              <div className="logo-glow"></div>
            </div>
            <div className="login-welcome">
              <h2 className="login-title">{t('welcomeBack')}</h2>
              <p className="login-sub">{t('loginToYourAccount')}</p>
            </div>
          </div>
          
          <form onSubmit={formik.handleSubmit} className="login-form">
            <div className="input-group">
              <span className="input-icon">
                <i className="fa fa-envelope"></i>
              </span>
              <CustomInput
                type='email'
                name="email"
                placeholder={t('enterYourEmail')}
                className='login-input'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="input-underline"></div>
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className='login-error'>
                <i className="fa fa-exclamation-triangle"></i>
                {formik.errors.email}
              </div>
            ) : null}

            <div className="input-group">
              <span className="input-icon">
                <i className="fa fa-lock"></i>
              </span>
              <CustomInput
                type='password'
                name="password"
                placeholder={t('enterYourPassword')}
                className='login-input'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="input-underline"></div>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className='login-error'>
                <i className="fa fa-exclamation-triangle"></i>
                {formik.errors.password}
              </div>
            ) : null}

            <div className="forgot-password-section">
              <Link to='/forgot-password' className="login-link forgot-link">
                <i className="fa fa-key"></i>
                {t('forgotPassword')}
              </Link>
            </div>

            <button type="submit" className='login-btn' disabled={formik.isSubmitting}>
              {formik.isSubmitting ? (
                <>
                  <i className="fa fa-spinner fa-spin"></i>
                  {t('loggingIn')}
                </>
              ) : (
                <>
                  <i className="fa fa-sign-in-alt"></i>
                  {t('login')}
                </>
              )}
            </button>
            
            <div className="divider">
              <span>{t('or')}</span>
            </div>
            
            <div className='login-bottom'>
              <span>{t('noAccountYet')} </span>
              <Link className='signup-link' to="/sign-up">
                <i className="fa fa-user-plus"></i>
                {t('createAccount')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
    </>
  );
}

export default Login;
