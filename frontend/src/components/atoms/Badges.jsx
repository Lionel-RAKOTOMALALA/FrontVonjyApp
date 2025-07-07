// Badge.js

const Badge = ({ type, label, rounded, outline, textType, children }) => {
    const badgeClass = `ms-1 badge ${rounded ? 'rounded-pill ' : ''}${outline ? 'badge-outline ' : ''}${textType ? `text-${textType} ` : ''}bg-${type}`;

    return (
        <span className={badgeClass}>
            {label && <span className="badge-label">{label}</span>}
            {children}
        </span>
    );
};

export default Badge;
