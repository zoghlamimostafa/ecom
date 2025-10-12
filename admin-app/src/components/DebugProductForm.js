import React from 'react';

// Composant de debug pour surveiller l'état du formulaire de produit
const DebugProductForm = ({ formik, newProduct, isLoading, isError, isSuccess }) => {
  
  // Vérification de sécurité pour formik
  if (!formik) {
    console.log('⚠️ DEBUG: Formik is undefined, skipping debug component');
    return null;
  }
  
  console.log('🔍 DEBUG PRODUCT FORM STATE:', {
    formikValues: formik.values,
    formikErrors: formik.errors,
    formikTouched: formik.touched,
    newProductState: newProduct,
    isLoading,
    isError,
    isSuccess,
    timestamp: new Date().toISOString()
  });

  // Affichage debug seulement en développement
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f0f0f0',
      border: '1px solid #ccc',
      padding: '10px',
      fontSize: '12px',
      maxWidth: '300px',
      maxHeight: '400px',
      overflow: 'auto',
      zIndex: 9999
    }}>
      <h4>🔍 Debug Info</h4>
      
      <div>
        <strong>Loading:</strong> {isLoading ? '✅' : '❌'}
      </div>
      
      <div>
        <strong>Error:</strong> {isError ? '❌' : '✅'}
      </div>
      
      <div>
        <strong>Success:</strong> {isSuccess ? '✅' : '❌'}
      </div>
      
      {newProduct && newProduct.message && (
        <div>
          <strong>Message:</strong> {JSON.stringify(newProduct.message)}
        </div>
      )}
      
      <div>
        <strong>Form Valid:</strong> {formik.isValid ? '✅' : '❌'}
      </div>
      
      {formik.errors && Object.keys(formik.errors).length > 0 && (
        <div>
          <strong>Errors:</strong>
          <pre>{JSON.stringify(formik.errors, null, 2)}</pre>
        </div>
      )}
      
      <div>
        <strong>Form Values:</strong>
        <pre>{JSON.stringify({
          title: (formik.values && formik.values.title) || "EMPTY",
          description: (formik.values && formik.values.description) || "EMPTY", 
          price: (formik.values && formik.values.price) || "EMPTY",
          brand: (formik.values && formik.values.brand) || "EMPTY",
          category: (formik.values && formik.values.category) || "EMPTY",
          tags: (formik.values && formik.values.tags) || "EMPTY",
          quantity: (formik.values && formik.values.quantity) || "EMPTY",
          color: (formik.values && formik.values.color) || "EMPTY",
          images: (formik.values && formik.values.images) || "EMPTY"
        }, null, 2)}</pre>
      </div>
      
      <div>
        <strong>Images Info:</strong>
        <div>Count: {(formik.values && Array.isArray(formik.values.images)) ? formik.values.images.length : 0}</div>
        {(formik.values && Array.isArray(formik.values.images)) && formik.values.images.length > 0 && (
          <div>URLs: {formik.values.images.map(img => img.url || 'no-url').join(', ')}</div>
        )}
      </div>
    </div>
  );
};

export default DebugProductForm;