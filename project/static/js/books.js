document.addEventListener("DOMContentLoaded", () => {

// Function to handle search
    function searchBooks() {
        let input, filter, table, tr, td, i, j, txtValue;
        input = document.getElementById("searchInput");
        filter = input.value.toLowerCase();
        table = document.querySelector(".table");
        tr = table.getElementsByTagName("tr");
        for (i = 1; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td");
            let rowDisplay = false;
            for (j = 0; j < td.length; j++) {
                if (td[j]) {
                    txtValue = td[j].textContent || td[j].innerText;
                    if (txtValue.toLowerCase().indexOf(filter) > -1) {
                        rowDisplay = true;
                        break;
                    }
                }
            }
            tr[i].style.display = rowDisplay ? "" : "none";
        }
    }

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", searchBooks);
    } else {
        console.error("Element with ID 'searchInput' not found.");
    }

    // Function to handle hiding the add book modal
    function hideAddBookModal() {
        $('#addBookModal').modal('hide');
    }

    // Function to handle adding a new book
    function addBook() {
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
                console.log('Success:', response.data);
                alert('Book added successfully!');
                hideAddBookModal();
                window.location.reload(); // Reload the page to show the updated book list
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error adding book: ' + JSON.stringify(error.response)); // Log the complete error response
            });
    }

    const addBookForm = document.getElementById("addBookForm");
    if (addBookForm) {
        addBookForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent the default form submission
            addBook(); // Call the addBook function to handle adding a new book
        });
    } else {
        console.error("Element with ID 'addBookForm' not found.");
    }

        // Function to fetch and update the book list
    function fetchBookList() {
        // Assuming there's a function named updateBookList to fetch and update the book list
        updateBookList();
    }

    // Function to update the book list (replace this with your actual implementation)
    function updateBookList() {
        // Implement code to fetch and update the book list
        // For demonstration purposes, let's just log a message
        console.log('Book list updated.');
    }
    

    // Function to handle editing a book
    function editBook(bookId) {
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

            // Retrieve the book type from the dropdown, ensuring it remains the same as adding a book
            const selectedBookType = document.getElementById('book_type').value;

            axios.post(`/books/${bookId}/edit`, {
                name: name,
                author: author,
                year_published: year_published,
                book_type: selectedBookType  // Use the selectedBookType here
            })
                .then(response => {
                    console.log('Success:', response.data);
                    alert('Book edited successfully!');
                    $('#editBookModal').modal('hide');
                    fetchBookList(); // Fetch and update the book list
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Error editing book: ' + JSON.stringify(error.response));
                });
        });
    }

    // Function to handle deleting a book
    function deleteBook(bookId) {
        axios.post(`/books/${bookId}/delete`)
            .then(response => {
                console.log('Success:', response.data);
                alert('Book deleted successfully!');
                location.reload();
            })
            .catch(error => {
                console.log('Error:', error);
                alert('Error deleting book: ' + error.response.data.error);
            });
    }

    // Attach editBook and deleteBook to the global window object
    window.editBook = editBook;
    window.deleteBook = deleteBook;
});

