import React from 'react';

const Button = ({
  children,
  variant = 'lime',
  size = 'md',
  type = 'button',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  onClick,
  ...props
}) => {
  const variantClass = {
    lime: 'btn-athletic-lime',
    orange: 'btn-athletic-orange',
    navy: 'btn-athletic-navy',
    'outline-navy': 'btn-athletic-outline-navy',
    'outline-light': 'btn-athletic-outline-light'
  }[variant] || 'btn-athletic-lime';

  const sizeClass = {
    sm: 'btn-athletic-sm',
    md: '',
    lg: 'btn-athletic-lg'
  }[size] || '';

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn-athletic ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <>
          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 18} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
