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

// Global variables to track debounce and API calls
let debounceTimeout = null;
let currentApiCall = null;

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
  // Clear any existing debounce timeout
  if (debounceTimeout) {
    clearTimeout(debounceTimeout);
  }

  // Cancel any ongoing API call by marking it as stale
  if (currentApiCall) {
    currentApiCall.cancelled = true;
  }

  // Validate date format (yyyy-mm-dd)
  const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateFormatRegex.test(checkinDate)) {
    return;
  }

  // Set up debounced API call
  debounceTimeout = setTimeout(async () => {
    try {
      // Parse duration, default to 1 if empty or invalid
      const duration = parseInt(durationString) || 1;

      // Create API call tracker
      const apiCall = { cancelled: false };
      currentApiCall = apiCall;

      // Make API call
      const isAvailable = await ApiUtil.checkAvailability(propertyId, checkinDate, duration);

      // Only update UI if this API call hasn't been cancelled
      if (!apiCall.cancelled) {
        setShowAvailabilityError(!isAvailable);
        currentApiCall = null;
      }
    } catch (error) {
      // Handle API errors - assume unavailable on error
      if (currentApiCall && !currentApiCall.cancelled) {
        setShowAvailabilityError(true);
        currentApiCall = null;
      }
    }
  }, 500);
}

const BookingForm = ({ rate }) => {
  let { propertyId } = useParams();
  const [checkinDate, setCheckinDate] = useState('');
  const [duration, setDuration] = useState('');
  const [guests, setGuests] = useState('');
  const [showAvailabilityError, setShowAvailabilityError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');

  const checkinDateRef = useRef(null);

  async function submitBooking() {
    // Reset states
    setBookingError('');
    setBookingSuccess(false);
    
    // Validate inputs
    const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateFormatRegex.test(checkinDate)) {
      setBookingError('Please enter a valid check-in date in yyyy-mm-dd format.');
      return;
    }

    const durationNum = parseInt(duration);
    if (!durationNum || durationNum < 1) {
      setBookingError('Please enter a valid duration (minimum 1 day).');
      return;
    }

    const guestsNum = parseInt(guests);
    if (!guestsNum || guestsNum < 1) {
      setBookingError('Please enter a valid number of guests (minimum 1).');
      return;
    }

    setLoading(true);

    try {
      // Make API call to reserve property
      const response = await fetch(`/api/properties/${propertyId}/reserve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkinDate,
          duration: durationNum,
          guests: guestsNum,
        }),
      });

      if (response.ok) {
        setBookingSuccess(true);
        // Clear form
        setCheckinDate('');
        setDuration('');
        setGuests('');
        if (checkinDateRef.current) {
          checkinDateRef.current.value = '';
        }
      } else {
        const errorData = await response.json();
        setBookingError(errorData.errorMsg || 'Failed to reserve property. Please try again.');
      }
    } catch (error) {
      setBookingError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setShowAvailabilityError(false);
    onRequestedDatesChange(propertyId, checkinDate, duration, setShowAvailabilityError);
  }, [propertyId, checkinDate, duration]);

  return (
    <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
      <div className="booking-rate-section">
        <span className="booking-rate-amount">${rate}</span>
        /night
      </div>

      <div className="booking-form-item">
        <label htmlFor="checkin-date">Check-in date</label>
        <input
          id="checkin-date"
          className="booking-form-input"
          onChange={() => handleCheckinDateChange(checkinDateRef.current, setCheckinDate)}
          ref={checkinDateRef}
          placeholder="yyyy-mm-dd"
          aria-describedby={showAvailabilityError ? "availability-error" : undefined}
          required
        />
        {showAvailabilityError && (
          <div id="availability-error" className="booking-form-error-msg" role="alert">
            The specified dates are not available.
          </div>
        )}
      </div>

      <div className="booking-form-item">
        <label htmlFor="duration">Duration of stay (days)</label>
        <input 
          id="duration"
          className="booking-form-input" 
          type="number"
          min="1"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          required
        />
      </div>

      <div className="booking-form-item">
        <label htmlFor="guests">Number of guests</label>
        <input 
          id="guests"
          className="booking-form-input" 
          type="number"
          min="1"
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          required
        />
      </div>

      {bookingError && (
        <div className="booking-form-error-msg" role="alert">
          {bookingError}
        </div>
      )}

      {bookingSuccess && (
        <div className="booking-form-success-msg" role="alert">
          Property reserved successfully!
        </div>
      )}

      <div>
        <button 
          className="booking-form-submit" 
          type="button" 
          onClick={submitBooking}
          disabled={loading || showAvailabilityError}
          aria-describedby={loading ? "loading-status" : undefined}
        >
          {loading ? (
            <>
              <img src={LoadingImg} alt="" className="booking-form-loading-img" />
              <span id="loading-status" className="sr-only">Processing reservation...</span>
            </>
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

/*
Improvements made to the BookingForm:

1. User Experience:
   - Added success message when booking is completed
   - Clear form fields after successful booking
   - Disabled submit button when availability check shows error
   - Added loading state with visual feedback

2. Error Handling & Validation:
   - Client-side validation for all required fields
   - Proper error messages for different validation failures
   - Network error handling with user-friendly messages
   - API error handling with server-provided error messages

3. Accessibility:
   - Added proper labels with htmlFor attributes
   - Added ARIA attributes (role="alert", aria-describedby)
   - Added screen reader text for loading state
   - Proper form structure with semantic HTML

4. HTML Form Best Practices:
   - Added form element with preventDefault to handle submission properly
   - Added proper input types (number for duration and guests)
   - Added min attributes for number inputs
   - Added required attributes for form validation
   - Added proper id attributes for label association

5. User Feedback:
   - Clear indication of form state (loading, success, error)
   - Informative error messages that guide user action
   - Visual feedback during API operations
*/