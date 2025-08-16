import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/user/userSlice'
import productReducer from '../features/products/productSlice'
import blogReducer from '../features/blogs/blogSlice'
import orders from '../features/user/ordersSlice'
import contactReducer from '../features/contact/contactSlice'
import categoryReducer from '../features/category/categorySlice'
export const store = configureStore({
  reducer: {
    auth:authReducer,
    product:productReducer,
    blog:blogReducer,
    contact:contactReducer,
    orders:orders,
    category:categoryReducer,
  },
});
