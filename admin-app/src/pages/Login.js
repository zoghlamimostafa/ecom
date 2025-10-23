import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Alert, Space, Divider } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined, ApiOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/auth/authSlice";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import "../styles/Login.css";

let schema = yup.object().shape({
  email: yup
    .string()
    .email("Email doit être valide")
    .required("Email requis"),
  password: yup.string().required("Mot de passe requis"),
});
const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const testBackendConnection = async () => {
    setTestResult({ type: "info", message: "🔄 Test en cours..." });
    try {
      const response = await axios.get(base_url + 'product/');
      setTestResult({ 
        type: "success", 
        message: `✅ Backend OK - ${response.data.length || 0} produits trouvés` 
      });
    } catch (error) {
      setTestResult({ 
        type: "error", 
        message: `❌ Erreur: ${error.message}` 
      });
    }
  };
  
  const quickLogin = async () => {
    setLoading(true);
    setTestResult({ type: "info", message: "🔄 Connexion en cours..." });
    try {
      const response = await axios.post(base_url + 'user/admin-login', {
        email: 'admin@test.com',
        password: 'admin123'
      });
      
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
        setTestResult({ 
          type: "success", 
          message: "✅ Connexion réussie ! Redirection..." 
        });
        
        setTimeout(() => {
          navigate('/admin');
          window.location.reload();
        }, 1000);
      } else {
        setTestResult({ type: "error", message: "❌ Pas de token reçu" });
      }
    } catch (error) {
      setTestResult({ 
        type: "error", 
        message: `❌ Échec: ${error.response?.data?.message || error.message}` 
      });
    } finally {
      setLoading(false);
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
  }, [user, isError, isSuccess, isLoading, navigate]);
  
  return (
    <div className="login-page-modern">
      <div className="login-background">
        <div className="login-shape shape-1"></div>
        <div className="login-shape shape-2"></div>
        <div className="login-shape shape-3"></div>
      </div>
      
      <div className="login-container-modern">
        <Card 
          className="login-card-modern"
          bordered={false}
          style={{
            maxWidth: 450,
            width: '100%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            borderRadius: '20px'
          }}
        >
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-circle">
                <LoginOutlined style={{ fontSize: '32px', color: '#ff8800' }} />
              </div>
            </div>
            <h2 className="login-title">Tableau de Bord Admin</h2>
            <p className="login-subtitle">Connectez-vous pour gérer votre boutique</p>
          </div>

          {message && isError && (
            <Alert
              message="Erreur de connexion"
              description={
                typeof message === 'string' 
                  ? (message === "Rejected" ? "Vérifiez vos identifiants" : message)
                  : "Vérifiez vos identifiants"
              }
              type="error"
              showIcon
              closable
              style={{ marginBottom: '20px' }}
            />
          )}

          <Form onFinish={formik.handleSubmit} layout="vertical">
            <Form.Item
              label="Email"
              validateStatus={formik.touched.email && formik.errors.email ? 'error' : ''}
              help={formik.touched.email && formik.errors.email}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#ff8800' }} />}
                type="email"
                name="email"
                placeholder="admin@exemple.com"
                size="large"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ borderRadius: '10px' }}
              />
            </Form.Item>

            <Form.Item
              label="Mot de passe"
              validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
              help={formik.touched.password && formik.errors.password}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#ff8800' }} />}
                name="password"
                placeholder="••••••••"
                size="large"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={{ borderRadius: '10px' }}
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                block
                loading={isLoading}
                icon={<LoginOutlined />}
                style={{
                  background: 'linear-gradient(135deg, #ff8800 0%, #ff6600 100%)',
                  border: 'none',
                  borderRadius: '10px',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(255, 136, 0, 0.3)'
                }}
              >
                Se connecter
              </Button>
            </Form.Item>
          </Form>

          <Divider style={{ margin: '20px 0', color: '#999' }}>
            Outils de développement
          </Divider>

          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            <Button
              type="default"
              onClick={testBackendConnection}
              block
              icon={<ApiOutlined />}
              style={{ borderRadius: '10px', height: '40px' }}
            >
              Tester la connectivité
            </Button>
            
            <Button
              type="dashed"
              onClick={quickLogin}
              block
              loading={loading}
              icon={<ThunderboltOutlined />}
              style={{ 
                borderRadius: '10px', 
                height: '40px',
                borderColor: '#52c41a',
                color: '#52c41a'
              }}
            >
              Connexion rapide (admin@test.com)
            </Button>
            
            {testResult && (
              <Alert
                message={testResult.message}
                type={testResult.type}
                showIcon
                closable
                onClose={() => setTestResult(null)}
              />
            )}
          </Space>
        </Card>
        
        <div className="login-footer">
          <p>© 2025 Sanny Store - Panel d'administration</p>
        </div>
      </div>
    </div>
  );
};

export default Login;