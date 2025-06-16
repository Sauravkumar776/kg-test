import React from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../Checkbox/Checkbox';

const CheckboxGroup = ({ id, title, value, options, onChange }) => {
  value = value || [];

  function checkboxChanged(option, checked) {
    const valueSet = new Set(value);
    if (checked) {
      valueSet.add(option);
    } else {
      valueSet.delete(option);
    }
    onChange && onChange(Array.from(valueSet));
  }

  return (
    <>
      <div id={id} className="form-group-title">
        {title}
      </div>
      <div role="group" aria-labelledby={id} className="form-group">
        {options.map((option) => (
          <Checkbox
            key={option}
            groupName={title}
            label={option}
            value={value.includes(option)}
            onChange={(checked) => checkboxChanged(option, checked)}
          />
        ))}
      </div>
    </>
  );
};

CheckboxGroup.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default CheckboxGroup;
