import React from 'react';
import './Button.css';

/**
 * Versatile Button Component with multiple variants and states
 * 
 * @param {string} variant - Button style: 'primary' | 'secondary' | 'danger' | 'ghost'
 * @param {string} size - Button size: 'sm' | 'md' | 'lg'
 * @param {boolean} loading - Shows loading spinner
 * @param {boolean} disabled - Disables the button
 * @param {React.ReactNode} icon - Optional icon element
 * @param {string} iconPosition - Icon placement: 'left' | 'right'
 * @param {function} onClick - Click handler
 * @param {string} type - Button type: 'button' | 'submit' | 'reset'
 * @param {React.ReactNode} children - Button content
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  children,
  ...props
}) => {
  const buttonClasses = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    loading && 'btn-loading',
    disabled && 'btn-disabled',
    icon && 'btn-with-icon',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <span className="btn-spinner">
          <svg className="spinner" viewBox="0 0 24 24">
            <circle
              className="spinner-circle"
              cx="12"
              cy="12"
              r="10"
              fill="none"
              strokeWidth="3"
            />
          </svg>
        </span>
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className="btn-icon btn-icon-left">{icon}</span>
      )}
      
      <span className="btn-content">{children}</span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className="btn-icon btn-icon-right">{icon}</span>
      )}
    </button>
  );
};

export default Button;
