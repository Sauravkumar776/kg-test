import React from 'react';
import PropTypes from 'prop-types';
import './Checkbox.scss';

const Checkbox = ({ groupName, label, value, onChange }) => {
  return (
    <label className="checkbox-label">
      <input
        type="checkbox"
        name={groupName}
        checked={value}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
      {label}
    </label>
  );
};

Checkbox.propTypes = {
  groupName: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

export default Checkbox;
