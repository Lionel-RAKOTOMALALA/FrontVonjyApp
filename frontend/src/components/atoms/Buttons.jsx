// Badge.js
const Button = ({ type, size, rounded, outline, textType, children }) => {
    const btnClass = `${rounded ? 'rounded-pill ' : ''}${size ? `btn-${size}` : ''} ${outline ? `btn-outline-${type} ` : `btn-${type}`} ${textType ? `text-${textType} ` : ''} `;

    return (
        <button aria-label='Click me' className={`btn ms-1 ${btnClass}`}>
            {children}
        </button>
    );
};

export default Button;
