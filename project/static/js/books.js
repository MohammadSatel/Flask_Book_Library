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

    // Event listener for search input
    document.getElementById("searchInput").addEventListener("input", searchBooks);

    // Handle form submission for adding a new book
    document.getElementById("addBookForm").addEventListener("submit", function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const name = document.getElementById('name').value;
        const author = document.getElementById('author').value;
        const year_published = document.getElementById('year_published').value;
        const book_type = document.getElementById('book_type').value;

        // Send an AJAX request to create a new book
        axios.post('/books/create', {
            name: name,
            author: author,
            year_published: year_published,
            book_type: book_type
        })
        .then(response => {
            console.log('Success:', response.data);
            // Display a success notification
            alert('Book added successfully!');

            // Close the modal
            document.getElementById('addBookModal').modal('hide');

            // Reload the page to show the updated book list
            location.reload();
        })
        .catch(error => {
            console.log('Error:', error);
            // Display an error notification
            alert('Error adding book: ' + error.response.data.error);
        });
    });

    // EDIT BOOK
    function editBook(bookId) {
        console.log('Edit button clicked for book ID:', bookId);

        // Fetch the existing book data for the given bookId via an AJAX request
        axios.get(`/books/${bookId}/edit-data`)
            .then(response => {
                console.log('Success:', response.data);

                if (response.data.success) {
                    const bookData = response.data.book;

                    // Pre-fill the modal form fields with the existing book data
                    document.getElementById('edit_name').value = bookData.name;
                    document.getElementById('edit_author').value = bookData.author;
                    document.getElementById('edit_year_published').value = bookData.year_published;
                    document.getElementById('edit_book_type').value = bookData.book_type;

                    // Store the bookId in a data attribute of the save button
                    document.getElementById('saveEditBookButton').setAttribute('data-book-id', bookId);

                    // Show the modal for editing
                    document.getElementById('editBookModal').modal('show');
                } else {
                    console.log('Error:', response.data.error);
                    alert('Error fetching book data: ' + response.data.error);
                }
            })
            .catch(error => {
                console.log('Error:', error);
                alert('Error fetching book data: ' + error);
            });
    }

    // Event listener for the edit form submission
    document.getElementById('saveEditBookButton').addEventListener('click', function(event) {
        const bookId = this.getAttribute('data-book-id');

        // Get form data
        const name = document.getElementById('edit_name').value;
        const author = document.getElementById('edit_author').value;
        const yearPublished = document.getElementById('edit_year_published').value;
        const bookType = document.getElementById('edit_book_type').value;

        // Send an AJAX request to update the book data
        axios.post(`/books/${bookId}/edit`, {
            name: name,
            author: author,
            year_published: yearPublished,
            book_type: bookType
        })
        .then(response => {
            console.log('Success:', response.data);
            alert('Book updated successfully!');
            document.getElementById('editBookModal').modal('hide');
            location.reload();
        })
        .catch(error => {
            console.log('Error:', error);
            alert('Error updating book: ' + error);
        });
    });

    // DEL BOOK
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

    // Event listener for delete button click
    function deleteButtonClick(bookId) {
        deleteBook(bookId);
    }
});
