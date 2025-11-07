import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import "./AddproductIntelligent.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select, Switch, Collapse, Badge, Card, Row, Col, Divider } from "antd";
import { 
  TagOutlined, 
  ShoppingOutlined, 
  AppstoreOutlined, 
  BgColorsOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  PictureOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  FireOutlined,
  StarOutlined
} from '@ant-design/icons';
import Dropzone from "react-dropzone";
import { delImg, uploadImg, resetUploadState } from "../features/upload/uploadSlice";
import { createProducts, updateProduct, resetState, getProduct } from "../features/product/productSlice";
import './AddproductIntelligent.css';

const { Panel } = Collapse;
const { Option } = Select;

let schema = yup.object().shape({
  title: yup.string().required("Le titre est requis"),
  description: yup.string().required("La description est requise"),
  price: yup.number().required("Le prix est requis").positive("Le prix doit être positif"),
  discount: yup.number().min(0, "La réduction ne peut pas être négative").default(0),
  brand: yup.string().nullable(),  // ✅ Marque optionnelle
  category: yup.string().required("La catégorie est requise"),
  quantity: yup.number().required("La quantité est requise").min(0, "La quantité ne peut pas être négative"),
});

const AddproductIntelligent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // États
  const [color, setColor] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  // const [productTags, setProductTags] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [gender, setGender] = useState("");
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isOnSale, setIsOnSale] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [salePercentage, setSalePercentage] = useState(0);
  
  const isEdit = !!id;
  
  // Récupérer les states Redux AVANT les useEffect qui les utilisent
  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const uploadState = useSelector((state) => state.upload);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct, product: productData } = newProduct;
  
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    
    if (isEdit && id) {
      dispatch(getProduct(id));
    }
  }, [dispatch, isEdit, id]);

  // Monitorer les changements d'images
  useEffect(() => {
    console.log("📸 ImgState changé:", imgState);
    console.log("📸 Nombre d'images:", imgState?.length || 0);
    if (imgState && imgState.length > 0) {
      toast.success(`✅ ${imgState.length} image(s) uploadée(s) avec succès !`);
    }
  }, [imgState]);
  
  // Monitorer l'état d'upload
  useEffect(() => {
    console.log("📸 Upload state:", uploadState);
    if (uploadState.isError) {
      toast.error(`❌ Erreur d'upload: ${uploadState.message || 'Erreur inconnue'}`);
    }
  }, [uploadState]);
  
  // Catégories principales uniquement (sans parent)
  const mainCategories = catState.filter(cat => !cat.parentId);
  
  // Sous-catégories de la catégorie sélectionnée (selectedCategory is now a number)
  const subcategories = catState.filter(cat => cat.parentId === selectedCategory);
  
  // Catégories de vêtements (pour afficher champs conditionnels)
  const clothingCategories = ["Vêtements", "Mode Homme", "Mode Femme", "Chaussures", "Accessoires"];
  const isClothingCategory = selectedCategory && mainCategories.find(cat => 
    cat.id === selectedCategory && clothingCategories.includes(cat.title)
  );
  
  // Options de tailles selon la catégorie
  const sizeOptions = {
    clothing: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    shoes: ["35", "36", "37", "38", "39", "40", "41", "42", "43", "44", "45", "46"],
    children: ["0-3 mois", "3-6 mois", "6-12 mois", "1 an", "2 ans", "3 ans", "4 ans", "5 ans", "6 ans", "8 ans", "10 ans", "12 ans", "14 ans"],
  };
  
  useEffect(() => {
    if (isSuccess && createdProduct && !isEdit) {
      toast.success("✅ Produit ajouté avec succès !");
      setTimeout(() => {
        dispatch(resetState());
        dispatch(resetUploadState());  // Reset images après succès
        navigate('/admin/list-product');
      }, 2000);
    }
    if (isSuccess && isEdit && isUpdating) {
      toast.success("✅ Produit mis à jour avec succès !");
      setTimeout(() => {
        dispatch(resetState());
        dispatch(resetUploadState());  // Reset images après succès
        navigate('/admin/list-product');
        setIsUpdating(false);
      }, 1500);
    }
    if (isError) {
      const errorMessage = newProduct.message || "Une erreur est survenue !";
      toast.error(`❌ ${errorMessage}`);
      setIsUpdating(false);
    }
  }, [isSuccess, isError, isLoading, createdProduct, isEdit, navigate, isUpdating, dispatch, newProduct.message]);
  
  // Cleanup: Reset upload state quand on quitte la page
  useEffect(() => {
    return () => {
      console.log("🧹 Nettoyage du composant - reset upload state");
      dispatch(resetUploadState());
    };
  }, [dispatch]);
  
  const colorOptions = colorState.map((color) => ({
    label: color.title,
    value: color.id,
  }));
  
  const img = [];
  
  // Protection contre les erreurs "objet"
  if (Array.isArray(imgState)) {
    imgState.forEach((i) => {
      // Vérifier que c'est bien un objet avec url et public_id
      if (i && typeof i === 'object' && i.url) {
        img.push({
          public_id: String(i.public_id || ''),
          url: String(i.url || ''),
        });
      } else {
        console.warn("⚠️ Image invalide ignorée:", i);
      }
    });
  } else {
    console.warn("⚠️ imgState n'est pas un array:", imgState);
  }
  
  console.log("📸 Images finales pour le formulaire:", img);
  
  // Construire les tags automatiquement
  const buildTags = () => {
    const tags = [];
    if (isNewProduct) tags.push('nouveau');
    if (isBestSeller) tags.push('best-seller');
    if (isOnSale) tags.push('promo');
    if (isFeatured) tags.push('featured');
    return tags.join(',');
  };
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productData?.title || "",
      description: productData?.description || "",
      price: productData?.price || "",
      discount: productData?.discount || 0,
      brand: productData?.brand || "",
      category: productData?.category || "",
      subcategory: productData?.subcategory || "",
      quantity: productData?.quantity || "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      // Validation supplémentaire avant envoi
      const finalCategory = selectedCategory || values.category;
      
      if (!finalCategory) {
        toast.error("❌ Veuillez sélectionner une catégorie");
        return;
      }
      
      // Images obligatoires uniquement pour la création, pas pour la modification
      if (!isEdit && (!img || img.length === 0)) {
        toast.error("❌ Veuillez ajouter au moins une image pour créer un nouveau produit");
        return;
      }
      
      const productPayload = {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        discount: Number(values.discount) || 0,
        brand: values.brand || null,  // ✅ null si vide
        category: parseInt(finalCategory),
        subcategory: selectedSubcategory ? parseInt(selectedSubcategory) : (values.subcategory ? parseInt(values.subcategory) : null),
        tags: buildTags(),
        color: color.length > 0 ? color : [],
        quantity: Number(values.quantity),
        metadata: {
          sizes: sizes.length > 0 ? sizes : null,
          gender: gender || null,
          salePercentage: isOnSale ? Number(salePercentage) : 0,
        }
      };
      
      // N'inclure les images que si elles ont été uploadées (modification ou création)
      if (img && img.length > 0) {
        productPayload.images = img;
      }
      
      console.log("📦 Envoi du produit:", productPayload);
      console.log("📊 Validation:", {
        hasCategory: !!productPayload.category,
        hasImages: productPayload.images?.length || 0,
        hasTitle: !!productPayload.title,
        hasPrice: !!productPayload.price,
        isEdit: isEdit,
      });
      
      if (isEdit) {
        setIsUpdating(true);
        const updateData = { ...productPayload, id: id };
        dispatch(updateProduct(updateData));
      } else {
        dispatch(createProducts(productPayload));
      }
    },
  });

  const handleColorChange = (value) => {
    setColor(value);
  };

  const handleCategoryChange = (value) => {
    // Convert to number for proper comparison with parentId
    const categoryId = parseInt(value);
    console.log("🏷️ Catégorie sélectionnée:", categoryId);
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory
    formik.setFieldValue("category", categoryId);
    formik.setFieldValue("subcategory", ""); // Reset subcategory in formik
  };

  const handleSubcategoryChange = (value) => {
    // Convert to number for consistency
    const subcategoryId = parseInt(value);
    setSelectedSubcategory(subcategoryId);
    formik.setFieldValue("subcategory", subcategoryId);
  };

  useEffect(() => {
    if (isEdit && productData) {
      console.log("📝 Chargement des données du produit pour modification:", productData);
      
      // Charger les couleurs
      if (productData.color) {
        const colors = Array.isArray(productData.color) 
          ? productData.color 
          : JSON.parse(productData.color || '[]');
        setColor(colors);
      }
      
      // Charger catégorie et sous-catégorie
      if (productData.category) setSelectedCategory(parseInt(productData.category));
      if (productData.subcategory) setSelectedSubcategory(parseInt(productData.subcategory));
      
      // Charger les tags
      if (productData.tags) {
        // 🔄 Tags peut être string ou array
        let tags = [];
        if (typeof productData.tags === 'string') {
          tags = productData.tags.split(',').map(t => t.trim());
        } else if (Array.isArray(productData.tags)) {
          tags = productData.tags;
        }
        
        setIsNewProduct(tags.includes('nouveau'));
        setIsBestSeller(tags.includes('best-seller'));
        setIsOnSale(tags.includes('promo'));
        setIsFeatured(tags.includes('featured'));
      }
      
      // Charger les métadonnées (tailles, genre, pourcentage de réduction)
      if (productData.metadata) {
        try {
          const metadata = typeof productData.metadata === 'string' 
            ? JSON.parse(productData.metadata) 
            : productData.metadata;
          
          if (metadata.sizes) {
            const sizesArray = Array.isArray(metadata.sizes) 
              ? metadata.sizes 
              : JSON.parse(metadata.sizes || '[]');
            setSizes(sizesArray);
          }
          
          if (metadata.gender) setGender(metadata.gender);
          if (metadata.salePercentage) setSalePercentage(metadata.salePercentage);
        } catch (error) {
          console.error("❌ Erreur lors du chargement des métadonnées:", error);
        }
      }
      
      // Charger les images existantes si disponibles
      if (productData.images && productData.images.length > 0) {
        console.log("🖼️ Images existantes chargées:", productData.images.length);
      }
    }
  }, [isEdit, productData]);

  return (
    <div className="addproduct-intelligent">
      <div className="page-header mb-4">
        <h2 className="page-title">
          {isEdit ? "✏️ Modifier le produit" : "➕ Ajouter un nouveau produit"}
        </h2>
        <p className="page-subtitle">
          Remplissez tous les champs pour {isEdit ? "modifier" : "ajouter"} un produit
        </p>
      </div>
      
      <form onSubmit={formik.handleSubmit}>
        <Collapse 
          defaultActiveKey={['1', '2', '3', '4', '5']} 
          className="custom-collapse"
          expandIconPosition="right"
        >
          {/* Section 1: Informations de base */}
          <Panel 
            header={
              <span className="panel-header">
                <InfoCircleOutlined /> Informations de base
              </span>
            } 
            key="1"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <label className="form-label required">Titre du produit</label>
                <CustomInput
                  type="text"
                  placeholder="Ex: iPhone 15 Pro Max 256GB"
                  name="title"
                  onChng={formik.handleChange}
                  onBlr={formik.handleBlur}
                  val={formik.values.title}
                />
                {formik.touched.title && formik.errors.title && (
                  <div className="error-message">{formik.errors.title}</div>
                )}
              </Col>
              
              <Col xs={24}>
                <label className="form-label required">Description</label>
                <ReactQuill
                  theme="snow"
                  name="description"
                  placeholder="Décrivez le produit en détail..."
                  onChange={(value) => formik.setFieldValue("description", value)}
                  value={formik.values.description}
                  style={{ minHeight: '200px' }}
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="error-message mt-2">{formik.errors.description}</div>
                )}
              </Col>
            </Row>
          </Panel>
          
          {/* Section 2: Catégories et Classification */}
          <Panel 
            header={
              <span className="panel-header">
                <AppstoreOutlined /> Catégories et Classification
              </span>
            } 
            key="2"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className="form-label required">Catégorie principale</label>
                <Select
                  showSearch
                  placeholder="Sélectionnez une catégorie"
                  className="w-100"
                  size="large"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                  filterOption={(input, option) => {
                    const children = option.children;
                    if (typeof children === 'string') {
                      return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {mainCategories.map((cat) => (
                    <Option key={cat.id} value={cat.id}>
                      {cat.title}
                    </Option>
                  ))}
                </Select>
                {formik.touched.category && formik.errors.category && (
                  <div className="error-message">{formik.errors.category}</div>
                )}
              </Col>
              
              <Col xs={24} md={12}>
                <label className="form-label">Sous-catégorie</label>
                <Select
                  showSearch
                  placeholder={selectedCategory ? "Sélectionnez une sous-catégorie" : "Choisissez d'abord une catégorie"}
                  className="w-100"
                  size="large"
                  value={selectedSubcategory}
                  onChange={handleSubcategoryChange}
                  disabled={!selectedCategory || subcategories.length === 0}
                  filterOption={(input, option) => {
                    const children = option.children;
                    if (typeof children === 'string') {
                      return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {subcategories.map((subcat) => (
                    <Option key={subcat.id} value={subcat.id}>
                      {subcat.title}
                    </Option>
                  ))}
                </Select>
                {subcategories.length === 0 && selectedCategory && (
                  <small className="text-muted">Aucune sous-catégorie disponible</small>
                )}
              </Col>
              
              <Col xs={24} md={12}>
                <label className="form-label">Marque (optionnel)</label>
                <Select
                  showSearch
                  allowClear
                  placeholder="Sélectionnez ou saisissez une marque"
                  className="w-100"
                  size="large"
                  value={formik.values.brand || undefined}
                  onChange={(value) => formik.setFieldValue("brand", value || null)}
                  filterOption={(input, option) => {
                    const children = option.children;
                    if (typeof children === 'string') {
                      return children.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                    }
                    return false;
                  }}
                >
                  {brandState.map((brand) => (
                    <Option key={brand.id} value={brand.title}>
                      {brand.title}
                    </Option>
                  ))}
                </Select>
                <small className="text-muted">
                  Optionnel - Laissez vide si le produit n'a pas de marque
                </small>
                {formik.touched.brand && formik.errors.brand && (
                  <div className="error-message">{formik.errors.brand}</div>
                )}
              </Col>
            </Row>
          </Panel>
          
          {/* Section 3: Caractéristiques du produit */}
          <Panel 
            header={
              <span className="panel-header">
                <BgColorsOutlined /> Caractéristiques du produit
              </span>
            } 
            key="3"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <label className="form-label">Couleurs disponibles</label>
                <Select
                  mode="multiple"
                  allowClear
                  className="w-100"
                  size="large"
                  placeholder="Sélectionnez les couleurs"
                  value={color}
                  onChange={handleColorChange}
                  options={colorOptions}
                />
                <small className="text-muted">Laissez vide si non applicable</small>
              </Col>
              
              {isClothingCategory && (
                <>
                  <Col xs={24} md={12}>
                    <label className="form-label">Tailles disponibles</label>
                    <Select
                      mode="multiple"
                      allowClear
                      className="w-100"
                      size="large"
                      placeholder="Sélectionnez les tailles"
                      value={sizes}
                      onChange={setSizes}
                    >
                      {sizeOptions.clothing.map((size) => (
                        <Option key={size} value={size}>{size}</Option>
                      ))}
                    </Select>
                  </Col>
                  
                  <Col xs={24} md={12}>
                    <label className="form-label">Genre</label>
                    <Select
                      className="w-100"
                      size="large"
                      placeholder="Sélectionnez le genre"
                      value={gender}
                      onChange={setGender}
                      allowClear
                    >
                      <Option value="homme">Homme</Option>
                      <Option value="femme">Femme</Option>
                      <Option value="unisexe">Unisexe</Option>
                      <Option value="enfant">Enfant</Option>
                      <Option value="bebe">Bébé</Option>
                    </Select>
                  </Col>
                </>
              )}
            </Row>
          </Panel>
          
          {/* Section 4: Prix et Stock */}
          <Panel 
            header={
              <span className="panel-header">
                <DollarOutlined /> Prix et Stock
              </span>
            } 
            key="4"
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} md={6}>
                <label className="form-label required">Prix (DT)</label>
                <CustomInput
                  type="number"
                  placeholder="0.00"
                  name="price"
                  onChng={formik.handleChange}
                  onBlr={formik.handleBlur}
                  val={formik.values.price}
                  step="0.01"
                />
                {formik.touched.price && formik.errors.price && (
                  <div className="error-message">{formik.errors.price}</div>
                )}
              </Col>

              <Col xs={24} md={6}>
                <label className="form-label">Réduction (DT)</label>
                <CustomInput
                  type="number"
                  placeholder="0"
                  name="discount"
                  onChng={formik.handleChange}
                  onBlr={formik.handleBlur}
                  val={formik.values.discount}
                  step="0.01"
                  min="0"
                />
                {formik.touched.discount && formik.errors.discount && (
                  <div className="error-message">{formik.errors.discount}</div>
                )}
                <small className="text-muted">Montant de la réduction en dinars tunisiens (ex: 5.000)</small>
              </Col>

              <Col xs={24} md={6}>
                <label className="form-label required">Quantité en stock</label>
                <CustomInput
                  type="number"
                  placeholder="0"
                  name="quantity"
                  onChng={formik.handleChange}
                  onBlr={formik.handleBlur}
                  val={formik.values.quantity}
                />
                {formik.touched.quantity && formik.errors.quantity && (
                  <div className="error-message">{formik.errors.quantity}</div>
                )}
              </Col>
            </Row>
          </Panel>
          
          {/* Section 5: Tags et Badges */}
          <Panel 
            header={
              <span className="panel-header">
                <TagOutlined /> Tags et Badges
              </span>
            } 
            key="5"
          >
            <div className="tags-section">
              <p className="section-description">
                Sélectionnez les badges qui seront affichés sur le produit
              </p>
              
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={6}>
                  <Card className={`tag-card ${isNewProduct ? 'active' : ''}`}>
                    <div className="tag-content">
                      <ThunderboltOutlined className="tag-icon new" />
                      <div>
                        <h4>Nouveau</h4>
                        <p>Produit récemment ajouté</p>
                      </div>
                      <Switch 
                        checked={isNewProduct} 
                        onChange={setIsNewProduct}
                        checkedChildren="Oui"
                        unCheckedChildren="Non"
                      />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <Card className={`tag-card ${isBestSeller ? 'active' : ''}`}>
                    <div className="tag-content">
                      <StarOutlined className="tag-icon bestseller" />
                      <div>
                        <h4>Best-Seller</h4>
                        <p>Meilleure vente</p>
                      </div>
                      <Switch 
                        checked={isBestSeller} 
                        onChange={setIsBestSeller}
                        checkedChildren="Oui"
                        unCheckedChildren="Non"
                      />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <Card className={`tag-card ${isOnSale ? 'active' : ''}`}>
                    <div className="tag-content">
                      <FireOutlined className="tag-icon sale" />
                      <div>
                        <h4>En Promotion</h4>
                        <p>Prix réduit</p>
                      </div>
                      <Switch 
                        checked={isOnSale} 
                        onChange={setIsOnSale}
                        checkedChildren="Oui"
                        unCheckedChildren="Non"
                      />
                    </div>
                  </Card>
                </Col>
                
                <Col xs={24} sm={12} md={6}>
                  <Card className={`tag-card ${isFeatured ? 'active' : ''}`}>
                    <div className="tag-content">
                      <CheckCircleOutlined className="tag-icon featured" />
                      <div>
                        <h4>En Vedette</h4>
                        <p>Produit mis en avant</p>
                      </div>
                      <Switch 
                        checked={isFeatured} 
                        onChange={setIsFeatured}
                        checkedChildren="Oui"
                        unCheckedChildren="Non"
                      />
                    </div>
                  </Card>
                </Col>
              </Row>
              
              <div className="tags-preview mt-3">
                <strong>Aperçu des badges:</strong>
                <div className="badges-list mt-2">
                  {isNewProduct && <Badge count="NOUVEAU" style={{ backgroundColor: '#52c41a' }} />}
                  {isBestSeller && <Badge count="BEST-SELLER" style={{ backgroundColor: '#faad14' }} />}
                  {isOnSale && <Badge count={`-${salePercentage}%`} style={{ backgroundColor: '#f5222d' }} />}
                  {isFeatured && <Badge count="FEATURED" style={{ backgroundColor: '#1890ff' }} />}
                  {!isNewProduct && !isBestSeller && !isOnSale && !isFeatured && (
                    <span className="text-muted">Aucun badge sélectionné</span>
                  )}
                </div>
              </div>
            </div>
          </Panel>
          
          {/* Section 6: Images */}
          <Panel 
            header={
              <span className="panel-header">
                <PictureOutlined /> Images du produit {isEdit && <span className="text-muted">(optionnel lors de la modification)</span>}
              </span>
            } 
            key="6"
          >
            <div className="upload-section">
              {isEdit && (
                <div className="alert alert-info mb-3">
                  <strong>ℹ️ Mode modification :</strong> Vous pouvez garder les images actuelles ou en uploader de nouvelles. Si vous uploadez de nouvelles images, elles remplaceront les anciennes.
                </div>
              )}
              <Dropzone 
                onDrop={(acceptedFiles) => {
                  console.log("📸 Dropzone - Fichiers acceptés:", acceptedFiles.length);
                  acceptedFiles.forEach((file, index) => {
                    console.log(`📸 Fichier ${index + 1}:`, {
                      name: file.name,
                      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
                      type: file.type
                    });
                  });
                  
                  if (acceptedFiles.length > 0) {
                    toast.info(`📸 Upload de ${acceptedFiles.length} fichier(s) en cours...`);
                    dispatch(uploadImg(acceptedFiles));
                  } else {
                    toast.warning("⚠️ Aucun fichier sélectionné");
                  }
                }}
                // Pas de restriction de type
                // Pas de limite de taille
                // Pas de limite de nombre de fichiers
                onDropRejected={(rejectedFiles) => {
                  console.error("❌ Fichiers rejetés:", rejectedFiles);
                  toast.error(`❌ ${rejectedFiles.length} fichier(s) rejeté(s)`);
                }}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div 
                    {...getRootProps()} 
                    className={`dropzone ${isDragActive ? 'active' : ''}`}
                  >
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                      <PictureOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                      <h4>
                        {isDragActive 
                          ? "Déposez les fichiers ici..." 
                          : "Glissez-déposez des fichiers ou cliquez pour sélectionner"
                        }
                      </h4>
                      <p className="text-muted">
                        Tous types de fichiers acceptés | Aucune limite de taille | Aucune limite de nombre
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>
              
              {uploadState.isLoading && (
                <div className="upload-status mt-3 text-center">
                  <div className="spinner-border text-primary me-2" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                  <span className="text-primary">Upload en cours...</span>
                </div>
              )}
              
              {imgState?.length > 0 && !uploadState.isLoading && (
                <div className="upload-status mt-3">
                  <Badge count={imgState.length} showZero>
                    <span className="status-text">✅ Image(s) uploadée(s)</span>
                  </Badge>
                </div>
              )}
              
              <div className="images-grid mt-4">
                {img.length > 0 ? (
                  img.map((image, index) => {
                    // Protection: vérifier que image.url est bien une string
                    const imageUrl = typeof image.url === 'string' ? image.url : String(image.url || '');
                    const imageId = typeof image.public_id === 'string' ? image.public_id : String(image.public_id || '');
                    
                    if (!imageUrl) {
                      console.warn("⚠️ Image sans URL à l'index", index, image);
                      return null;
                    }
                    
                    return (
                      <div className="image-item" key={index}>
                        <img 
                          src={imageUrl} 
                          alt={`Produit ${index + 1}`}
                          onError={(e) => {
                            console.error("❌ Erreur chargement image:", imageUrl);
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><text x="50%" y="50%" text-anchor="middle" fill="red">Error</text></svg>';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => dispatch(delImg(imageId))}
                          className="delete-btn"
                          title="Supprimer cette image"
                        >
                          ✕
                        </button>
                        <div className="image-number">#{index + 1}</div>
                      </div>
                    );
                  })
                ) : (
                  <div className="no-images">
                    <p className="text-muted">Aucune image uploadée</p>
                  </div>
                )}
              </div>
            </div>
          </Panel>
        </Collapse>
        
        <Divider />
        
        {/* Boutons d'action */}
        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/admin/list-product')}
            className="btn btn-cancel"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn btn-submit"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2"></span>
                {isEdit ? "Mise à jour..." : "Ajout en cours..."}
              </>
            ) : (
              <>
                <CheckCircleOutlined className="me-2" />
                {isEdit ? "Mettre à jour le produit" : "Ajouter le produit"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddproductIntelligent;
