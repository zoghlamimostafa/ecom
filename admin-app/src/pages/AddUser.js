import React, { useState } from "react";
import { Card, Form, Input, Button, Select, Row, Col, message, Space } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, LockOutlined, UserAddOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { countries } from "../utils/countries";

const { Option } = Select;

// Validation schema
let schema = yup.object().shape({
  firstname: yup.string().required("Le prénom est requis"),
  lastname: yup.string().required("Le nom est requis"),
  email: yup
    .string()
    .email("L'email doit être valide")
    .required("L'email est requis"),
  mobile: yup.string().required("Le numéro de téléphone est requis"),
  password: yup.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").required("Le mot de passe est requis"),
  role: yup.string().required("Le rôle est requis"),
});

const AddUser = () => {
  const [loading, setLoading] = useState(false);
  const [countryCode, setCountryCode] = useState('+33'); // France par défaut
  const [phoneNumber, setPhoneNumber] = useState('');

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
      role: "user", // Default role
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        let endpoint = "user/register";
        let successMessage = "Utilisateur créé avec succès!";
        
        // If creating an admin, use admin-register endpoint
        if (values.role === "admin") {
          endpoint = "user/admin-register";
          successMessage = "Administrateur créé avec succès!";
        }

        // Combiner l'indicatif et le numéro
        const fullMobile = countryCode + phoneNumber;
        const dataToSend = { ...values, mobile: fullMobile };

        await axios.post(base_url + endpoint, dataToSend);
        message.success(successMessage);
        resetForm();
        setPhoneNumber('');
        setCountryCode('+33');
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Erreur lors de la création de l'utilisateur";
        message.error(errorMessage);
        console.error("Error creating user:", error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 className="title">
          <UserAddOutlined style={{ marginRight: 8 }} />
          Ajouter un Utilisateur
        </h3>
        <p style={{ color: '#666', marginBottom: 0 }}>
          Créez un nouveau compte utilisateur ou administrateur
        </p>
      </div>

      <Card>
        <Form layout="vertical" onFinish={formik.handleSubmit}>
          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Prénom"
                validateStatus={formik.touched.firstname && formik.errors.firstname ? 'error' : ''}
                help={formik.touched.firstname && formik.errors.firstname}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Entrez le prénom"
                  name="firstname"
                  value={formik.values.firstname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label="Nom"
                validateStatus={formik.touched.lastname && formik.errors.lastname ? 'error' : ''}
                help={formik.touched.lastname && formik.errors.lastname}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Entrez le nom"
                  name="lastname"
                  value={formik.values.lastname}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Email"
                validateStatus={formik.touched.email && formik.errors.email ? 'error' : ''}
                help={formik.touched.email && formik.errors.email}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Entrez l'email"
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label="Téléphone"
                validateStatus={formik.touched.mobile && formik.errors.mobile ? 'error' : ''}
                help={(formik.touched.mobile && formik.errors.mobile) || "Format: Sélectionnez le pays puis entrez le numéro"}
              >
                <Input.Group compact>
                  <Select
                    showSearch
                    style={{ width: '40%' }}
                    placeholder="Pays"
                    value={countryCode}
                    onChange={(value) => {
                      setCountryCode(value);
                      formik.setFieldValue('mobile', value + phoneNumber);
                    }}
                    size="large"
                    optionFilterProp="children"
                    filterOption={(input, option) => {
                      const children = option.children;
                      if (typeof children === 'string') {
                        return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                      }
                      if (Array.isArray(children)) {
                        return children.some(child => 
                          typeof child === 'string' && child.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        );
                      }
                      return false;
                    }}
                  >
                    {countries.map((country) => (
                      <Option key={country.code} value={country.code}>
                        {country.flag} {country.code}
                      </Option>
                    ))}
                  </Select>
                  <Input
                    style={{ width: '60%' }}
                    placeholder="Numéro de téléphone"
                    value={phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^\d]/g, ''); // Seulement les chiffres
                      setPhoneNumber(value);
                      formik.setFieldValue('mobile', countryCode + value);
                    }}
                    onBlur={formik.handleBlur}
                    size="large"
                    maxLength={15}
                  />
                </Input.Group>
                {phoneNumber && (
                  <div style={{ marginTop: 8, color: '#1890ff', fontSize: '12px' }}>
                    <PhoneOutlined /> Numéro complet: {countryCode} {phoneNumber}
                  </div>
                )}
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 0]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label="Mot de passe"
                validateStatus={formik.touched.password && formik.errors.password ? 'error' : ''}
                help={formik.touched.password && formik.errors.password}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Entrez le mot de passe"
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  size="large"
                />
              </Form.Item>
            </Col>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label="Rôle"
                validateStatus={formik.touched.role && formik.errors.role ? 'error' : ''}
                help={formik.touched.role && formik.errors.role}
              >
                <Select
                  placeholder="Sélectionnez un rôle"
                  name="role"
                  value={formik.values.role}
                  onChange={(value) => formik.setFieldValue('role', value)}
                  onBlur={formik.handleBlur}
                  size="large"
                >
                  <Option value="user">
                    <Space>
                      <UserOutlined />
                      Utilisateur
                    </Space>
                  </Option>
                  <Option value="admin">
                    <Space>
                      <UserOutlined />
                      Administrateur
                    </Space>
                  </Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                size="large"
                icon={<UserAddOutlined />}
              >
                {loading ? "Création en cours..." : "Créer l'utilisateur"}
              </Button>
              <Button 
                size="large" 
                onClick={() => formik.resetForm()}
                disabled={loading}
              >
                Réinitialiser
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }} size="small">
        <h4>ℹ️ Informations</h4>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>Utilisateur :</strong> Peut se connecter au site client et passer des commandes</li>
          <li><strong>Administrateur :</strong> Peut accéder à l'interface d'administration</li>
          <li><strong>Mot de passe :</strong> Minimum 6 caractères requis</li>
          <li><strong>Email :</strong> Doit être unique dans le système</li>
        </ul>
      </Card>
    </div>
  );
};

export default AddUser;