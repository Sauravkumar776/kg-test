import * as PropTypes from 'prop-types';
import './PropertyHeader.scss';
import { Link } from 'react-router-dom';

const PropertyHeader = ({ property }) => {
  return (
    <div className="property-header">
      <h1 className="property-header-title">{property.name}</h1>
      <div className="property-header-subtext">
        <div>
          {property.city}, {property.territory}, {property.country}
        </div>
        <div style={{ flexGrow: 1 }} />
        <div>
          <Link to="/">
            <i className="fas fa-chevron-left" /> Back to search
          </Link>
        </div>
      </div>
      <div className="property-header-image-section">
        <img src={property.imageSrc} alt={property.imageAltText} />
      </div>
    </div>
  );
};

PropertyHeader.propTypes = {
  property: PropTypes.object,
};

export default PropertyHeader;
