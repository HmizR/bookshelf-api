const { nanoid } = require('nanoid');
const books = require('./books');

const addBook = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const bookData = { id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt };

    const resp = {};

    if (name === undefined) {
        resp.status = 'fail';
        resp.message = 'Gagal menambahkan buku. Mohon isi nama buku';
        const response = h.response(resp).code(400);
        return response;
    }

    if (readPage > pageCount) {
        resp.status = 'fail';
        resp.message = 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount';
        const response = h.response(resp).code(400);
        return response;
    }

    books.push(bookData);

    resp.status = 'success';
    resp.message = 'Buku berhasil ditambahkan';
    resp.data = { bookId: id };
    const response = h.response(resp).code(201);
    return response;
};

const getBooks = (request, h) => {
    const { name, reading, finished } = request.query;

    const resp = {};
    const filteredBook = [];

    if (name !== undefined) {
        books.find((b) => {
            if (b.name.toLowerCase().includes(name.toLowerCase())) {
                const { id, name, publisher } = b;
                filteredBook.push({ id, name, publisher });
            }
        });
    } else if (reading !== undefined) {
        books.find((b) => {
            if (b.reading === Boolean(parseInt(reading, 10))) {
                const { id, name, publisher } = b;
                filteredBook.push({ id, name, publisher });
            }
        });
    } else if (finished !== undefined) {
        books.find((b) => {
            if (b.finished === Boolean(parseInt(finished, 10))) {
                const { id, name, publisher } = b;
                filteredBook.push({ id, name, publisher });
            }
        });
    } else {
        for (let i = 0; i < books.length; i += 1) {
            const { id, name, publisher } = books[i];
            filteredBook.push({ id, name, publisher });
        }
    }

    resp.status = 'success';
    resp.data = {
        books: filteredBook,
    };
    const response = h.response(resp);
    return response;
};

const getBookById = (request, h) => {
    const { id } = request.params;
    const book = books.filter((b) => b.id === id)[0];

    const resp = {};

    if (book !== undefined) {
        resp.status = 'success';
        resp.data = {
            book,
        };
        const response = h.response(resp);
        return response;
    }

    resp.status = 'fail';
    resp.message = 'Buku tidak ditemukan';
    const response = h.response(resp).code(404);
    return response;
};

const editNoteById = (request, h) => {
    const { id } = request.params;
    const { name, pageCount, readPage } = request.payload;

    const updatedAt = new Date().toISOString();
    const i = books.findIndex((b) => b.id === id);

    const resp = {};

    if (name === undefined) {
        resp.status = 'fail';
        resp.message = 'Gagal memperbarui buku. Mohon isi nama buku';
        const response = h.response(resp).code(400);
        return response;
    }

    if (readPage > pageCount) {
        resp.status = 'fail';
        resp.message = 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount';
        const response = h.response(resp).code(400);
        return response;
    }

    if (i !== -1) {
        const updatedBook = { ...request.payload, updatedAt };
        books[i] = {
            ...books[i], ...updatedBook,
        };

        resp.status = 'success';
        resp.message = 'Buku berhasil diperbarui';
        const response = h.response(resp);
        return response;
    }

    resp.status = 'fail';
    resp.message = 'Gagal memperbarui buku. Id tidak ditemukan';
    const response = h.response(resp).code(404);
    return response;
};

const deleteBookById = (request, h) => {
    const { id } = request.params;

    const i = books.findIndex((b) => b.id === id);
    const resp = {};

    if (i !== -1) {
        books.splice(i, 1);
        resp.status = 'success';
        resp.message = 'Buku berhasil dihapus';
        const response = h.response(resp);
        return response;
    }

    resp.status = 'fail';
    resp.message = 'Buku gagal dihapus. Id tidak ditemukan';
    const response = h.response(resp).code(404);
    return response;
};

module.exports = { addBook, getBooks, getBookById, editNoteById, deleteBookById };
