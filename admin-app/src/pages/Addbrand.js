import { React, useEffect } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import Dropzone from "react-dropzone";
import {
  createBrand,
  getABrand,
  resetState,
  updateABrand,
} from "../features/brand/brandSlice";
import { delImg, uploadImg, resetUploadState } from "../features/upload/uploadSlice";

let schema = yup.object().shape({
  title: yup.string().required("Brand Name is Required"),
});
const Addbrand = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getBrandId = location.pathname.split("/")[3];
  const newBrand = useSelector((state) => state.brand);
  const imgState = useSelector((state) => state.upload.images);
  const {
    isSuccess,
    isError,
    isLoading,
    createdBrand,
    brandName,
    brandImage,
    updatedBrand,
  } = newBrand;
  useEffect(() => {
    if (getBrandId !== undefined) {
      dispatch(getABrand(getBrandId));
    } else {
      dispatch(resetState());
    }
  }, [getBrandId, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(resetUploadState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (isSuccess && createdBrand) {
      toast.success("Brand Added Successfullly!");
    }
    if (isSuccess && updatedBrand) {
      toast.success("Brand Updated Successfullly!");
      navigate("/admin/list-brand");
    }

    if (isError) {
      toast.error("Something Went Wrong!");
    }
  }, [isSuccess, isError, isLoading]);
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: brandName || "",
      image: brandImage || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      const brandData = {
        title: values.title,
        image: imgState.length > 0 ? imgState[0].url : values.image
      };
      
      if (getBrandId !== undefined) {
        const data = { id: getBrandId, brandData };
        dispatch(updateABrand(data));
        dispatch(resetState());
      } else {
        dispatch(createBrand(brandData));
        formik.resetForm();
        setTimeout(() => {
          dispatch(resetState());
          dispatch(resetUploadState());
        }, 300);
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getBrandId !== undefined ? "Modifier" : "Ajouter"} Marque
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="title"
            onChng={formik.handleChange("title")}
            onBlr={formik.handleBlur("title")}
            val={formik.values.title}
            label="Entrez la marque"
            id="brand"
          />
          <div className="error">
            {formik.touched.title && formik.errors.title}
          </div>

          <div className="bg-white border-1 p-4 text-center mt-3 mb-3">
            <h6 className="mb-3">🖼️ Image de la marque</h6>
            <Dropzone
              onDrop={(acceptedFiles) => dispatch(uploadImg(acceptedFiles))}
            >
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div {...getRootProps()} className="dropzone p-4 border border-dashed">
                    <input {...getInputProps()} />
                    <p className="mb-0">
                      Glissez-déposez une image ici ou cliquez pour sélectionner
                    </p>
                  </div>
                </section>
              )}
            </Dropzone>
            {(imgState.length > 0 || formik.values.image) && (
              <div className="mt-3">
                <img
                  src={imgState.length > 0 ? imgState[0].url : formik.values.image}
                  alt="brand"
                  style={{ maxWidth: "200px", maxHeight: "200px", objectFit: "contain" }}
                />
                {imgState.length > 0 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2"
                    onClick={() => dispatch(delImg(imgState[0].public_id))}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit" style={{backgroundColor:"#212529"}}
          >
            {getBrandId !== undefined ? "Modifier" : "Ajouter"} marque
          </button>
        </form>
      </div>
    </div>
  );
};

export default Addbrand;