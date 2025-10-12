import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Select, Row, Col, message, Space, Spin } from "antd";
import { UserOutlined, MailOutlined, PhoneOutlined, EditOutlined, SaveOutlined } from "@ant-design/icons";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { base_url } from "../utils/baseUrl";
import { getConfig } from "../utils/axiosConfig";
import { useParams, useNavigate } from "react-router-dom";

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
  role: yup.string().required("Le rôle est requis"),
});

const EditUser = () => {
  const [loading, setLoading] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userData, setUserData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  // Charger les données de l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoadingUser(true);
        // Récupérer tous les utilisateurs et trouver celui avec l'ID
        const response = await axios.get(base_url + "user/all-users", getConfig());
        const user = response.data.users.find(u => String(u.id) === String(id));
        
        if (user) {
          setUserData(user);
          formik.setValues({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            email: user.email || "",
            mobile: user.mobile || "",
            role: user.role || "user",
          });
        } else {
          message.error("Utilisateur non trouvé");
          navigate("/admin/customers");
        }
      } catch (error) {
        message.error("Erreur lors du chargement de l'utilisateur");
        console.error("Error fetching user:", error);
        navigate("/admin/customers");
      } finally {
        setLoadingUser(false);
      }
    };

    if (id) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, navigate]);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      role: "user",
    },
    validationSchema: schema,
    onSubmit: async (values, { setSubmitting }) => {
      setLoading(true);
      try {
        await axios.put(
          base_url + `user/edit-user/${id}`, 
          values,
          getConfig()
        );
        
        message.success("Utilisateur modifié avec succès!");
        navigate("/admin/customers");
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Erreur lors de la modification de l'utilisateur";
        message.error(errorMessage);
        console.error("Error updating user:", error);
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  if (loadingUser) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <p style={{ marginTop: '10px' }}>Chargement de l'utilisateur...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <p>Utilisateur non trouvé</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h3 className="title">
          <EditOutlined style={{ marginRight: 8 }} />
          Modifier l'Utilisateur
        </h3>
        <p style={{ color: '#666', marginBottom: 0 }}>
          Modifiez les informations de {userData.firstname} {userData.lastname}
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
                help={formik.touched.mobile && formik.errors.mobile}
              >
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Entrez le numéro de téléphone"
                  name="mobile"
                  value={formik.values.mobile}
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
                icon={<SaveOutlined />}
              >
                {loading ? "Modification en cours..." : "Sauvegarder les modifications"}
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate("/admin/customers")}
                disabled={loading}
              >
                Annuler
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ marginTop: 16 }} size="small">
        <h4>ℹ️ Informations</h4>
        <ul style={{ marginBottom: 0 }}>
          <li><strong>ID utilisateur :</strong> {userData.id}</li>
          <li><strong>Créé le :</strong> {new Date(userData.createdAt).toLocaleDateString()}</li>
          <li><strong>Dernière modification :</strong> {new Date(userData.updatedAt).toLocaleDateString()}</li>
          <li><strong>Statut :</strong> {userData.isBlocked ? '🚫 Bloqué' : '✅ Actif'}</li>
        </ul>
      </Card>
    </div>
  );
};

export default EditUser;