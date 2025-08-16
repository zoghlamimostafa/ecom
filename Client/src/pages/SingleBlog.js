import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiOutlineArrowSmLeft } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { getABlog } from '../features/blogs/blogSlice';
import Meta from '../components/Meta';
import BrandCrumb from '../components/BrandCrumb';
import Container from '../components/Container';

const SingleBlog = () => {
  const blogState = useSelector((state) => state.blog.singleBlog);
  const isLoading = useSelector((state) => state.blog.isLoading);
  const isError = useSelector((state) => state.blog.isError);
  const location = useLocation();
  const getBlogSlug = location.pathname.split('/')[2]; // This now gets the slug instead of ID
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getABlog(getBlogSlug));
  }, [dispatch, getBlogSlug]);

  return (
    <>
      <Meta title={blogState?.title} />
      <BrandCrumb title={blogState?.title} />
      <Container class1='blog-wrapper home-wrapper-2 py-5'>
        <div className='row'>
          <div className='col-12'>
            <div className='single-blog-card'>
              <Link to="/blogs" className='d-flex align-items-center gap-10'>
                <HiOutlineArrowSmLeft className='fs-4'/> Back to Blogs
              </Link>
              
              {isLoading && (
                <div className="text-center py-5">
                  <p>Loading blog...</p>
                </div>
              )}
              
              {isError && (
                <div className="text-center py-5">
                  <p className="text-danger">Error loading blog. Please try again.</p>
                </div>
              )}
              
              {!isLoading && !isError && blogState && (
                <>
                  <h3 className='title'>{blogState?.title}</h3>
                  <img 
                    src={blogState?.images && blogState?.images[0] ? blogState.images[0].url : "images/watch.jpg"} 
                    className='img-fluid w-100 my-4' 
                    alt="blog"
                  />
                  <p dangerouslySetInnerHTML={{ __html: blogState?.description }}></p>
                </>
              )}
              
              {!isLoading && !isError && !blogState && (
                <div className="text-center py-5">
                  <p>Blog not found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

export default SingleBlog;
