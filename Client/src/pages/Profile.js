import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../features/user/userSlice';
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logosanny.png';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, isError, errorMessage, isSuccess } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);

  // Schema de validation pour la mise à jour du profil
  const profileSchema = yup.object({
    firstname: yup.string().required("Prénom requis"),
    lastname: yup.string().required("Nom requis"),
    email: yup.string().email("Email doit être valide").required("Email requis"),
    mobile: yup.string().required("Téléphone requis"),
  });

  // Formik pour la mise à jour du profil
  const profileFormik = useFormik({
    initialValues: {
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      email: user?.email || '',
      mobile: user?.mobile || '',
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      dispatch(updateProfile(values));
      setIsEditing(false);
    },
  });

  useEffect(() => {
    // Si l'utilisateur n'est pas connecté, rediriger vers login
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isSuccess && !isEditing) {
      toast.success('Profil mis à jour avec succès !');
    }
    if (isError) {
      toast.error(errorMessage || 'Une erreur est survenue. Veuillez réessayer.');
    }
  }, [isSuccess, isError, errorMessage, isEditing]);

  // Si l'utilisateur n'est pas connecté, ne rien afficher (redirection en cours)
  if (!user) {
    return null;
  }

  return (
    <div className="profile-bg">
      <div className="profile-card modern-profile-card">
        <div className="modern-profile-header">
          <img 
            src={logo} 
            alt="Logo Sanny" 
            className="modern-profile-logo"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <h2 className="modern-profile-title">Mon Profil</h2>
          <p className="modern-profile-subtitle">
            {isEditing ? 'Modifiez vos informations' : 'Vos informations personnelles'}
          </p>
        </div>

        {!isEditing ? (
          // Mode affichage des informations
          <div className="modern-profile-form">
            <div className="profile-info-section">
              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-user"></i>
                  Prénom
                </label>
                <div className="profile-info-value">{user.firstname}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-user"></i>
                  Nom
                </label>
                <div className="profile-info-value">{user.lastname}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-envelope"></i>
                  Adresse Email
                </label>
                <div className="profile-info-value">{user.email}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-phone"></i>
                  Téléphone
                </label>
                <div className="profile-info-value">{user.mobile || 'Non renseigné'}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-calendar"></i>
                  Membre depuis
                </label>
                <div className="profile-info-value">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString('fr-FR') : 'Date inconnue'}
                </div>
              </div>
            </div>

            <button 
              className="modern-profile-btn update-profile-btn" 
              onClick={() => setIsEditing(true)}
            >
              <i className="fas fa-edit"></i>
              Modifier mon profil
            </button>

            <div className="profile-actions">
              <Link to="/my-orders" className="profile-action-link">
                <i className="fas fa-shopping-bag"></i>
                Mes commandes
              </Link>
              <Link to="/wishlist" className="profile-action-link">
                <i className="fas fa-heart"></i>
                Ma liste de souhaits
              </Link>
            </div>
          </div>
        ) : (
          // Mode édition
          <form onSubmit={profileFormik.handleSubmit} className="modern-profile-form">
            <div className="modern-form-group">
              <label htmlFor="firstname" className="modern-label">
                <i className="fas fa-user"></i>
                Prénom
              </label>
              <input
                type="text"
                id="firstname"
                name="firstname"
                value={profileFormik.values.firstname}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className={`modern-input ${profileFormik.touched.firstname && profileFormik.errors.firstname ? 'error' : ''}`}
                placeholder="Votre prénom"
              />
              {profileFormik.touched.firstname && profileFormik.errors.firstname && (
                <div className="modern-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {profileFormik.errors.firstname}
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
                value={profileFormik.values.lastname}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className={`modern-input ${profileFormik.touched.lastname && profileFormik.errors.lastname ? 'error' : ''}`}
                placeholder="Votre nom"
              />
              {profileFormik.touched.lastname && profileFormik.errors.lastname && (
                <div className="modern-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {profileFormik.errors.lastname}
                </div>
              )}
            </div>

            <div className="modern-form-group">
              <label htmlFor="email" className="modern-label">
                <i className="fas fa-envelope"></i>
                Adresse Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileFormik.values.email}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className={`modern-input ${profileFormik.touched.email && profileFormik.errors.email ? 'error' : ''}`}
                placeholder="votre@email.com"
              />
              {profileFormik.touched.email && profileFormik.errors.email && (
                <div className="modern-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {profileFormik.errors.email}
                </div>
              )}
            </div>

            <div className="modern-form-group">
              <label htmlFor="mobile" className="modern-label">
                <i className="fas fa-phone"></i>
                Téléphone
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                value={profileFormik.values.mobile}
                onChange={profileFormik.handleChange}
                onBlur={profileFormik.handleBlur}
                className={`modern-input ${profileFormik.touched.mobile && profileFormik.errors.mobile ? 'error' : ''}`}
                placeholder="Votre numéro de téléphone"
              />
              {profileFormik.touched.mobile && profileFormik.errors.mobile && (
                <div className="modern-error">
                  <i className="fas fa-exclamation-circle"></i>
                  {profileFormik.errors.mobile}
                </div>
              )}
            </div>

            <div className="form-buttons">
              <button 
                type="submit" 
                className="modern-profile-btn save-btn" 
                disabled={isLoading}
              >
                <i className="fas fa-save"></i>
                {isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
              </button>
              
              <button 
                type="button" 
                className="modern-profile-btn cancel-btn" 
                onClick={() => {
                  setIsEditing(false);
                  profileFormik.resetForm();
                }}
              >
                <i className="fas fa-times"></i>
                Annuler
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
