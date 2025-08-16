import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/user/userSlice';
import { useFormik } from "formik";
import * as yup from "yup";
import CustomInput from '../components/CustomInput';
import { Link, useNavigate } from 'react-router-dom';
import Container from '../components/Container';

const Login = () => {
  const authState= useSelector(state=>state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Schéma de validation avec Yup
  const personSchema = yup.object({
    email: yup.string().nullable().email("Email Should be valid").required("Email Adress is Required"),
    password: yup.string().required("Password is Required"),
  });

  // Utilisation de useFormik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: personSchema,
    onSubmit: (values) => {
      dispatch(loginUser(values));
      setTimeout(()=>{
        if (authState.isSuccess)
        navigate('/');

      }
      ,300);
    },
  });


  useEffect(()=>{
    if (authState.auth !== null && authState.isError === false) {

navigate('/')
    }
      
  },[authState])

  return (
    <Container class1='login-wrapper py-5 home-wrapper-2'>
      <div className='row justify-content-center'>
        <div className='col-md-6'>
          <div className='auth-card p-4'>
            <h3 className='text-center mb-3'>Se connecter</h3>
            <form onSubmit={formik.handleSubmit} className='d-flex flex-column gap-3'>
              <CustomInput
                type='email'
                name="email"
                placeholder='E-mail'
                className='form-control'
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className='error'>{formik.errors.email}</div>
              ) : null}

              <CustomInput
                type='password'
                name="password"
                placeholder='Mot de passe'
                className='form-control'
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className='error'>{formik.errors.password}</div>
              ) : null}

              <div className='d-flex justify-content-between'>
                <Link to='/forgot-password'>Mot de passe oublié ?</Link>
                <button type="submit" className='button border-0'>Se connecter</button>
              </div>
              <div className='text-center'>
                <p className='mb-0 mt-3'>Vous n'avez pas de compte ? <Link className='signup-link' to="/sign-up">S'inscrire</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Container>
  );
}

export default Login;
