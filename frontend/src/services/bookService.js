export const fetchBook = async () => {
    const response = await fetch('/api/books');
    const json = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }

    return json;
}
