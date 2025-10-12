import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Header from './Header'
import Footer from './Footer'
import { getWishlist } from '../features/products/productSlice'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Layout = () => {
  const dispatch = useDispatch();
  const authState = useSelector(state => state.auth);
  const isAuthenticated = authState?.auth?.token;

  useEffect(() => {
    if (isAuthenticated) {
      // Récupérer la wishlist de l'utilisateur connecté
      dispatch(getWishlist());
    }
  }, [dispatch, isAuthenticated]);

  return (
    <>
      <Header/>
      <Outlet/>
      <Footer/>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  )
}

export default Layout
