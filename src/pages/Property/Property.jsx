import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import BookingForm from '../../components/BookingForm/BookingForm';
import PropertyInfo from '../../components/PropertyInfo/PropertyInfo';
import PropertyHeader from '../../components/PropertyHeader/PropertyHeader';
import './Property.scss';
import { ApiUtil } from '../../lib/apiUtil';

const Property = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState();

  useEffect(() => {
    ApiUtil.getPropertyById(propertyId).then((data) => {
      setProperty(data);
    });
  }, [propertyId]);

  return (
    <div className="property-page">
      {!!property && (
        <>
          <PropertyHeader property={property} />
          <div className="property-content">
            <div className="property-info-section">
              <PropertyInfo />
            </div>
            <div className="property-booking-section">
              <BookingForm rate={property.rate} />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Property;
