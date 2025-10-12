import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { base_url } from "../utils/baseUrl";

let schema = yup.object().shape({
  firstname: yup.string().required("First Name is Required"),
  lastname: yup.string().required("Last Name is Required"),
  email: yup
    .string()
    .email("Email should be valid")
    .required("Email is Required"),
  mobile: yup.string().required("Mobile Number is Required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is Required"),
});

const CreateAdmin = () => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      email: "",
      mobile: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        const response = await axios.post(base_url + "user/create-admin", values);
        toast.success("Admin user created successfully!");
        resetForm();
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Error creating admin user";
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="py-5" style={{ backgroundColor: "#f5f5f5", minHeight: "100vh" }}>
      <div className="my-5 w-50 bg-white rounded-3 mx-auto p-4">
        <h3 className="text-center title">Create New Admin</h3>
        <p className="text-center">Fill in the details to create a new admin user.</p>
        
        <form onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            label="First Name"
            id="firstname"
            name="firstname"
            onChng={formik.handleChange("firstname")}
            onBlr={formik.handleBlur("firstname")}
            val={formik.values.firstname}
          />
          <div className="error mt-2">
            {formik.touched.firstname && formik.errors.firstname}
          </div>

          <CustomInput
            type="text"
            label="Last Name"
            id="lastname"
            name="lastname"
            onChng={formik.handleChange("lastname")}
            onBlr={formik.handleBlur("lastname")}
            val={formik.values.lastname}
          />
          <div className="error mt-2">
            {formik.touched.lastname && formik.errors.lastname}
          </div>

          <CustomInput
            type="email"
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
            type="text"
            label="Mobile Number"
            id="mobile"
            name="mobile"
            onChng={formik.handleChange("mobile")}
            onBlr={formik.handleBlur("mobile")}
            val={formik.values.mobile}
          />
          <div className="error mt-2">
            {formik.touched.mobile && formik.errors.mobile}
          </div>

          <CustomInput
            type="password"
            label="Password"
            id="password"
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
            style={{ background: "#232f3e" }}
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Admin"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAdmin;
