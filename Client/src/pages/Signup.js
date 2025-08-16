import React from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import { useFormik } from "formik";
import * as yup from "yup";
import CustomInput from '../components/CustomInput';
import { useDispatch } from 'react-redux';
import { registerUser } from '../features/user/userSlice';
import Container from '../components/Container';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Validation schema using Yup
  const personSchema = yup.object({
    firstname: yup.string().required("First Name is Required"),
    lastname: yup.string().required("Last Name is Required"),
    email: yup.string().nullable().email("Email Should be valid").required("Email Adress is Required"),
    mobile: yup.string().required("Mobile No is Required"),
    password: yup.string().required("Password is Required"),
  });

  // Handle form submission
  const onSubmit = async (values) => {
    try {
      // Validation before dispatching the form data
      await personSchema.validate(values, { abortEarly: false });

      const formData = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        mobile: values.mobile,
        password: values.password
      };

      // Dispatch the register action
      await dispatch(registerUser(formData)); // Assurez-vous que `registerUser` est une fonction asynchrone

      // Redirect to the login page after successful registration
      navigate('/login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Error during form submission:', error);
      // Vous pouvez gérer l'affichage d'une erreur ici si la validation échoue
    }
  };

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: personSchema,
    onSubmit: onSubmit, // Submit handler
  });

  return (
    <>
      <Meta title={"SignUp"} />
      <BrandCrumb title="SignUp" />
      <Container class1='login-wrapper py-5 home-wrapper-2'>
        <div className='row justify-content-center'>
          <div className='col-md-6'>
            <div className='auth-card p-4'>
              <h3 className='text-center mb-3'>S'inscrire</h3>
              <form onSubmit={formik.handleSubmit} className='d-flex flex-column gap-3'>
                <CustomInput
                  type='text'
                  name="firstname"
                  placeholder='Prénom'
                  className='form-control'
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.firstname && formik.errors.firstname ? (
                  <div className='error'>{formik.errors.firstname}</div>
                ) : null}

                <CustomInput
                  type='text'
                  name="lastname"
                  placeholder='Nom de famille'
                  className='form-control'
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.lastname && formik.errors.lastname ? (
                  <div className='error'>{formik.errors.lastname}</div>
                ) : null}

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
                  type='tel'
                  name="mobile"
                  placeholder='Mobile'
                  className='form-control'
                  value={formik.values.mobile}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.mobile && formik.errors.mobile ? (
                  <div className='error'>{formik.errors.mobile}</div>
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

                <div className='mt-3 d-flex justify-content-center'>
                  <button type="submit" className='button border-0'>S'inscrire</button>
                </div>
                <div className='text-center'>
                  <p className='mb-0 mt-3'>Vous avez déjà un compte ? <Link className='signup-link' to="/login">Se connecter</Link></p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Signup;
