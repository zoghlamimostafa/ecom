import React, { useEffect, useState } from "react";
import { Table } from "antd";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getProducts, deleteProduct, resetState } from "../features/product/productSlice";
import { Link } from "react-router-dom";
import CustomModal from "../components/CustomModel";

const columns = [
  {
    title: "Numéro",
    dataIndex: "key",
  },
  {
    title: "Image",
    dataIndex: "image",
    render: (images) => {
      if (images && images.length > 0) {
        return (
          <img 
            src={images[0]} 
            alt="Product" 
            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
          />
        );
      }
      return (
        <div style={{ 
          width: '50px', 
          height: '50px', 
          backgroundColor: '#f0f0f0', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#666'
        }}>
          Pas d'image
        </div>
      );
    }
  },
  {
    title: "Titre",
    dataIndex: "title",
    sorter: (a, b) => a.title.length - b.title.length,
  },
  {
    title: "Marque",
    dataIndex: "brand",
    sorter: (a, b) => a.brand.length - b.brand.length,
  },
  {
    title: "Catégorie",
    dataIndex: "category",
    sorter: (a, b) => a.category.length - b.category.length,
  },
  {
    title: "Couleur",
    dataIndex: "color",
  },
  {
    title: "Prix",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
  },
  {
    title: "Action",
    dataIndex: "action",
  },
];

const Productlist = () => {
  const [open, setOpen] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState("");
  
  // Function to convert ObjectId to readable text
  const formatFieldValue = (value, fieldType) => {
    if (!value) return 'N/A';
    
    if (typeof value === 'string' && value.length === 24) {
      // Looks like an ObjectId, return a generic label
      switch (fieldType) {
        case 'brand':
          return 'Marque ID: ' + value.slice(-6);
        case 'category':
          return 'Cat. ID: ' + value.slice(-6);
        default:
          return value;
      }
    }
    
    if (typeof value === 'object') {
      return value.title || value.name || 'N/A';
    }
    
    return value;
  };
  
  const showModal = (productId) => {
    setOpen(true);
    setProductIdToDelete(productId);
  };
  
  const hideModal = () => {
    setOpen(false);
    setProductIdToDelete("");
  };

  const dispatch = useDispatch();
  const productState = useSelector((state) => state.product);
  
  useEffect(() => {
    dispatch(resetState());
    dispatch(getProducts());
  }, [dispatch]);
  
  // Gestion des états de chargement et d'erreur
  if (productState.isLoading) {
    return (
      <div>
        <h3 className="mb-4 title">Des produits</h3>
        <div className="d-flex justify-content-center">
          <div className="spinner-border" role="status">
            <span className="sr-only">Chargement...</span>
          </div>
        </div>
      </div>
    );
  }
  
  if (productState.isError) {
    // Sécuriser l'affichage du message d'erreur
    let errorMessage = 'Une erreur s\'est produite lors du chargement des données.';
    if (productState.message) {
      if (typeof productState.message === 'string') {
        errorMessage = productState.message;
      } else if (typeof productState.message === 'object' && productState.message.message) {
        errorMessage = productState.message.message;
      } else if (typeof productState.message === 'object') {
        errorMessage = JSON.stringify(productState.message);
      }
    }
    
    return (
      <div>
        <h3 className="mb-4 title">Des produits</h3>
        <div className="alert alert-danger" role="alert">
          <strong>Erreur :</strong> {errorMessage}
          <br />
          <button 
            className="btn btn-primary mt-2" 
            onClick={() => dispatch(getProducts())}
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }
  
  // Safety check for productState.products
  if (!productState.products || !Array.isArray(productState.products)) {
    return (
      <div>
        <h3 className="mb-4 title">Des produits</h3>
        <div className="alert alert-warning">Aucun produit trouvé.</div>
      </div>
    );
  }
  
  const data = productState.products.map((product, index) => {
    const productId = product.id;
    
    // Debug: Vérifier la structure des données produit
    console.log(`🔍 Produit ${index + 1}:`, {
      id: productId,
      title: product.title,
      images: product.images,
      imagesType: typeof product.images,
      isImagesArray: Array.isArray(product.images),
      imagesLength: product.images?.length
    });
    
    // Safe color processing avec parsing JSON
    let colorDisplay = 'N/A';
    if (product.color) {
      try {
        let colorData = product.color;
        
        // Si c'est un string JSON, le parser
        if (typeof colorData === 'string') {
          colorData = JSON.parse(colorData);
        }
        
        if (Array.isArray(colorData)) {
          const validColors = colorData
            .filter(c => c && typeof c === 'object' && !c.buffer) // Exclude buffer objects
            .map(c => c.title || c.name || c.toString())
            .filter(Boolean);
          colorDisplay = validColors.length > 0 ? validColors.join(', ') : 'N/A';
        } else if (typeof colorData === 'string') {
          colorDisplay = colorData;
        }
      } catch (parseError) {
        console.warn(`⚠️ Erreur parsing couleurs pour produit ${product.title}:`, parseError);
        // Si le parsing échoue, utiliser la valeur telle quelle
        colorDisplay = typeof product.color === 'string' ? product.color : 'N/A';
      }
    }

    // Sécuriser le traitement des images avec parsing JSON
    let imageUrls = [];
    if (product.images) {
      try {
        let imagesData = product.images;
        
        // Si c'est un string JSON, le parser
        if (typeof imagesData === 'string') {
          imagesData = JSON.parse(imagesData);
        }
        
        // Maintenant traiter comme un array
        if (Array.isArray(imagesData)) {
          imageUrls = imagesData
            .map(img => {
              if (typeof img === 'string') return img;
              if (img && typeof img === 'object' && img.url) return img.url;
              return null;
            })
            .filter(Boolean);
        } else if (typeof imagesData === 'string') {
          imageUrls = [imagesData];
        }
      } catch (parseError) {
        console.warn(`⚠️ Erreur parsing images pour produit ${product.title}:`, parseError);
        // Si le parsing échoue, essayer de traiter comme string simple
        if (typeof product.images === 'string' && product.images.startsWith('http')) {
          imageUrls = [product.images];
        }
      }
    }

    return {
      key: index + 1,
      image: imageUrls,
      title: product.title || 'N/A',
      brand: formatFieldValue(product.brand, 'brand'),
      category: formatFieldValue(product.category, 'category'),
      color: colorDisplay,
      price: product.price ? `${product.price} TND` : 'N/A',
      action: (
        <>
          <Link to={`/admin/product/${productId}`} className="fs-3 text-black">
            <BiEdit />
          </Link>
          <button 
            className="ms-3 fs-3 text-black bg-transparent border-0" 
            onClick={() => showModal(productId)}
            style={{ cursor: 'pointer' }}
          >
            <AiFillDelete />
          </button>
        </>
      ),
    };
  });

  const handleDelete = (productId) => {
    dispatch(deleteProduct(productId));
    setOpen(false);
    setTimeout(() => {
      dispatch(getProducts());
    }, 100);
  };

  return (
    <div>
      <h3 className="mb-4 title">Des produits</h3>
      <div>
        <Table columns={columns} dataSource={data} />
      </div>
      <CustomModal
        hideModal={hideModal}
        open={open}
        performAction={() => {
          handleDelete(productIdToDelete);
        }}
        title="Êtes-vous sûr de vouloir supprimer ce produit?"
      />
    </div>
  );
};

export default Productlist;
