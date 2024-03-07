import React from 'react';
import { getInitialColor } from 'Utils/Arrays/InitialColors';

const UserPlaceholder = ({ firstName, lastName, size, fontSize }) => {
    // Extract the first letter of the first and last names
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';

    // Combine the first and last initials
    const combinedInitials = firstInitial + lastInitial;

    const backgroundColor = getInitialColor(combinedInitials);

    // Define the styles for the placeholder
    const placeholderStyle = {
        backgroundColor: backgroundColor,
        color: '#fff',
        borderRadius: '50%',
        width: size,
        height: size,
        fontSize: fontSize,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    };

    return (
        <div style={placeholderStyle}>
            <span>{combinedInitials}</span>
        </div>
    );
};

export default UserPlaceholder;