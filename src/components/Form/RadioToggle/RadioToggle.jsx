import React from 'react';
import PropTypes from 'prop-types';
import Toggle from 'react-toggle';
import 'react-toggle/style.css';
import './RadioToggle.scss';

const RadioToggle = ({ title, value, onChange }) => {
  return (
    <div className="form-group">
      <div className="form-group-title">{title}</div>
      <Toggle
        icons={false}
        checked={value}
        value={title}
        onChange={(e) => onChange && onChange(e.target.checked)}
      />
    </div>
  );
};

RadioToggle.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
};

export default RadioToggle;
