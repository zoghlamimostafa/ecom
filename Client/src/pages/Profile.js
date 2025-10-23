import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile, resetUpdateState } from '../features/user/userSlice';
import { useFormik } from "formik";
import * as yup from "yup";
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logosanny.png';
import './Profile-Minimal.css';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Utiliser state.user qui contient l'objet user extrait
  const userState = useSelector((state) => state.auth);
  const user = userState?.user;
  const isLoading = userState?.isLoading;
  const isError = userState?.isError;
  const errorMessage = userState?.errorMessage;
  const isSuccess = userState?.isSuccess;
  
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);

  // Récupérer les données utilisateur depuis Redux
  useEffect(() => {
    console.log('🔍 Redux user:', user);
    console.log('� Full userState:', userState);
    
    if (!user || Object.keys(user).length === 0) {
      console.warn('⚠️ Pas de données utilisateur, redirection vers login');
      navigate('/login');
      return;
    }
    
    console.log('✅ Setting user data:', user);
    setUserData(user);
  }, [user, navigate, userState]);

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
      firstname: userData?.firstname || '',
      lastname: userData?.lastname || '',
      email: userData?.email || '',
      mobile: userData?.mobile || '',
    },
    validationSchema: profileSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      console.log('📤 Soumission du formulaire:', values);
      try {
        const result = await dispatch(updateProfile(values)).unwrap();
        console.log('✅ Mise à jour réussie:', result);
        
        // Les données sont automatiquement mises à jour dans Redux et localStorage
        // Le useEffect avec [user] comme dépendance rechargera userData automatiquement
        
        setIsEditing(false);
        toast.success('Profil mis à jour avec succès !');
      } catch (error) {
        console.error('❌ Erreur lors de la mise à jour:', error);
        toast.error(error?.message || 'Erreur lors de la mise à jour du profil');
      }
    },
  });

  useEffect(() => {
    if (isSuccess && !isEditing) {
      toast.success('✅ Profil mis à jour avec succès !', {
        position: "top-right",
        autoClose: 3000,
      });
      
      // Mettre à jour userData après succès
      if (user) {
        console.log('🔄 Updating userData with new user:', user);
        setUserData(user);
      }
      
      // Réinitialiser l'état de succès après 1 seconde
      setTimeout(() => {
        dispatch(resetUpdateState());
      }, 1000);
    }
    if (isError) {
      toast.error(errorMessage || '❌ Une erreur est survenue. Veuillez réessayer.', {
        position: "top-right",
        autoClose: 4000,
      });
      
      // Réinitialiser l'état d'erreur après 1 seconde
      setTimeout(() => {
        dispatch(resetUpdateState());
      }, 1000);
    }
  }, [isSuccess, isError, errorMessage, isEditing, user, dispatch]);

  // Si pas de données utilisateur, afficher un spinner
  if (!userData) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Chargement de votre profil...</p>
      </div>
    );
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
                <div className="profile-info-value">{userData.firstname || 'Non renseigné'}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-user"></i>
                  Nom
                </label>
                <div className="profile-info-value">{userData.lastname || 'Non renseigné'}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-envelope"></i>
                  Adresse Email
                </label>
                <div className="profile-info-value">{userData.email || 'Non renseigné'}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-phone"></i>
                  Téléphone
                </label>
                <div className="profile-info-value">{userData.mobile || 'Non renseigné'}</div>
              </div>

              <div className="profile-info-item">
                <label className="modern-label">
                  <i className="fas fa-calendar"></i>
                  Membre depuis
                </label>
                <div className="profile-info-value">
                  {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString('fr-FR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Date inconnue'}
                </div>
              </div>

              {userData.address && (
                <div className="profile-info-item">
                  <label className="modern-label">
                    <i className="fas fa-map-marker-alt"></i>
                    Adresse
                  </label>
                  <div className="profile-info-value">{userData.address}</div>
                </div>
              )}
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
