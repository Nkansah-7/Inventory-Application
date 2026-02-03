import React, { useState } from 'react';
import './Input.css';

/**
 * Form Input Component with validation states and icons
 * 
 * @param {string} label - Input label
 * @param {string} type - Input type
 * @param {string} name - Input name
 * @param {string} value - Input value
 * @param {function} onChange - Change handler
 * @param {string} placeholder - Placeholder text
 * @param {string} error - Error message
 * @param {boolean} required - Required field
 * @param {boolean} disabled - Disabled state
 * @param {React.ReactNode} icon - Prefix icon
 * @param {React.ReactNode} suffixIcon - Suffix icon
 * @param {boolean} showPasswordToggle - Show password visibility toggle
 */
const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
    onBlur,
    placeholder,
    error,
    success,
    required = false,
    disabled = false,
    icon,
    suffixIcon,
    showPasswordToggle = false,
    className = '',
    ...props
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const inputType = showPasswordToggle && showPassword ? 'text' : type;

    const handleFocus = () => setIsFocused(true);
    const handleBlur = (e) => {
        setIsFocused(false);
        if (onBlur) onBlur(e);
    };

    const containerClasses = [
        'input-container',
        error && 'input-container-error',
        success && 'input-container-success',
        disabled && 'input-container-disabled',
        isFocused && 'input-container-focused',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClasses}>
            {label && (
                <label htmlFor={name} className="input-label">
                    {label}
                    {required && <span className="input-required">*</span>}
                </label>
            )}

            <div className="input-wrapper">
                {icon && <span className="input-icon input-icon-prefix">{icon}</span>}

                <input
                    id={name}
                    type={inputType}
                    name={name}
                    value={value}
                    onChange={onChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                    disabled={disabled}
                    required={required}
                    className="input-field"
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={error ? `${name}-error` : undefined}
                    {...props}
                />

                {showPasswordToggle && type === 'password' && (
                    <button
                        type="button"
                        className="input-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex={-1}
                    >
                        {showPassword ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                <line x1="1" y1="1" x2="23" y2="23" />
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                <circle cx="12" cy="12" r="3" />
                            </svg>
                        )}
                    </button>
                )}

                {suffixIcon && <span className="input-icon input-icon-suffix">{suffixIcon}</span>}

                {success && !error && (
                    <span className="input-icon input-icon-suffix input-success-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                    </span>
                )}

                {error && (
                    <span className="input-icon input-icon-suffix input-error-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </span>
                )}
            </div>

            {error && (
                <p id={`${name}-error`} className="input-error-message">
                    {error}
                </p>
            )}
        </div>
    );
};

export default Input;
