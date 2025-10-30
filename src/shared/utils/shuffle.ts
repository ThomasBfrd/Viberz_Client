export function shuffle<T>(elements: T[]): T[] {
    return elements.sort(() => Math.random() - 0.5);
}