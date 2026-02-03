import React from 'react';
import './Card.css';

/**
 * Card Component with glassmorphism effect
 * 
 * @param {React.ReactNode} children - Card content
 * @param {string} title - Optional card title
 * @param {React.ReactNode} header - Optional custom header
 * @param {React.ReactNode} footer - Optional footer content
 * @param {boolean} hover - Enable hover lift effect
 * @param {string} className - Additional CSS classes
 */
const Card = ({
    children,
    title,
    header,
    footer,
    hover = false,
    className = '',
    ...props
}) => {
    const cardClasses = [
        'card',
        hover && 'card-hover',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={cardClasses} {...props}>
            {(title || header) && (
                <div className="card-header">
                    {header || <h3 className="card-title">{title}</h3>}
                </div>
            )}

            <div className="card-body">{children}</div>

            {footer && <div className="card-footer">{footer}</div>}
        </div>
    );
};

export default Card;
