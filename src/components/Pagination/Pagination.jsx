import React from 'react';
import PropTypes from 'prop-types';
import { getPaginationLabels, PROPERTIES_PER_PAGE } from '../../lib/paginationUtil';
import cx from 'classnames';
import './Pagination.scss';

// The maximum number of links to pages to show in the pagination component
const MAX_PAGE_LABELS = 7;

const Pagination = ({ page, setPage, propertyCount }) => {
  const totalPages = Math.ceil(propertyCount / PROPERTIES_PER_PAGE);
  const pageNums = getPaginationLabels(totalPages, page, MAX_PAGE_LABELS);

  if (!propertyCount) {
    return null;
  }

  return (
    <div className="pagination">
      <div className="page-controls">
        <button
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
          className="arrow-button"
          alt="Previous Page"
        >
          <i className="fas fa-angle-left" />
        </button>
        <div className="page-link-wrapper">
          {pageNums.map((pageNum, index) => (
            <React.Fragment key={`page-link-${pageNum}`}>
              {index > 0 && pageNum - 1 !== pageNums[index - 1] && <div className="dots">...</div>}
              <button
                className={cx('page-link', { current: page === pageNums[index] })}
                alt={`Open Page ${pageNum}`}
                onClick={() => setPage(pageNum)}
              >
                {pageNum}
              </button>
            </React.Fragment>
          ))}
        </div>
        <button
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
          className="arrow-button"
          alt="Next Page"
        >
          <i className="fas fa-angle-right" />
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  propertyCount: PropTypes.number.isRequired,
};

export default Pagination;
