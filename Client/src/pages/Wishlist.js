import React, { useEffect } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import Container from '../components/Container';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProductWishlist, toggleProductWishlist, addProdToCart } from '../features/user/userSlice'; // Actions pour la wishlist

const Wishlist = () => {
    const dispatch = useDispatch();
    const authState = useSelector(state => state?.auth?.auth); // Get authentication state

    useEffect(() => {
        // Only fetch wishlist if user is authenticated
        if (authState) {
            dispatch(getUserProductWishlist());
        }
    }, [dispatch, authState]);

    // Accéder à la wishlist du state
    const wishlistState = useSelector((state) => state.auth.wishlist);
    
    // Vérifier si wishlistState est un tableau
    const isWishlistArray = Array.isArray(wishlistState);

    const removeFromWishlist = (id) => {
        // Supprimer le produit de la wishlist en utilisant l'action Redux
        dispatch(toggleProductWishlist(id));
    };

    const addToCartFromWishlist = (item) => {
        // Ajouter le produit au panier avec les données requises
        const cartData = {
            productId: item._id,
            quantity: 1,
            color: item.color || null, // Si une couleur est disponible
            price: item.price
        };
        dispatch(addProdToCart(cartData));
    };

    return (
        <>
            <Meta title="Liste de souhaits" />
            <BrandCrumb title="Liste de souhaits" />
            <Container class1="wishlist-wrapper home-wrapper-2 py-5">
                <div className="row">
                    {/* Si wishlistState est vide ou non défini, afficher un message */}
                    {!isWishlistArray || wishlistState.length === 0 ? (
                        <div className="text-center fs-3">Pas de données</div>
                    ) : (
                        wishlistState.map((item, index) => (
                            <div className="col-3" key={index}>
                                <div className="wishlist-card position-relative">
                                    <img
                                        onClick={() => removeFromWishlist(item._id)} // Appeler la suppression
                                        src="images/cross.svg"
                                        alt="cross"
                                        className="position-absolute cross img-fluid"
                                    />
                                    <div className="wishlist-card-image bg-white">
                                        <img
                                            src={item?.images && item.images.length > 0 ? item.images[0]?.url : "images/watch.jpg"}
                                            className="img-fluid d-block mx-auto"
                                            alt=""
                                            width={160}
                                        />
                                    </div>
                                    <div className="py-3 px-3">
                                        <h5 className="title">{item?.title}</h5>
                                        <h6 className="price">{item?.price} TND</h6>
                                        <div className="d-flex justify-content-between mt-2">
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => addToCartFromWishlist(item)}
                                            >
                                                Ajouter au panier
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Container>
        </>
    );
};

export default Wishlist;
