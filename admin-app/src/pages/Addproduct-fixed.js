import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import DebugProductForm from "../components/DebugProductForm";
import FormikTest from "../components/FormikTest";
import ReactQuill from "react-quill";
import { useNavigate, useParams } from "react-router-dom";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { getBrands } from "../features/brand/brandSlice";
import { getCategories } from "../features/pcategory/pcategorySlice";
import { getColors } from "../features/color/colorSlice";
import { Select } from "antd";
import Dropzone from "react-dropzone";
import { delImg, uploadImg } from "../features/upload/uploadSlice";
import { createProducts, getProduct, updateProduct, resetState } from "../features/product/productSlice";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  price: yup.number().required("Price is Required"),
  brand: yup.string().required("Brand is Required"),
  category: yup.string().required("Category is Required"),
  tags: yup.string().required("Tag is Required"),
  color: yup.array(), // Accepter un tableau vide comme valeur pour la couleur
  quantity: yup.number().required("Quantity is Required"),
});

const Addproduct = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [color, setColor] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const isEdit = !!id;
  
  console.log(color);
  
  useEffect(() => {
    dispatch(getBrands());
    dispatch(getCategories());
    dispatch(getColors());
    
    if (isEdit && id) {
      dispatch(getProduct(id));
    }
  }, [dispatch, isEdit, id]);

  const brandState = useSelector((state) => state.brand.brands);
  const catState = useSelector((state) => state.pCategory.pCategories);
  const colorState = useSelector((state) => state.color.colors);
  const imgState = useSelector((state) => state.upload.images);
  const newProduct = useSelector((state) => state.product);
  const { isSuccess, isError, isLoading, createdProduct, product: productData } = newProduct;
  
  // Debug des images
  console.log("🖼️ Images state:", imgState);
  console.log("📷 Images array length:", imgState?.length || 0);
  
  useEffect(() => {
    if (isSuccess && createdProduct && !isEdit) {
      toast.success("Product Added Successfully!");
    }
    if (isSuccess && isEdit && isUpdating) {
      toast.success("Product Updated Successfully!");
      setTimeout(() => {
        dispatch(resetState());
        navigate('/admin/list-product');
        setIsUpdating(false);
      }, 1500); // Give user time to see the success message
    }
    if (isError) {
      console.error("❌ Product operation error:", newProduct.message);
      const errorMessage = newProduct.message || "Something Went Wrong!";
      toast.error(`Erreur: ${errorMessage}`);
      setIsUpdating(false);
    }
  }, [isSuccess, isError, isLoading, createdProduct, isEdit, navigate, isUpdating, dispatch, newProduct.message]);
  
  const colorOptions = colorState.map((color) => ({
    label: color.title,
    value: color.id,
  }));
  
  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: productData?.title || "",
      description: productData?.description || "",
      price: productData?.price || "",
      brand: productData?.brand || "",
      category: productData?.category || "",
      tags: productData?.tags || "",
      color: productData?.color || "",
      quantity: productData?.quantity || "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      console.log("🚀 Form submission values:", values);
      
      const productPayload = {
        title: values.title,
        description: values.description,
        price: Number(values.price),
        brand: values.brand,
        category: values.category,
        tags: values.tags,
        color: color,
        quantity: Number(values.quantity),
        images: img,
      };
      
      console.log("📦 Product payload:", productPayload);
      
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
    formik.setFieldValue("color", value);
  };

  useEffect(() => {
    if (isEdit && productData && productData.color) {
      const colors = Array.isArray(productData.color) 
        ? productData.color 
        : JSON.parse(productData.color || '[]');
      setColor(colors);
    }
  }, [isEdit, productData]);

  return (
    <div>
      <h3 className="mb-4">{isEdit ? "Edit Product" : "Add Product"}</h3>
      
      {/* Debug Components */}
      <DebugProductForm 
        formikValues={formik.values}
        colorState={color}
        imgState={imgState}
        productData={productData}
        isEdit={isEdit}
      />
      
      <div>
        <form action="" onSubmit={formik.handleSubmit} className="d-flex gap-3 flex-column">
          <CustomInput
            type="text"
            label="Enter Product Title"
            name="title"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.title}
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>
          
          <div className="">
            <ReactQuill
              theme="snow"
              name="description"
              onChange={(value) => formik.setFieldValue("description", value)}
              value={formik.values.description}
            />
          </div>
          <div className="error">
            {formik.touched.description && formik.errors.description}
          </div>
          
          <CustomInput
            type="number"
            label="Enter Product Price"
            name="price"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.price}
          />
          <div className="error">
            {formik.touched.price && formik.errors.price}
          </div>
          
          <select
            name="brand"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.brand}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Brand</option>
            {brandState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.brand && formik.errors.brand}
          </div>
          
          <select
            name="category"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.category}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="">Select Category</option>
            {catState.map((i, j) => {
              return (
                <option key={j} value={i.title}>
                  {i.title}
                </option>
              );
            })}
          </select>
          <div className="error">
            {formik.touched.category && formik.errors.category}
          </div>
          
          <select
            name="tags"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.tags}
            className="form-control py-3 mb-3"
            id=""
          >
            <option value="" disabled>
              Select Category
            </option>
            <option value="featured">En vedette</option>
            <option value="popular">Populaire</option>
            <option value="special">Spéciale</option>
            <option value="info">Informatique</option>
            <option value="electro">Electroménager&& Cuisine</option>
            <option value="tele">Téléphone & Tablette</option>
            <option value="supermarcher">supermarcher</option>
            <option value="Homme">Homme</option>
            <option value="femme">Femme</option>
            <option value="baby">Bébé</option>
            <option value="animaux">Animaux</option>
            <option value="maison">Maison et Bureau</option>
            <option value="jardin">Quincaillerie & Jardin</option>
            <option value="sport">Sport et Fitness</option>
            <option value="auto">Automobile</option>
            <option value="sante">Santè & Beauté</option>
            <option value="jeux">Jeux vidéos & Consoles</option>
            <option value="other">Other</option>
          </select>
          <div className="error">
            {formik.touched.tags && formik.errors.tags}
          </div>

          <Select
            mode="multiple"
            allowClear
            className="w-100"
            placeholder="Select colors"
            value={color}
            onChange={handleColorChange}
            options={colorOptions}
          />
          <div className="error">
            {formik.touched.color && formik.errors.color}
          </div>
          
          <CustomInput
            type="number"
            label="Enter Product Quantity"
            name="quantity"
            onChng={formik.handleChange}
            onBlr={formik.handleBlur}
            val={formik.values.quantity}
          />
          <div className="error">
            {formik.touched.quantity && formik.errors.quantity}
          </div>
          
          <div className="bg-white border-1 p-5 text-center">
            <div className="upload-section">
              <h5>📸 Upload de Fichiers</h5>
              <Dropzone 
                onDrop={(acceptedFiles) => {
                  console.log("📸 Files dropped:", acceptedFiles.length);
                  if (acceptedFiles.length > 0) {
                    dispatch(uploadImg(acceptedFiles));
                  }
                }}
                // Pas de restriction
              >
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="dropzone p-4 border border-dashed">
                    <input {...getInputProps()} />
                    <div className="text-center">
                      <p className="mb-2">Glissez-déposez des fichiers ici, ou cliquez pour sélectionner</p>
                      <small className="text-muted">
                        Tous types de fichiers acceptés | Aucune limite
                      </small>
                    </div>
                  </div>
                )}
              </Dropzone>
              {imgState?.length > 0 && (
                <div className="mt-3">
                  <small className="text-success">✅ {imgState.length} image(s) uploadée(s)</small>
                </div>
              )}
            </div>
          </div>
          
          <div className="showimages d-flex flex-wrap gap-3">
            {img.length > 0 ? (
              img.map((image, index) => (
                <div className="position-relative" key={index}>
                  <button
                    type="button"
                    onClick={() => dispatch(delImg(image.public_id))}
                    className="btn-close position-absolute"
                    style={{ top: "10px", right: "10px" }}
                  ></button>
                  <img src={image.url} alt="" width={200} height={200} />
                </div>
              ))
            ) : (
              <div className="text-muted">
                <small>Aucune image pour le moment</small>
              </div>
            )}
          </div>
          
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit"
          >
            {isEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addproduct;