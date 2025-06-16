import React from 'react';
import PropTypes from 'prop-types';
import { Range } from 'rc-slider';
import cx from 'classnames';
import 'rc-slider/assets/index.css';
import './RangeSelect.scss';

const RangeSelect = ({ title, step, min, max, isCurrency, value, onChange }) => {
  const markPrefix = isCurrency ? '$' : '';
  const leftModified = value && (value[0] !== min || value[0] === value[1]);
  const rightModified = value && (value[1] !== max || value[0] === value[1]);

  const conditionalMarks = value && {
    [value[0]]: markPrefix + value[0],
    [value[1]]: markPrefix + value[1],
  };

  const formattedMarks = {
    [min]: markPrefix + min,
    [max]: markPrefix + max,
    ...conditionalMarks,
  };

  return (
    <div className="form-group">
      <div className="form-group-title">{title}</div>
      <div
        className={cx('rc-slider-wrapper', {
          'left-modified': leftModified,
          'right-modified': rightModified,
          'both-modified': leftModified && rightModified,
        })}
      >
        <Range
          min={min || 0}
          max={max}
          step={step}
          marks={formattedMarks}
          onChange={(newValue) => onChange(newValue)}
          value={value}
        />
      </div>
    </div>
  );
};

RangeSelect.propTypes = {
  title: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  marks: PropTypes.object,
  step: PropTypes.number,
  isCurrency: PropTypes.bool,
  value: PropTypes.array,
  onChange: PropTypes.func,
};

export default RangeSelect;
