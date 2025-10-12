import React from 'react';
import BreadCrumb from '../components/BreadCrumb';
import Meta from '../components/Meta';
import CategoriesGrid from '../components/CategoriesGrid';

const CategoriesPage = () => {

  return (
    <>
      <Meta title="Toutes les catégories" />
      <BreadCrumb title="Catégories" />
      <CategoriesGrid />
    </>
  );
};

export default CategoriesPage;
