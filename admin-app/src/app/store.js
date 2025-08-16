import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import enquiryReducer from "../features/enquiry/enquirySlice";
import blogReducer from "../features/blogs/blogSlice";
import productReducer from "../features/product/productSlice";
import colorReducer from "../features/color/colorSlice";
import pCategoryReducer from "../features/pcategory/pcategorySlice";
import brandReducer from "../features/brand/brandSlice";
import uploadReducer from "../features/upload/uploadSlice";
import customerReducer from "../features/cutomers/customerSlice";
import couponReducer from "../features/coupon/couponSlice";
import bCategoryReducer from "../features/bcategory/bcategorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    enquiry: enquiryReducer,
    blogs: blogReducer,
    product: productReducer,
    color: colorReducer,
    pCategory: pCategoryReducer,
    brand: brandReducer,
    upload: uploadReducer,
    customer: customerReducer,
    coupon: couponReducer,
    bCategory: bCategoryReducer,

  },
});