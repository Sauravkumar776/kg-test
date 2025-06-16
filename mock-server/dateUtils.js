module.exports = {
  /**
   * Convert a date from string format to a Date object
   * @param {string} dateString - String representation of a date in yyyy-mm-dd format
   * @return A Date object representation of the provided date string
   */
  getDate: function (dateString) {
    let dateParts = dateString.split('-');
    dateParts = dateParts.map((num) => parseInt(num));

    if (dateParts.length !== 3) {
      return null;
    }

    // Make the month 0 indexed
    dateParts[1]--;

    return new Date(...dateParts);
  },
  /**
   * Check if date is in format yyyy-mm-dd
   * @param {string} dateString - Checkin date for property reservation
   * @return A boolean that is true if date is in format yyyy-mm-dd
   */
  isValidDateFormat: function (dateString) {
    const dateFormat = /\d{4}-\d{2}-\d{2}/;
    return dateFormat.test(dateString);
  },
  /**
   * Generate an array of dates to reserve the property
   * @param {string} checkinDate - Date of arrival at the property
   * @param {number} duration - Number of days to reserve the property
   * @return An array of dates in milliseconds
   */
  getDatesToReserve: function (checkinDate, duration) {
    let datesToReserve = [];

    for (let i = 0; i <= duration; i++) {
      const newDate = new Date(checkinDate);
      newDate.setDate(newDate.getDate() + i);
      datesToReserve.push(newDate.getTime());
    }

    return datesToReserve;
  },
  /**
   * Check if property is not reserved
   * @param {number[]} reservedDays - Reserved dates for property
   * @param {number[]} datesToReserve - Dates to reserve property
   * @return A boolean value that is true if dates in datesToReserve is not in datesToReserve
   */
  canReserve: function (reservedDays, datesToReserve) {
    return !datesToReserve.some((date) => reservedDays.has(date));
  },
};
