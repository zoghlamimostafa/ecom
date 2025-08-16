import React from 'react';
import { useFormik } from 'formik';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import { AiOutlineHome } from "react-icons/ai";
import { FiPhoneCall } from "react-icons/fi";
import { CiMail } from "react-icons/ci";
import { TbInfoCircle } from "react-icons/tb";
import Container from '../components/Container';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import { createQuery } from '../features/contact/contactSlice';

// Schema de validation Yup
const contactSchema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().nullable().email('Invalid email address').required('Email is required'),
  mobile: yup.string().default('').nullable().required('Mobile is required'),
  comment: yup.string().default('').nullable().required('Comments are required'),
});

const Contact = () => {
  const dispatch = useDispatch();

  // Fonction pour soumettre le formulaire
  const onSubmit = async (values) => {
    try {
      await dispatch(createQuery({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        comment: values.comment
      }));
      // Réinitialiser le formulaire après soumission réussie
      formik.resetForm();
    } catch (error) {
      console.error("An error occurred while submitting the form:", error);
    }
  };

  // Utilisation de useFormik pour gérer le formulaire
  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      mobile: '',
      comment: '',
    },
    validationSchema: contactSchema,
    onSubmit: onSubmit,
  });

  return (
    <>
      <Meta title={"Contact Us"} />
      <BrandCrumb title="Contact Us" />
      <Container class1='contact-wrapper py-5 home-wrapper-2'>
        <div className='row'>
        <div className='col-12'>
  <iframe
    title="Google Maps"
    width="100%"
    height="400"
    frameBorder="0"
    style={{ border: 0 }}
    src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6783609.113773861!2d4.2692090130773375!3d33.88169138230417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x125595448316a4e1%3A0x3a84333aaa019bef!2sTunisie!5e0!3m2!1sfr!2stn!4v1709173941590!5m2!1sfr!2stn" width="800" height="600" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade`}
    allowFullScreen
  ></iframe>
</div>

          <div className='col-12 mt-5'>
            <div className='contact-inner-wrapper d-flex justify-content-between'>
              <div>
                <h3 className='contact-title mb-4'>Contact</h3>
                <form onSubmit={formik.handleSubmit} className='d-flex flex-column gap-15'>
                  <div>
                    <input
                      type='text'
                      placeholder='Name'
                      className='form-control'
                      name='name'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                    />
                    <div className='error'>{formik.touched.name && formik.errors.name}</div>
                  </div>
                  <div>
                    <input
                      type='email'
                      placeholder='Email'
                      className='form-control'
                      name='email'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                    />
                    <div className='error'>{formik.touched.email && formik.errors.email}</div>
                  </div>
                  <div>
                    <input
                      type='tel'
                      placeholder="Mobile"
                      className='form-control'
                      name='mobile'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mobile}
                    />
                    <div className='error'>{formik.touched.mobile && formik.errors.mobile}</div>
                  </div>
                  <div>
                    <textarea
                      className="w-100 form-control"
                      placeholder='Comments'
                      rows="4"
                      cols="30"
                      name='comment'
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.comment}
                    ></textarea>
                    <div className='error'>{formik.touched.comment && formik.errors.comment}</div>
                  </div>
                  <div>
                    <button type='submit' className='button border-0'>Submit</button>
                  </div>
                </form>
              </div>
              <div>
                <h3 className='contact-title mb-4'>Prenez contact avec nous</h3>
                <ul className='ps-0'>
                  <li className='mb-3 d-flex gap-15 alogn-items-center'>
                    <AiOutlineHome className='fs-5' />
                    <address className='mb-0'>Tunisie</address>
                  </li>
                  <li className='mb-3 d-flex gap-15 alogn-items-center'>
                    <FiPhoneCall className='fs-5' />
                    <a href="+216 95413794">+216 95413794</a>
                  </li>
                  <li className='mb-3 d-flex gap-15 alogn-items-center'>
                    <CiMail className='fs-5' />
                    <a href='mailto:sannyshop02@gmail.com'>sannyshop02@gmail.com</a>
                  </li>
                  <li className='mb-3 d-flex gap-15 alogn-items-center'>
                    <TbInfoCircle className='fs-5' />
                    <p className='mb-0'>Lundi-Samedi 8 AM- 6PM</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default Contact;
