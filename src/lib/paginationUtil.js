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
  // Handle edge cases
  if (totalPages <= 0 || maxLabels <= 0) {
    return [];
  }

  // If total pages is less than or equal to maxLabels, return all pages
  if (totalPages <= maxLabels) {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  }

  // Always include first and last page
  const pages = new Set([1, totalPages]);
  
  // Add current page
  pages.add(curPage);
  
  // Calculate how many additional pages we can add
  const remainingSlots = maxLabels - pages.size;
  
  if (remainingSlots > 0) {
    // Try to center around curPage
    const slotsPerSide = Math.floor(remainingSlots / 2);
    
    // Calculate the range around curPage
    let start = Math.max(1, curPage - slotsPerSide);
    let end = Math.min(totalPages, curPage + slotsPerSide);
    
    // Adjust if we're too close to the beginning or end
    if (curPage - slotsPerSide < 1) {
      // Too close to start, add more pages to the right
      end = Math.min(totalPages, end + (1 - (curPage - slotsPerSide)));
    } else if (curPage + slotsPerSide > totalPages) {
      // Too close to end, add more pages to the left
      start = Math.max(1, start - ((curPage + slotsPerSide) - totalPages));
    }
    
    // Add pages in the calculated range
    for (let i = start; i <= end; i++) {
      pages.add(i);
      if (pages.size >= maxLabels) break;
    }
    
    // If we still have slots and haven't reached maxLabels, fill remaining slots
    if (pages.size < maxLabels) {
      // Try to add more pages around the current selection
      let leftExtend = start - 1;
      let rightExtend = end + 1;
      
      while (pages.size < maxLabels && (leftExtend >= 1 || rightExtend <= totalPages)) {
        if (leftExtend >= 1 && pages.size < maxLabels) {
          pages.add(leftExtend);
          leftExtend--;
        }
        if (rightExtend <= totalPages && pages.size < maxLabels) {
          pages.add(rightExtend);
          rightExtend++;
        }
      }
    }
  }
  
  // Convert to sorted array
  return Array.from(pages).sort((a, b) => a - b);
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