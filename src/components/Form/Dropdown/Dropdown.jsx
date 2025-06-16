import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import './Dropdown.scss';

const Dropdown = ({ title, name, options, value, onChange }) => {
  return (
    <div className="form-group">
      <div className="form-group-title">{title}</div>
      <Select
        name={name}
        options={options}
        value={options.find((o) => o.value === value)}
        onChange={(option) => onChange && onChange(option?.value)}
        className="react-select-container"
        classNamePrefix="react-select"
        isClearable
      />
    </div>
  );
};

Dropdown.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string,
    })
  ),
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default Dropdown;
