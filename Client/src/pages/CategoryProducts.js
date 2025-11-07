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
    const [minRating, setMinRating] = useState(0); // Ajout du filtre de note

    useEffect(() => {
        // Toujours charger les produits quand on arrive sur la page
        dispatch(getAllProducts());
    }, [dispatch]);

    useEffect(() => {
        if (productState && categoryId) {
            // Convertir categoryId en nombre et en string pour comparaison
            const categoryIdNum = parseInt(categoryId);
            const categoryIdStr = categoryId.toString();
            
            const filtered = productState.filter(product => {
                // Convertir product.category en string pour comparaison fiable
                const productCategory = product.category ? product.category.toString() : '';
                const productSubcategory = product.subcategory ? product.subcategory.toString() : '';
                const matches = productCategory === categoryIdStr || 
                               productSubcategory === categoryIdStr ||
                               productCategory === categoryIdNum.toString();
                // Filtrer aussi par note minimale si précisée
                const rating = Number(product.totalRating) || 0;
                return matches && rating >= minRating;
            });
            setFilteredProducts(filtered);
        }
    }, [productState, categoryId, minRating]);

    return (
        <>
            <Meta title={`Catégorie - Produits`} />
            <Container class1="store-wrapper home-wrapper-2 py-5">
                <div className="row">
                    <div className="col-12">
                        <h3 className="mb-4">Produits de la catégorie</h3>
                        {/* Filtre par note (étoiles) */}
                        <div style={{ marginBottom: 20 }}>
                            <label htmlFor="minRating">Note minimale : </label>
                            <select
                                id="minRating"
                                value={minRating}
                                onChange={e => setMinRating(Number(e.target.value))}
                                style={{ marginLeft: 8 }}
                            >
                                <option value={0}>Toutes</option>
                                <option value={5}>5 étoiles</option>
                                <option value={4}>4 étoiles et +</option>
                                <option value={3}>3 étoiles et +</option>
                                <option value={2}>2 étoiles et +</option>
                                <option value={1}>1 étoile et +</option>
                            </select>
                        </div>
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
