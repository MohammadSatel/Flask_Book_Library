document.addEventListener("DOMContentLoaded", () => {

    // Function to handle search
    const searchBooks = () => {
        const input = document.getElementById("searchInput");
        const filter = input.value.toLowerCase();
        const table = document.querySelector(".table");
        const tr = table.getElementsByTagName("tr");

        for (let i = 1; i < tr.length; i++) {
            const tdName = tr[i].getElementsByTagName("td")[0]; // Assuming name is the first column
            if (tdName) {
                const txtValue = tdName.textContent || tdName.innerText;
                const rowDisplay = txtValue.toLowerCase().includes(filter);
                tr[i].style.display = rowDisplay ? "" : "none";
            }
        }
    };

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", searchBooks);
    } else {
        console.error("Element with ID 'searchInput' not found.");
    }

    // Function to handle hiding the add book modal
    const hideAddBookModal = () => {
        $('#addBookModal').modal('hide');
    };

    // Function to handle adding a new book
    const addBook = () => {
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const year_published = document.getElementById('year_published').value;
        const book_type = document.getElementById('book_type').value;

        axios.post('/books/create', {
            name: name,
            author: author,
            year_published: year_published,
            book_type: book_type
        })
            .then(response => {
                console.log('Book added successfully!');
                alert('Book added successfully!');
                hideAddBookModal();
                window.location.reload();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding book: ' + JSON.stringify(error.response));
            });
    };

    const addBookForm = document.getElementById("addBookForm");
    if (addBookForm) {
        addBookForm.addEventListener("submit", event => {
            event.preventDefault();
            addBook();
        });
    } else {
        console.error("Element with ID 'addBookForm' not found.");
    }


    // Function to handle editing a book
    const editBook = (bookId) => {
        axios.get(`/books/${bookId}/edit-data`)
            .then(response => {
                if (response.data.success) {
                    const book = response.data.book;
                    document.getElementById('edit_name').value = book.name;
                    document.getElementById('edit_author').value = book.author;
                    document.getElementById('edit_year_published').value = book.year_published;
                    document.getElementById('edit_book_type').value = book.book_type;

                    $('#editBookModal').modal('show');
                } else {
                    alert('Error fetching book information: ' + response.data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error fetching book information: ' + JSON.stringify(error.response));
            });

        const saveChangesButton = document.getElementById('saveEditBookButton');
        saveChangesButton.addEventListener('click', () => {
            const name = document.getElementById('edit_name').value;
            const author = document.getElementById('edit_author').value;
            const year_published = document.getElementById('edit_year_published').value;
            const book_type = document.getElementById('edit_book_type').value;

            axios.post(`/books/${bookId}/edit`, {
                name: name,
                author: author,
                year_published: year_published,
                book_type: book_type
            })
                .then(response => {
                    console.log('Success:', response.data);
                    alert('Book edited successfully!');
                    $('#editBookModal').modal('hide');
                    window.location.reload();
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error editing book: ' + JSON.stringify(error.response));
                });
        });
    };

    // Function to handle deleting a book
    const deleteBook = (bookId) => {
        axios.post(`/books/${bookId}/delete`)
            .then(response => {
                console.log('Book deleted successfully!');
                alert('Book deleted successfully!');
                location.reload();
            })
            .catch(error => {
                console.log('Error:', error);
                alert('Error deleting book: ' + error.response.data.error);
            });
    };

    // Attach editBook and deleteBook to the global window object
    window.editBook = editBook;
    window.deleteBook = deleteBook;
});
