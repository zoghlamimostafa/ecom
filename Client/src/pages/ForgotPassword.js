import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../features/user/userSlice';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import { Link } from 'react-router-dom';
import Container from '../components/Container';

const ForgotPassword = () => {
  const dispatch = useDispatch();
  
  // États locaux pour gérer les données du formulaire
  const [email, setEmail] = useState('');

  // Gestionnaire de soumission de formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Envoyer une action forgotPassword avec les données du formulaire
    dispatch(forgotPassword(email));
  };

  return (
    <>
      <Meta title={"Forgot_Password"} />
      <BrandCrumb title="Forgot_Password" /> 
      <Container class1='login-wrapper py-5 home-wrapper-2'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='auth-card p-4'>
            <h3 className='text-center mb-3'>Réinitialiser votre mot de passe</h3>
            <p className='text-center mt-2 mb-3'>Nous vous enverrons un e-mail pour réinitialiser votre mot de passe</p>
            <form onSubmit={handleSubmit} className='d-flex flex-column gap-3'>
              <div>
                <input 
                  type='email' 
                  name="email" 
                  placeholder='E-mail' 
                  className='form-control' 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                />
              </div>
                    
              <div className='mt-3 d-flex justify-content-center'>
                <button className='button border-0' type="submit">Soumettre</button>
              </div>
              <div className='text-center'>
                <p className='mb-0 mt-3'><Link to="/login">Annuler</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
    </>
  );
};

export default ForgotPassword;
