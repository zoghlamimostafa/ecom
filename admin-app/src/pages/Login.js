import React, { useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { Link, useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import axios from "axios";
import { base_url } from "../utils/baseUrl";

let schema = yup.object().shape({
  email: yup
    .string()
    .email("Email should be valid")
    .required("Email is Required"),
  password: yup.string().required("Password is Required"),
});
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(null);
  
  const testBackendConnection = async () => {
    setTestResult("🔄 Test en cours...");
    try {
      const response = await axios.get(base_url + 'product/');
      setTestResult(`✅ Backend OK - ${response.data.length} produits trouvés`);
    } catch (error) {
      setTestResult(`❌ Erreur: ${error.message}`);
    }
  };
  
  const quickLogin = async () => {
    setTestResult("🔄 Connexion en cours...");
    try {
      const response = await axios.post(base_url + 'user/admin-login', {
        email: 'admin@test.com',
        password: 'admin123'
      });
      
      console.log('Réponse API:', response.data);
      
      if (response.data.token) {
        // Sauvegarder les données utilisateur
        localStorage.setItem('user', JSON.stringify(response.data));
        setTestResult("✅ Connexion réussie ! Redirection...");
        
        // Redirection vers l'admin
        setTimeout(() => {
          navigate('/admin');
          window.location.reload();
        }, 1000);
      } else {
        setTestResult("❌ Pas de token reçu");
      }
    } catch (error) {
      console.error('Erreur connexion:', error);
      setTestResult(`❌ Connexion échouée: ${error.response?.data?.message || error.message}`);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      dispatch(login(values));
    },
  });
  const authState = useSelector((state) => state);

  const { user, isError, isSuccess, isLoading, message } = authState.auth;

  useEffect(() => {
    if (isSuccess) {
      navigate("admin");
    } else {
      navigate("");
    }
  }, [user, isError, isSuccess, isLoading]);
  return (
    <div className="py-5" style={{  minHeight: "100vh" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="my-5 w-25 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Se connecter</h3>
        <p className="text-center">Connectez-vous à votre compte pour continuer.</p>
        <div className="error text-center">
          {message && isError ? (
            <div className="alert alert-danger">
              {(() => {
                // Sécuriser l'affichage du message d'erreur
                if (typeof message === 'string') {
                  return message === "Rejected" ? "Erreur de connexion - Vérifiez vos identifiants" : message;
                } else if (typeof message === 'object' && message.message) {
                  return message.message === "Rejected" ? "Erreur de connexion - Vérifiez vos identifiants" : message.message;
                } else {
                  return "Erreur de connexion - Vérifiez vos identifiants";
                }
              })()}
            </div>
          ) : null}
        </div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="Email"
            id="email"
            name="email"
            onChng={formik.handleChange("email")}
            onBlr={formik.handleBlur("email")}
            val={formik.values.email}
          />
          <div className="error mt-2">
            {formik.touched.email && formik.errors.email}
          </div>
          <CustomInput
            type="password"
            label="Password"
            id="pass"
            name="password"
            onChng={formik.handleChange("password")}
            onBlr={formik.handleBlur("password")}
            val={formik.values.password}
          />
          <div className="error mt-2">
            {formik.touched.password && formik.errors.password}
          </div>
          
          <button
            className="border-0 px-3 py-2 text-white fw-bold w-100 text-center text-decoration-none fs-5"
            style={{ background: "black" }}
            type="submit"
          >
            Se connecter
          </button>

          {/* Boutons de diagnostic */}
          <div className="mt-3">
            <button
              type="button"
              onClick={testBackendConnection}
              className="btn btn-info w-100 mb-2"
            >
              🔍 Tester la connectivité Backend
            </button>
            
            <button
              type="button"
              onClick={quickLogin}
              className="btn btn-success w-100 mb-2"
            >
              🚀 Connexion rapide Admin
            </button>
            
            {testResult && (
              <div className="alert alert-info text-center">
                {testResult}
              </div>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;