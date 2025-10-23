import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Dropzone from "react-dropzone";
import { delImg, uploadImg, resetUploadState } from "../features/upload/uploadSlice";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import {
  createBlogs,
  getABlog,
  resetState,
  updateABlog,
} from "../features/blogs/blogSlice";
import { getCategories } from "../features/bcategory/bcategorySlice";

let schema = yup.object().shape({
  title: yup.string().required("Title is Required"),
  description: yup.string().required("Description is Required"),
  category: yup.string().required("Category is Required"),
});
const Addblog = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const getBlogId = location.pathname.split("/")[3];
  const imgState = useSelector((state) => state.upload.images);
  const bCatState = useSelector((state) => state.bCategory.bCategories);
  const blogState = useSelector((state) => state.blogs);
  const {
    isSuccess,
    isError,
    isLoading,
    createdBlog,
    blogName,
    blogDesc,
    blogCategory,
    blogImages,
    updatedBlog,
  } = blogState;
  useEffect(() => {
    if (getBlogId !== undefined) {
      dispatch(getABlog(getBlogId));
    } else {
      dispatch(resetState());
    }
  }, [getBlogId, dispatch]);

  useEffect(() => {
    dispatch(resetState());
    dispatch(resetUploadState());
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && createdBlog) {
      toast.success("Blog créé avec succès !");
      dispatch(resetUploadState());
      navigate("/admin/blog-list");
    }
    if (isSuccess && updatedBlog) {
      toast.success("Blog mis à jour avec succès !");
      dispatch(resetUploadState());
      navigate("/admin/blog-list");
    }
    if (isError) {
      toast.error("Une erreur s'est produite !");
    }
  }, [isSuccess, isError, isLoading, createdBlog, updatedBlog, navigate, dispatch]);

  const img = [];
  imgState.forEach((i) => {
    img.push({
      public_id: i.public_id,
      url: i.url,
    });
  });
  
  // Ajouter les images existantes du blog si en mode édition
  useEffect(() => {
    if (blogImages && Array.isArray(blogImages) && blogImages.length > 0) {
      // Vérifier si les images du blog ne sont pas déjà dans imgState
      const existingUrls = imgState.map(img => img.url);
      const newImages = blogImages.filter(img => !existingUrls.includes(img.url));
      
      if (newImages.length > 0) {
        console.log("📸 Chargement des images existantes du blog:", newImages);
        // Ne pas dispatcher uploadImg, juste mettre à jour formik
      }
    }
  }, [blogImages]);

  useEffect(() => {
    formik.values.images = img.length > 0 ? img : (blogImages || []);
  }, [img, blogImages]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: blogName || "",
      description: blogDesc || "",
      category: blogCategory || "",
      images: "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      if (getBlogId !== undefined) {
        const data = { id: getBlogId, blogData: values };
        dispatch(updateABlog(data));
        dispatch(resetState());
      } else {
        dispatch(createBlogs(values));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
        }, 300);
      }
    },
  });

  return (
    <div className="admin-page-container">
      <div className="page-header mb-4">
        <h3 className="title">
          {getBlogId !== undefined ? "✏️ Modifier" : "➕ Ajouter"} un Blog
        </h3>
        <p className="subtitle text-muted">
          {getBlogId !== undefined 
            ? "Modifiez les informations de votre blog existant" 
            : "Créez un nouveau blog pour votre site"}
        </p>
      </div>

      <div className="blog-form-container">
        <form onSubmit={formik.handleSubmit}>
          {/* Titre Section */}
          <div className="form-card mb-4">
            <div className="form-card-header">
              <h5 className="mb-0">📝 Informations du Blog</h5>
            </div>
            <div className="form-card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Titre du blog</label>
                <CustomInput
                  type="text"
                  label="Entrez un titre accrocheur pour votre blog"
                  name="title"
                  onChng={formik.handleChange("title")}
                  onBlr={formik.handleBlur("title")}
                  val={formik.values.title}
                />
                <div className="error">
                  {formik.touched.title && formik.errors.title}
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Catégorie</label>
                <select
                  name="category"
                  onChange={formik.handleChange("category")}
                  onBlur={formik.handleBlur("category")}
                  value={formik.values.category}
                  className="form-control form-select py-3"
                  style={{
                    border: "1px solid #d9d9d9",
                    borderRadius: "8px",
                  }}
                >
                  <option value="">🏷️ Sélectionnez une catégorie</option>
                  {bCatState.map((i, j) => {
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
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Description</label>
                <ReactQuill
                  theme="snow"
                  className="blog-editor"
                  name="description"
                  onChange={formik.handleChange("description")}
                  value={formik.values.description}
                  placeholder="Écrivez le contenu de votre blog ici..."
                  modules={{
                    toolbar: [
                      [{ 'header': [1, 2, 3, false] }],
                      ['bold', 'italic', 'underline', 'strike'],
                      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                      [{ 'align': [] }],
                      ['link', 'image'],
                      ['clean']
                    ]
                  }}
                />
                <div className="error mt-2">
                  {formik.touched.description && formik.errors.description}
                </div>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="form-card mb-4">
            <div className="form-card-header">
              <h5 className="mb-0">🖼️ Images du Blog</h5>
            </div>
            <div className="form-card-body">
              <Dropzone
                onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
              >
                {({ getRootProps, getInputProps, isDragActive }) => (
                  <div 
                    {...getRootProps()} 
                    className={`dropzone-container ${isDragActive ? 'dropzone-active' : ''}`}
                    style={{
                      border: isDragActive ? "2px dashed #007bff" : "2px dashed #d9d9d9",
                      borderRadius: "12px",
                      padding: "40px 20px",
                      textAlign: "center",
                      backgroundColor: isDragActive ? "#f0f8ff" : "#fafafa",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    <input {...getInputProps()} />
                    <div className="dropzone-content">
                      <div className="mb-3">
                        <i className="bi bi-cloud-upload" style={{ fontSize: "48px", color: "#007bff" }}></i>
                      </div>
                      {isDragActive ? (
                        <p className="mb-2" style={{ fontSize: "18px", color: "#007bff", fontWeight: "500" }}>
                          Déposez les fichiers ici...
                        </p>
                      ) : (
                        <>
                          <p className="mb-2" style={{ fontSize: "18px", color: "#333", fontWeight: "500" }}>
                            Glissez-déposez vos images ici
                          </p>
                          <p className="mb-3" style={{ fontSize: "14px", color: "#888" }}>
                            ou cliquez pour parcourir vos fichiers
                          </p>
                        </>
                      )}
                      <p className="mb-0" style={{ fontSize: "12px", color: "#aaa" }}>
                        📎 Formats acceptés : JPG, PNG, GIF, WebP (Max 5MB par fichier)
                      </p>
                    </div>
                  </div>
                )}
              </Dropzone>

              {/* Image Preview */}
              {imgState && imgState.length > 0 && (
                <div className="mt-4">
                  <h6 className="mb-3 fw-bold">Images sélectionnées ({imgState.length})</h6>
                  <div className="row g-3">
                    {imgState.map((i, j) => {
                      return (
                        <div className="col-md-3 col-sm-4 col-6" key={j}>
                          <div className="image-preview-card">
                            <button
                              type="button"
                              onClick={() => dispatch(delImg(i.public_id))}
                              className="btn-close btn-close-white image-delete-btn"
                              aria-label="Supprimer"
                            ></button>
                            <img 
                              src={i.url} 
                              alt={`Preview ${j + 1}`} 
                              className="img-fluid"
                              style={{
                                width: "100%",
                                height: "180px",
                                objectFit: "cover",
                                borderRadius: "8px",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="d-flex gap-3 justify-content-end">
            <button
              type="button"
              className="btn btn-secondary px-4 py-2"
              onClick={() => window.history.back()}
              style={{
                borderRadius: "8px",
                fontSize: "16px",
              }}
            >
              ❌ Annuler
            </button>
            <button
              className="btn btn-primary px-5 py-2"
              type="submit"
              disabled={isLoading}
              style={{
                backgroundColor: "#007bff",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: "500",
              }}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enregistrement...
                </>
              ) : (
                <>
                  {getBlogId !== undefined ? "💾 Mettre à jour" : "➕ Créer"} le blog
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .admin-page-container {
          padding: 20px;
        }
        
        .page-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 30px;
          border-radius: 12px;
          color: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .page-header .title {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
        }
        
        .page-header .subtitle {
          color: rgba(255, 255, 255, 0.9);
          margin: 8px 0 0 0;
        }
        
        .blog-form-container {
          max-width: 1200px;
        }
        
        .form-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        
        .form-card-header {
          background: #f8f9fa;
          padding: 20px;
          border-bottom: 2px solid #e9ecef;
        }
        
        .form-card-header h5 {
          color: #333;
          font-weight: 600;
        }
        
        .form-card-body {
          padding: 30px;
        }
        
        .form-label {
          color: #495057;
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .image-preview-card {
          position: relative;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s;
        }
        
        .image-preview-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .image-delete-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(220, 53, 69, 0.9) !important;
          border-radius: 50%;
          padding: 8px;
          z-index: 10;
        }
        
        .image-delete-btn:hover {
          background: rgba(220, 53, 69, 1) !important;
        }
        
        .blog-editor {
          border-radius: 8px;
          overflow: hidden;
        }
        
        .blog-editor .ql-container {
          min-height: 300px;
          font-size: 15px;
        }
        
        .error {
          color: #dc3545;
          font-size: 13px;
          margin-top: 5px;
        }
        
        @media (max-width: 768px) {
          .page-header {
            padding: 20px;
          }
          
          .page-header .title {
            font-size: 22px;
          }
          
          .form-card-body {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
};

export default Addblog;