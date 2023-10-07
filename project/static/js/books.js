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
        // You need to implement the hide functionality specific to your modal library
        // For Bootstrap modal, you can use: $('#addBookModal').modal('hide');
        // Example for Bootstrap modal:
        // $('#addBookModal').modal('hide');
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
            window.location.reload();  // Reload the page to show the updated book list
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error adding book: ' + JSON.stringify(error.response));  // Log the complete error response
        });
    }

    const addBookForm = document.getElementById("addBookForm");
    if (addBookForm) {
        addBookForm.addEventListener("submit", function(event) {
            event.preventDefault();  // Prevent the default form submission
            addBook();  // Call the addBook function to handle adding a new book
        });
    } else {
        console.error("Element with ID 'addBookForm' not found.");
    }

    function editBook(bookId) {
        console.log('Edit button clicked for book ID:', bookId);

        axios.get(`/books/${bookId}/edit-data`)
            .then(response => {
                console.log('Success:', response.data);

                if (response.data.success) {
                    const bookData = response.data.book;

                    document.getElementById('edit_name').value = bookData.name;
                    document.getElementById('edit_author').value = bookData.author;
                    document.getElementById('edit_year_published').value = bookData.year_published;
                    document.getElementById('edit_book_type').value = bookData.book_type;

                    document.getElementById('saveEditBookButton').setAttribute('data-book-id', bookId);

                    document.getElementById('editBookModal').style.display = 'block';
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

    const editButtons = document.querySelectorAll('.btn-warning');
    if (editButtons) {
        editButtons.forEach(button => {
            button.addEventListener('click', function() {
                const bookId = this.getAttribute('data-book-id');
                editBook(bookId);
            });
        });
    } else {
        console.error("Edit buttons not found.");
    }
    

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

    const deleteButtons = document.querySelectorAll('.btn-danger');
    if (deleteButtons) {
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const bookId = this.getAttribute('data-book-id');
            deleteBook(bookId);
        });
    });
} else {
    console.error("Delete buttons not found.");
}


});
