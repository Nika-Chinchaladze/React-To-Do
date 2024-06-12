import React, { useState, useEffect } from 'react';
import { getBooks, getBookById, postBook, putBook, deleteBook } from "./apiRequest";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image: '', price: '' });
  const [editingBook, setEditingBook] = useState(null);

  const reloadPage = () => {
    window.location.reload();
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // [done]
  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  // [done]
  const addBook = async () => {
    try {
      const response = await postBook(newBook);
      setBooks([...books, response]);
      setNewBook({ title: '', author: '', image: '', price: '' });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  // [done]
  const updateBook = async (id) => {
    try {
      await putBook(id, editingBook);
      const retrieveBook = await getBookById(id);
      setBooks(books.map(book => (book.id === id ? retrieveBook : book)));
      setEditingBook(null);
      reloadPage();
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // [done]
  const removeBook = async (id) => {
    try {
      await deleteBook(id);
      setBooks(books.filter(book => book.id !== id));
      reloadPage();
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (editingBook) {
      setEditingBook({ ...editingBook, [name]: value });
    } else {
      setNewBook({ ...newBook, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingBook) {
      updateBook(editingBook._id);
    } else {
      addBook();
    }
  };

  return (
    <div>
      <h1 id="app-title">Basic CRUD App With React</h1>
      <form id="form-element" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={editingBook ? editingBook.title : newBook.title}
          onChange={handleChange}
        />
        <input
          type
          ="text"
          name="author"
          placeholder="Author"
          value={editingBook ? editingBook.author : newBook.author}
          onChange={handleChange}
        />
        <input
          type
          ="text"
          name="image"
          placeholder="Image"
          value={editingBook ? editingBook.image : newBook.image}
          onChange={handleChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={editingBook ? editingBook.price : newBook.price}
          onChange={handleChange}
        />
        <button type="submit">{editingBook ? 'Update Book' : 'Add New Book'}</button>
      </form>
      
      <hr></hr>
      <h2 id="content-title">Available Books</h2>
      
      <ul id="main-content">
        {books.map(book => (
          <li key={book._id} className='list-item'>
            <img src={`${book.image}`} alt="img"></img>
            <div className="text-div">
              <p><b>Title:</b> {book.title}</p>
              <p><b>Author:</b> {book.author}</p>
              <p><b>Price:</b> ${book.price}</p>
            </div>
            <div className='button-space'>
              <button className='edit-btn' onClick={() => handleEdit(book)}>Edit</button>
              <button className='delete-btn' onClick={() => removeBook(book._id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

    </div>
  );
};

export default App;
