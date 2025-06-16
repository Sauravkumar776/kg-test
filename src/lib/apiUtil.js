import axios from 'axios';

export const ApiUtil = {
  /**
   * Retrieve a list of all properties
   * @return A promise that resolves with the array of properties.
   */
  getProperties() {
    return axios.get('/api/properties').then((response) => response.data);
  },

  /**
   * Retrieve a single property by ID
   * @param {string} propertyId - ID of the property to retrieve
   * @return A promise that resolves with the property specified by propertyId
   */
  getPropertyById(propertyId) {
    return axios.get('/api/properties/' + propertyId).then((response) => response.data);
  },

  /**
   * Retrieve a tree used to lookup properties by name
   * @return A promise that resolves with the property lookup tree
   */
  getLookupTree() {
    return axios.get('/api/propertyLookupTree').then((response) => response.data);
  },

  /**
   * Check if a property is available on the specified dates
   * @param {string} propertyId - ID of the property to reserve
   * @param {string} checkinDate - Date of arrival at the property in for format yyyy-mm-dd (e.g. "2022-01-30")
   * @param {number} duration - Number of days to stay at the property. Must be greater than 0.
   * @return A promise that resolves a boolean that is true if the property is available and false if it is not.
   */
  checkAvailability(propertyId, checkinDate, duration) {
    return axios
      .post(`/api/properties/${propertyId}/checkAvailability`, { checkinDate, duration })
      .then((response) => response.data.available);
  },
};
