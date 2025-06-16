// Maximum number of properties to show on a page
export const PROPERTIES_PER_PAGE = 6;

/**
 * Gets the Array of page numbers to shown in the pagination component. The first and last page should always be shown
 * and curPage should be centered among the remaining pages if possible.
 * @param {Number}  totalPages - The total number of pages
 * @param {Number} curPage - The page number that is currently selected. This is 1 indexed so the first page would be 1
 * @param {Number} maxLabels - The maximum number of page numbers to show in the pagination component
 * @return {Array} - Array of page numbers to show in the pagination component.
 * @example getPaginationLabels(100, 50, 5) //returns [1, 49, 50, 51, 100]
 */
export const getPaginationLabels = (totalPages, curPage, maxLabels) => {
  //TODO: replace placeholder solution
  const pageNums = [];
  for (var i = 0; i < totalPages; i++) {
    pageNums.push(i + 1);
  }
  return pageNums;
};

/**
 * Get the properties to show for the specified page from the full list of properties
 * @param {Array}  properties - Array containing all properties
 * @param {Number} page - The current paginated page the UI should display
 * @return {Array} - The properties for the specified page
 */
export const getPropertiesForPage = (properties, page) => {
  const firstPropertyIndex = PROPERTIES_PER_PAGE * (page - 1);
  const lastPropertyIndex = PROPERTIES_PER_PAGE * page;
  return properties.slice(firstPropertyIndex, lastPropertyIndex);
};
