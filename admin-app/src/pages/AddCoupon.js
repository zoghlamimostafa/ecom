import { React, useEffect, useState } from "react";
import CustomInput from "../components/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import { Select } from "antd";
import {
  createCoupon,
  getACoupon,
  resetState,
  updateACoupon,
} from "../features/coupon/couponSlice";
import { getProducts } from "../features/product/productSlice";

const { Option } = Select;

let schema = yup.object().shape({
  name: yup.string().required("Coupon Name is Required"),
  expiry: yup.date().required("Expiry Date is Required"),
  discount: yup.number().required("Discount Percentage is Required"),
});
const AddCoupon = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const getCouponId = location.pathname.split("/")[3];
  const newCoupon = useSelector((state) => state.coupon);
  const productState = useSelector((state) => state.product.products);
  const [selectedProducts, setSelectedProducts] = useState([]);

  const {
    isSuccess,
    isError,
    isLoading,
    createdCoupon,
    couponName,
    couponDiscount,
    couponExpiry,
    updatedCoupon,
  } = newCoupon;
  const changeDateFormet = (date) => {
    const newDate = new Date(date).toLocaleDateString();
    const [month, day, year] = newDate.split("/");
    return [year, month, day].join("-");
  };

  useEffect(() => {
    dispatch(getProducts());
    if (getCouponId !== undefined) {
      dispatch(getACoupon(getCouponId));
    } else {
      dispatch(resetState());
    }
  }, [getCouponId, dispatch]);

  useEffect(() => {
    if (isSuccess && createdCoupon) {
      toast.success("Coupon ajouté avec succès!");
      setTimeout(() => {
        dispatch(resetState());
        navigate("/admin/coupon-list");
      }, 500);
    }
    if (isSuccess && updatedCoupon) {
      toast.success("Coupon mis à jour avec succès!");
      setTimeout(() => {
        dispatch(resetState());
        navigate("/admin/coupon-list");
      }, 500);
    }
    if (isError) {
      toast.error("Erreur lors de l'opération!");
    }
  }, [isSuccess, isError, createdCoupon, updatedCoupon, navigate, dispatch]);
  
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: couponName || "",
      expiry: changeDateFormet(couponExpiry) || "",
      discount: couponDiscount || "",
    },
    validationSchema: schema,
    onSubmit: (values) => {
      // Ajouter les produits sélectionnés aux données
      const couponData = {
        ...values,
        applicableProducts: selectedProducts.length > 0 ? selectedProducts : null
      };
      
      console.log('📤 Soumission du coupon:', couponData);
      
      if (getCouponId !== undefined) {
        const data = { id: getCouponId, couponData };
        dispatch(updateACoupon(data));
      } else {
        dispatch(createCoupon(couponData));
      }
    },
  });

  return (
    <div>
      <h3 className="mb-4 title">
        {getCouponId !== undefined ? "Modifier" : "Ajouter"} Coupon
      </h3>
      <div>
        <form action="" onSubmit={formik.handleSubmit}>
          <CustomInput
            type="text"
            name="name"
            onChng={formik.handleChange("name")}
            onBlr={formik.handleBlur("name")}
            val={formik.values.name}
            label="Entrez le nom du coupon"
            id="name"
          />
          <div className="error">
            {formik.touched.name && formik.errors.name}
          </div>
          <CustomInput
            type="date"
            name="expiry"
            onChng={formik.handleChange("expiry")}
            onBlr={formik.handleBlur("expiry")}
            val={formik.values.expiry}
            label="Saisir les données d'expiration"
            id="date"
          />
          <div className="error">
            {formik.touched.expiry && formik.errors.expiry}
          </div>
          <CustomInput
            type="number"
            name="discount"
            onChng={formik.handleChange("discount")}
            onBlr={formik.handleBlur("discount")}
            val={formik.values.discount}
            label="Entrez le pourcentage de réduction"
            id="discount"
          />
          <div className="error">
            {formik.touched.discount && formik.errors.discount}
          </div>
          
          <div className="mt-3 mb-3">
            <label htmlFor="products" className="form-label">
              Produits applicables (Optionnel - laissez vide pour un coupon global)
            </label>
            <Select
              mode="multiple"
              allowClear
              style={{ width: '100%' }}
              placeholder="Sélectionnez les produits (optionnel)"
              value={selectedProducts}
              onChange={setSelectedProducts}
              showSearch
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {productState && productState.map((product) => (
                <Option key={product.id} value={product.id}>
                  {product.title}
                </Option>
              ))}
            </Select>
            <small className="text-muted d-block mt-2">
              {selectedProducts.length > 0 
                ? `${selectedProducts.length} produit(s) sélectionné(s)` 
                : 'Aucun produit sélectionné - Le coupon sera applicable à tous les produits'}
            </small>
          </div>
          
          <button
            className="btn btn-success border-0 rounded-3 my-5"
            type="submit" style={{backgroundColor:"#212529"}}
          >
            {getCouponId !== undefined ? "Modifier" : "Ajouter"} Coupon
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddCoupon;