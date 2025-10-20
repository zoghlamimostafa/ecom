import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAllProducts } from '../features/products/productSlice';
import ProductCard from '../components/ProductCard';
import Container from '../components/Container';
import Meta from '../components/Meta';

const CategoryProducts = () => {
    const { categoryId } = useParams();
    const dispatch = useDispatch();
    const productState = useSelector(state => state.product.product);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        if (!productState || productState.length === 0) {
            dispatch(getAllProducts());
        }
    }, [dispatch, productState]);

    useEffect(() => {
        if (productState && categoryId) {
            // Convertir categoryId en nombre et en string pour comparaison
            const categoryIdNum = parseInt(categoryId);
            const categoryIdStr = categoryId.toString();
            
            const filtered = productState.filter(product => {
                // Convertir product.category en string pour comparaison fiable
                const productCategory = product.category ? product.category.toString() : '';
                const productSubcategory = product.subcategory ? product.subcategory.toString() : '';
                
                // Filtrer par catégorie principale OU sous-catégorie
                return productCategory === categoryIdStr || 
                       productSubcategory === categoryIdStr ||
                       productCategory === categoryIdNum.toString();
            });
            
            console.log('🔍 Filtrage catégorie:', categoryId);
            console.log('📦 Produits trouvés:', filtered.length);
            
            setFilteredProducts(filtered);
        }
    }, [productState, categoryId]);

    return (
        <>
            <Meta title={`Catégorie - Produits`} />
            <Container class1="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-12">
                        <h3 className="mb-4">Produits de la catégorie</h3>
                    </div>
                </div>
                <div className="row">
                    {filteredProducts && filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <div key={product.id || index} className="col-6 col-md-4 col-lg-3 mb-4">
                                <ProductCard data={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p className="text-center">Aucun produit trouvé dans cette catégorie</p>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default CategoryProducts;
