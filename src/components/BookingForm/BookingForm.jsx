import * as PropTypes from 'prop-types';
import { useParams } from 'react-router';
import './BookingForm.scss';
import { useRef, useState, useEffect } from 'react';
import LoadingImg from '../../assets/loading.gif';
import { ApiUtil } from '../../lib/apiUtil';
import { applyDateMask } from '../../lib/inputMaskUtil';

function handleCheckinDateChange(checkinDateElem, setCheckinDate) {
  const formattedDateStr = applyDateMask(checkinDateElem);
  setCheckinDate(formattedDateStr);
}

/**
 * Checks the availability of the requested dates when the "Check-in date" or "Duration of stay" change.
 * The availability should only be checked if checkinDate matches the yyyy-mm-dd format and the user has stopped
 * typing for 500ms.
 * When the availability of the dates is determined hide/show the availability error message (by calling
 * setShowAvailabilityError()) only if checkinDate and duration haven't changed since the "checkAvailability" request
 * was sent. e.g. if the user changes the duration a second time while the code is waiting for the API to respond from
 * the first change, then ignore the API response
 * @param {string} propertyId - ID of the property
 * @param {string} checkinDate - Value of the "Check-in date" input
 * @param {string} durationString - Value of the "Duration of stay" input
 * @param {function} setShowAvailabilityError - Function that takes a boolean input and shows/hides the availability error message.
 */
export function onRequestedDatesChange(
  propertyId,
  checkinDate,
  durationString,
  setShowAvailabilityError
) {
  // TODO: implement function
}

const BookingForm = ({ rate }) => {
  let { propertyId } = useParams();
  const [checkinDate, setCheckinDate] = useState('');
  const [duration, setDuration] = useState('');
  const [guests, setGuests] = useState('');
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);
  const [loading, setLoading] = useState(false);

  const checkinDateRef = useRef(null);

  function submitBooking() {
    //TODO: make a call to API to reserve the property.
  }

  useEffect(() => {
    setShowAvailabilityError(false);
    onRequestedDatesChange(propertyId, checkinDate, duration, setShowAvailabilityError);
  }, [propertyId, checkinDate, duration]);

  return (
    <form className="booking-form">
      <div className="booking-rate-section">
        <span className="booking-rate-amount">${rate}</span>
        /night
      </div>

      <div className="booking-form-item">
        <label>Check-in date</label>
        <input
          className="booking-form-input"
          onChange={() => handleCheckinDateChange(checkinDateRef.current, setCheckinDate)}
          ref={checkinDateRef}
          placeholder="yyyy-mm-dd"
        />
        {showAvailabilityError && (
          <div className="booking-form-error-msg">The specified dates are not available.</div>
        )}
      </div>

      <div className="booking-form-item">
        <label>Duration of stay (days)</label>
        <input className="booking-form-input" onChange={(e) => setDuration(e.target.value)} />
      </div>

      <div className="booking-form-item">
        <label>Number of guests</label>
        <input className="booking-form-input" onChange={(e) => setGuests(e.target.value)} />
      </div>

      <div>
        <button className="booking-form-submit" type="button" onClick={submitBooking}>
          {loading ? (
            <img src={LoadingImg} alt="" className="booking-form-loading-img" />
          ) : (
            'Reserve'
          )}
        </button>
      </div>
    </form>
  );
};

BookingForm.propTypes = {
  rate: PropTypes.number,
};

export default BookingForm;
