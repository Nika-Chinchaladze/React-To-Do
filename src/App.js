import React, { useState, useEffect } from 'react';
import { getBooks, getBookById, postBook, putBook, deleteBook } from "./apiRequest";

const App = () => {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({ title: '', author: '', image: '', price: '' });
  const [editingBook, setEditingBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  // [done ... tested]
  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching books:', error);
      setLoading(false);
    }
  };

  // [done ... tested]
  const addBook = async () => {
    try {
      const response = await postBook(newBook);
      setBooks([...books, response]);
      setNewBook({ title: '', author: '', image: '', price: '' });
    } catch (error) {
      console.error('Error adding book:', error);
    }
  };

  // [done ... tested]
  const updateBook = async (id) => {
    try {
      await putBook(id, editingBook);
      const retrieveBook = await getBookById(id);
      
      // update books array
      let index = books.findIndex((book) => book._id === id);
      if (index >= 0) {
        books[index] = retrieveBook;
      }

      // set renewed Book
      setBooks(books);
      setEditingBook(null);
    } catch (error) {
      console.error('Error updating book:', error);
    }
  };

  // [done ... tested]
  const removeBook = async (id) => {
    try {
      await deleteBook(id);

      // remove book
      const renewedBooks = books.filter((book) => book._id !== id);

      // set renewed books
      setBooks(renewedBooks);
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 data-cy="main-title" id="app-title">Basic CRUD App With React</h1>
      <form data-cy="form" id="form-element" onSubmit={handleSubmit}>
        <input
          data-cy="title-input"
          type="text"
          name="title"
          placeholder="Title"
          value={editingBook ? editingBook.title : newBook.title}
          onChange={handleChange}
          required
        />
        <input
          data-cy="author-input"
          type="text"
          name="author"
          placeholder="Author"
          value={editingBook ? editingBook.author : newBook.author}
          onChange={handleChange}
          required
        />
        <input
          data-cy="image-input"
          type="text"
          name="image"
          placeholder="Image"
          value={editingBook ? editingBook.image : newBook.image}
          onChange={handleChange}
          required
        />
        <input
          data-cy="price-input"
          type="number"
          name="price"
          placeholder="Price"
          value={editingBook ? editingBook.price : newBook.price}
          onChange={handleChange}
          required
        />
        <button data-cy="submit-btn" type="submit">{editingBook ? 'Update Book' : 'Add New Book'}</button>
      </form>

      <hr></hr>
      <h2 data-cy="content-title" id="content-title">Available Books</h2>

      <ul id="main-content" data-cy="book-content">
        {books && books.length > 0 ? (
        books.map(book => (
          <li key={book._id} className='list-item'>
            <img src={`${book.image ? book.image : 'default-image.jpg'}`} alt="img"></img>
            <div className="text-div">
              <p><b>Title:</b> <span className="p-title">{book.title}</span></p>
              <p><b>Author:</b> <span className="p-author">{book.author}</span></p>
              <p><b>Price:</b> $<span className="p-price">{book.price}</span></p>
            </div>
            <div className='button-space'>
              <button className='edit-btn' onClick={() => handleEdit(book)}>Edit</button>
              <button className='delete-btn' onClick={() => removeBook(book._id)}>Delete</button>
            </div>
          </li>
        ))) : (
          <p data-cy="no-books">No books available</p>
        )}
      </ul>

    </div>
  );
};

export default App;
