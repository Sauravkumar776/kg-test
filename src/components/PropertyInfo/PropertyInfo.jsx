import './PropertyInfo.scss';

const PropertyInfo = () => {
  return (
    <div className="property-info">
      <ul className="property-info-item-list">
        <li className="property-info-item">
          <div className="property-info-item-icon">
            <i className="fas fa-home" />
          </div>
          <div className="property-info-item-content">
            <div className="property-info-item-title">Entire Home</div>
            <div className="property-info-item-details">
              You’ll have the entire unit to yourself.
            </div>
          </div>
        </li>
        <li className="property-info-item">
          <div className="property-info-item-icon">
            <i className="fas fa-hand-sparkles" />
          </div>
          <div className="property-info-item-content">
            <div className="property-info-item-title">Enhanced Clean</div>
            <div className="property-info-item-details">
              This host committed to the 5-step enhanced cleaning process.
            </div>
          </div>
        </li>
        <li className="property-info-item">
          <div className="property-info-item-icon">
            <i className="fas fa-tag" />
          </div>
          <div className="property-info-item-content">
            <div className="property-info-item-title">Pool</div>
            <div className="property-info-item-details">
              Guests often search for this popular amenity
            </div>
          </div>
        </li>
        <li className="property-info-item">
          <div className="property-info-item-icon">
            <i className="fas fa-calendar" />
          </div>
          <div className="property-info-item-content">
            <div className="property-info-item-title">Free cancellation for 48 hours</div>
            <div className="property-info-item-details">
              After that, cancel before 3:00 PM and get a 50% refund, minus the service fee.{' '}
            </div>
          </div>
        </li>
        <li className="property-info-item">
          <div className="property-info-item-icon">
            <i className="fas fa-book" />
          </div>
          <div className="property-info-item-content">
            <div className="property-info-item-title">House rules</div>
            <div className="property-info-item-details">
              The host doesn’t allow pets, parties, or smoking.
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

PropertyInfo.propTypes = {};

export default PropertyInfo;
