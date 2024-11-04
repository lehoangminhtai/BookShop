export const fetchBooks = async () => {
    const response = await fetch('/api/books');
    const json = await response.json();

    if (!response.ok) {
        throw new Error('Failed to fetch books');
    }

    return json;
}

export const fetchBook = async (id) =>{
    const response = await fetch(`/api/books/${id}`);
    const json = await response.json();

    if(!response.ok){
        throw new Error('Failed to fetch book ',{})
    }

    return json;
}
