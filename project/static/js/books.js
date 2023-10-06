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
$(document).ready(function() {
    $('#addBookForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const name = $('#name').val();
        const author = $('#author').val();
        const year_published = $('#year_published').val();  // New field: Year Published
        const book_type = $('#book_type').val();  // New field: Book Type

        // Send an AJAX request to create a new book
        $.ajax({
            url: '/books/create',
            method: 'POST',
            data: {
                name: name,
                author: author,
                year_published: year_published,
                book_type: book_type
            },
            success: function(response) {
                console.log('Success:', response);
                // Display a success notification
                alert('Book added successfully!');

                // Close the modal
                $('#addBookModal').modal('hide');

                // Reload the page to show the updated book list
                location.reload();
            },
            error: function(error) {
                console.log('Error:', error);
                // Display an error notification
                alert('Error adding book: ' + error.responseJSON.error);
            }
        });
    });
});

// EDIT BOOK
function editBook(bookId) {
    console.log('Edit button clicked for book ID:', bookId);

    // Fetch the existing book data for the given bookId via an AJAX request
    $.ajax({
        url: `/books/${bookId}/edit-data`,
        method: 'GET',
        success: function(response) {
            console.log('Success:', response);

            if (response.success) {
                const bookData = response.book;

                // Pre-fill the modal form fields with the existing book data
                $('#edit_name').val(bookData.name);
                $('#edit_author').val(bookData.author);
                $('#edit_year_published').val(bookData.year_published);
                $('#edit_book_type').val(bookData.book_type);

                // Store the bookId in a data attribute of the save button
                $('#saveEditBookButton').attr('data-book-id', bookId);

                // Show the modal for editing
                $('#editBookModal').modal('show');
            } else {
                console.log('Error:', response.error);
                alert('Error fetching book data: ' + response.error);
            }
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error:', errorThrown);
            alert('Error fetching book data: ' + errorThrown);
        }
    });
}

// Event listener for the edit form submission
$('#saveEditBookButton').click(function(event) {
    const bookId = $(this).attr('data-book-id');

    // Get form data
    const name = $('#edit_name').val();
    const author = $('#edit_author').val();
    const yearPublished = $('#edit_year_published').val();
    const bookType = $('#edit_book_type').val();

    // Create a data object to send as JSON
    const data = {
        'name': name,
        'author': author,
        'year_published': yearPublished,
        'book_type': bookType
    };

    // Send an AJAX request to update the book data
    $.ajax({
        url: `/books/${bookId}/edit`,
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(response) {
            console.log('Success:', response);
            alert('Book updated successfully!');
            $('#editBookModal').modal('hide');
            location.reload();
        },
        error: function(xhr, textStatus, errorThrown) {
            console.log('Error:', errorThrown);
            alert('Error updating book: ' + errorThrown);
        }
    });
});


// DEL BOOK
function deleteBook(bookId) {
    $.ajax({
        url: `/books/${bookId}/delete`,
        method: 'POST',
        success: function(response) {
            console.log('Success:', response);
            alert('Book deleted successfully!');
            location.reload();
        },
        error: function(error) {
            console.log('Error:', error);
            alert('Error deleting book: ' + error.responseJSON.error);
        }
    });
}
