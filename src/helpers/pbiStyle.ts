// PBI font size formatting is not in pure CSS px units, need to convert
function convertFontSize(value: number): string | null {
    if (value === null) return null;
    return  `${value * (4/3)}px`;
}

export {
    convertFontSize
}