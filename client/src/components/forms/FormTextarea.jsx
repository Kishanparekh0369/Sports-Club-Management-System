import React from 'react';

const FormTextarea = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
  error,
  required = false,
  disabled = false,
  className = '',
  helperText,
  ...props
}) => {
  return (
    <div className={`mb-3 ${className}`}>
      {label && (
        <label htmlFor={name} className="form-label-custom">
          {label} {required && <span className="text-danger">*</span>}
        </label>
      )}
      <textarea
        id={name}
        name={name}
        rows={rows}
        className={`form-control-custom ${error ? 'is-invalid' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {helperText && !error && (
        <div className="form-text text-muted small">{helperText}</div>
      )}
      {error && <div className="invalid-feedback-custom">{error}</div>}
    </div>
  );
};

export default FormTextarea;
