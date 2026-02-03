import React from 'react';
import './LoadingSpinner.css';

/**
 * Loading Spinner Component
 * 
 * @param {string} size - Spinner size: 'sm' | 'md' | 'lg'
 * @param {boolean} fullscreen - Show as fullscreen overlay
 * @param {string} message - Optional loading message
 */
const LoadingSpinner = ({
    size = 'md',
    fullscreen = false,
    message,
    className = '',
}) => {
    if (fullscreen) {
        return (
            <div className="loading-overlay">
                <div className="loading-content">
                    <div className={`spinner spinner-${size}`}>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                        <div className="spinner-ring"></div>
                    </div>
                    {message && <p className="loading-message">{message}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className={`spinner-container ${className}`}>
            <div className={`spinner spinner-${size}`}>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
                <div className="spinner-ring"></div>
            </div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
};

/**
 * Skeleton Loader for content placeholders
 */
export const Skeleton = ({ width, height, className = '' }) => {
    return (
        <div
            className={`skeleton ${className}`}
            style={{ width, height }}
        />
    );
};

export default LoadingSpinner;
