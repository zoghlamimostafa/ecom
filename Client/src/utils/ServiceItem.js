import React from 'react';

const ServiceItem = ({ title, tagline, icon, link }) => {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="service-item">
        <div className="service-icon">
          <a href={link} className="service-link">
            {icon}
          </a>
        </div>
        <div className="service-content">
          <h6 className="service-title">{title}</h6>
          <p className="service-tagline">{tagline}</p>
        </div>
      </div>
    </div>
  );
};

export default ServiceItem;
