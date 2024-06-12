import axios from 'axios';


const api = axios.create({
  baseURL: 'http://localhost:5000',
});


export const getBooks = async () => {
    const response = await api.get('/books');
    return response.data.data;
}

export const getBookById = async (id) => {
    const response = await api.get(`/books/${id}`);
    return response.data.data;
}

export const postBook = async (newBook) => {
    const response = await api.post('/books', newBook);
    return response.data.book;
}

export const putBook = async (id, editingBook) => {
    await api.put(`/books/${id}`, editingBook);
    return;
}

export const deleteBook = async(id) => {
    await api.delete(`/books/${id}`);
    return;
}
