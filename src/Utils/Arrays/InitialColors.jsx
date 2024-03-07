// utils.js
const getInitialColor = (initials) => {
    const defaultColor = '#41C0B5'; // Default color

    if (initials.length < 2) {
        return defaultColor;
    }

    const asciiSum = initials.toUpperCase().charCodeAt(0) + initials.toUpperCase().charCodeAt(1);

    // Choose a color based on the ASCII sum
    const colorIndex = asciiSum % 100; // You can adjust the divisor based on the number of colors you have

    const colorPalette = [
        // Blues
        '#3498db', '#2980b9', '#1abc9c', '#16a085', '#3498db', '#2ecc71', '#3498db', '#3498db',
        // Reds
        '#e74c3c', '#c0392b', '#e74c3c', '#c0392b', '#e74c3c', '#c0392b', '#e74c3c', '#c0392b',
        // Greens
        '#2ecc71', '#27ae60', '#2ecc71', '#27ae60', '#2ecc71', '#27ae60', '#2ecc71', '#27ae60',
        // Yellows
        '#f39c12', '#e67e22', '#f39c12', '#e67e22', '#f39c12', '#e67e22', '#f39c12', '#e67e22',
        // Purples
        '#9b59b6', '#8e44ad', '#9b59b6', '#8e44ad', '#9b59b6', '#8e44ad', '#9b59b6', '#8e44ad',
        // Turquoises
        '#1abc9c', '#16a085', '#1abc9c', '#16a085', '#1abc9c', '#16a085', '#1abc9c', '#16a085',
        // Dark Grays
        '#34495e', '#2c3e50', '#34495e', '#2c3e50', '#34495e', '#2c3e50', '#34495e', '#2c3e50',
        // Oranges
        '#e67e22', '#d35400', '#e67e22', '#d35400', '#e67e22', '#d35400', '#e67e22', '#d35400',
        // Dark Greens
        '#27ae60', '#229954', '#27ae60', '#229954', '#27ae60', '#229954', '#27ae60', '#229954',
        // Pumpkins
        '#d35400', '#e67e22', '#d35400', '#e67e22', '#d35400', '#e67e22', '#d35400', '#e67e22',
        // Brick Reds
        '#c0392b', '#b03a2e', '#c0392b', '#b03a2e', '#c0392b', '#b03a2e', '#c0392b', '#b03a2e',
        // Dark Purples
        '#8e44ad', '#7d3c98', '#8e44ad', '#7d3c98', '#8e44ad', '#7d3c98', '#8e44ad', '#7d3c98',
        // More Colors...
    ];

    return colorPalette[colorIndex] || defaultColor;
};

export { getInitialColor };    