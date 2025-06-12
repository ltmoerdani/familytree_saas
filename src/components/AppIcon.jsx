import React from 'react';
import PropTypes from 'prop-types';
import * as LucideIcons from 'lucide-react';
import { HelpCircle } from 'lucide-react';

function Icon({
    name,
    size,
    color,
    className,
    strokeWidth,
    ...props
}) {
    const IconComponent = LucideIcons[name];

    if (!IconComponent) {
        return <HelpCircle size={size} color="gray" strokeWidth={strokeWidth} className={className} {...props} />;
    }

    return <IconComponent
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
    />;
}

// PropTypes validation for strict prop checking
Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    color: PropTypes.string,
    className: PropTypes.string,
    strokeWidth: PropTypes.number,
};

// Default props for optional properties
Icon.defaultProps = {
    size: 24,
    color: "currentColor",
    className: "",
    strokeWidth: 2,
};

export default Icon;