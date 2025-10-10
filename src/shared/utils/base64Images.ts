export const base64ToImage = (base64: string): string => {
    return `data:image/jpeg;base64,${base64}`;
}
