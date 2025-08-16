import React from 'react';
import ReactStars from "react-rating-stars-component";
import { Link } from 'react-router-dom';

const SpecialProduct = (props) => {
  const { title, brand, totalrating, price, sold, quantity, id } = props;

  return (
    
    <div className='special-product col-6 mb-3'>
      <div className='special-product-card'>
        <div className='d-flex justify-content-between'>
          <div className='product-image'>
            <img src="images/watch.jpg" className="img-fluid" alt="watch" />
          </div>
          <div className='special-product-content'>
            <h5 className='brand'>{brand}</h5>
            <h6 className='title'>{title}</h6>
            <ReactStars
              count={5}
              size={24}
              value={totalrating}
              edit={false}
              activeColor="#ffd700"
            />
            <p className='price'>
              <span className='red-p'>{price}TND</span>&nbsp;<strike>200TND</strike>
            </p>
            <div className='discount-till'>
              <p><b>5 days</b></p>
              <div className='timer'>
                <span className='badge rounded-circle bg-danger'>1</span>:
                <span className='badge rounded-circle bg-danger'>1</span>:
                <span className='badge rounded-circle bg-danger'>1</span>
              </div>
            </div>
            <div className='prod-count my-3'>
              <p>Product: {quantity}</p>
              <div className="progress">
                <div className="progress-bar" role="progressbar" style={{ width: (quantity / (quantity + sold)) * 100 + "%" }} aria-valuenow={quantity / (quantity + sold) * 100} aria-valuemin={quantity} aria-valuemax={quantity + sold}></div>
              </div>
            </div>
            <Link className='button' to={`/product/${id}`}>view</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SpecialProduct;
