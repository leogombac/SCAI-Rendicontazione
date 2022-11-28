export function toHyphenCase(string: string) {
    if (!string) return '';
    return string.toLowerCase().split(' ').join('-');
}

export function toPascalCase(string: string) {
    if (!string) return '';
    return string.toLowerCase().split(' ').map(s => s[0].toUpperCase() + s.slice(1)).join('');
}