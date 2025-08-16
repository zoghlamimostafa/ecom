import React from 'react';
import { Link } from 'react-router-dom';

const BlogCard = ({ id, title, description, date, image }) => {
  // Vérifier si l'image est définie avant d'accéder à sa propriété url
  const imageUrl = image ? image.url : '';

  // Vérifier si la description est définie avant d'utiliser substr
  const truncatedDescription = description ? `${description.substr(0, 70)}...` : '';

  return (
    <div className='blog-card'>
      <div className='card-image'>
        <img src={imageUrl} alt="image du blog" />
      </div>
      <div className='blog-content'>
        <p className='date'>{date}</p>
        <h5 className='title'>{title}</h5>
        <p className='desc' dangerouslySetInnerHTML={{ __html: truncatedDescription }}></p>
        <Link to={`/blog/${id}`} className="btn btn-primary">Lire la suite</Link>
      </div>
    </div>
  );
}

export default BlogCard;
