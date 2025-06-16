import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './PropertyGrid.scss';
import { ApiUtil } from '../../lib/apiUtil';
import { getPropertiesForPage } from '../../lib/paginationUtil';
import Pagination from '../Pagination/Pagination';

const PropertyGrid = () => {
  const [properties, setProperties] = useState(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    ApiUtil.getProperties().then((data) => setProperties(data));
  }, []);

  if (!properties || properties.length === 0) {
    return (
      <div className="property-grid">
        <div className="no-results">No Properties Found</div>
      </div>
    );
  }

  const paginatedProperties = getPropertiesForPage(properties, page);

  return (
    <div className="property-grid">
      <ul className="property-flex-wrapper">
        {paginatedProperties.map((property, index) => {
          const { id, name, city, territory, rate, stars, imageAltText, imageSrc } = property;

          return (
            <li key={`property-card-${index}`}>
              <Link to={`/property/${id}`} className="property-card">
                <img src={imageSrc} alt={imageAltText} className="property-card-image" />
                <div className="property-card-content">
                  <div className="property-card-title">{name}</div>
                  <span>
                    {city}, {territory}
                  </span>
                  <div className="property-card-footer">
                    <div className="property-card-star-container">
                      <div className="property-card-star-icon">
                        <i className="fas fa-star" />
                      </div>
                      {stars}
                    </div>
                    <span>
                      <strong>${rate}</strong>
                      {'/night'}
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <Pagination page={page} setPage={setPage} propertyCount={properties.length} />
    </div>
  );
};

PropertyGrid.propTypes = {
  page: PropTypes.number,
};

export default PropertyGrid;
