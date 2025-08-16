import React, { useEffect, useState } from 'react';
import BrandCrumb from '../components/BrandCrumb';
import Meta from '../components/Meta';
import BlogCard from '../components/BlogCard';
import Container from '../components/Container';
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "../features/blogs/blogSlice";
import moment from "moment";

const Blogs = () => {
  const dispatch = useDispatch();
  const blogState = useSelector((state) => state.blog.blog);
  const [error, setError] = useState(null); // État pour gérer les erreurs

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        await dispatch(getAllBlogs()).unwrap(); // `unwrap` permet d'attraper les erreurs de Redux
        setError(null); // Si la requête réussit, on réinitialise les erreurs
      } catch (err) {
        setError("Une erreur s'est produite lors de la récupération des blogs.");
      }
    };

    fetchBlogs(); // Appeler la fonction au montage
  }, [dispatch]); // Dépendance uniquement sur `dispatch` pour éviter la boucle infinie

  return (
    <>
      <Meta title={"Blogs"} />
      <BrandCrumb title="Blogs" />
      <Container class1="blog-wrapper home-wrapper-2 py-5">
        {error && <div className="alert alert-danger">{error}</div>}  {/* Affiche un message d'erreur si nécessaire */}
        <div className="row">
          <div className="col-9">
            <div className="row">
              {blogState?.length > 0 ? (
                blogState.map((item) => (
                  <div className="col-6 mb-3" key={item._id}>
                    <BlogCard
                      id={item.slug || item._id} // Use slug if available, fallback to ID
                      title={item.title}
                      description={item.description}
                      image={item.images?.length > 0 ? item.images[0].url : null} // Vérifie si l'image existe
                      date={moment(item.createdAt).format('MMMM Do YYYY, h:mm a')}
                    />
                  </div>
                ))
              ) : (
                <p className="text-center">Aucun blog disponible.</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default Blogs;
