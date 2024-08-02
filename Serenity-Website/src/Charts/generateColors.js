/**
 * Generates an array of random colors
 * @param {number} numColors - The number of colors to generate
 * @returns {Array} An array of hex color strings
 */
export const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
        // generate a random color in hex format
        const color = `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
        colors.push(color);
    }
    return colors;
}