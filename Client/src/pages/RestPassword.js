import React from 'react';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../features/user/userSlice';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import { useFormik } from "formik";
import * as yup from "yup";
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import de toast depuis react-toastify

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const token = location.pathname.split("/")[3];

  // Schéma de validation avec Yup
  const schema = yup.object({
    password: yup.string().required("Password is Required"),
  });

  // Utilisation de useFormik pour la gestion du formulaire
  const formik = useFormik({
    initialValues: {
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(resetPassword({ token: token, password: values.password }))
        .then(() => {
          navigate('/login');
        })
        
    },
  });

  return (
    <>
      <Meta title="Reset Password" />
      <BrandCrumb title="Reset Password" />
      <Container class1="login-wrapper py-5 home-wrapper-2">
        <div className="row">
          <div className="col-12">
            <div className="auth-card">
              <h3 className="text-center mb-3">Reset Your Password</h3>
              <form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-15">
                <div>
                  <input
                    type="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="New Password"
                    className="form-control"
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="error">{formik.errors.password}</div>
                  ) : null}
                </div>
                <div className="mt-3 d-flex justify-content-center flex-column gap-15 align-items-center">
                  <button className="button border-0" type="submit">
                    Reset Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ResetPassword;
