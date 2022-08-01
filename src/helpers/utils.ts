// PBI font size formatting is not in pure CSS px units, need to convert
function convertFontSize(value: number): string {
    return  `${value * (4/3)}px`;
}

function convertPadding(value: number): string {
    return `${value}px`;
}

export {
    convertFontSize,
    convertPadding
};