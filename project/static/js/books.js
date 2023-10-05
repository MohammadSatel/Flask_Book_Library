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

function editBook(bookId) {
    const name = $('#edit_name').val();
    const author = $('#edit_author').val();
    const yearPublished = $('#edit_year_published').val();
    const bookType = $('#edit_book_type').val();

    // Create a data object to send as JSON
    const data = {
        name: name,
        author: author,
        year_published: yearPublished,
        book_type: bookType
    };

    $.ajax({
        url: `/books/${bookId}/edit`,
        method: 'POST',
        contentType: 'application/json',  // Set content type to JSON
        data: JSON.stringify(data),  // Send data as JSON
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
}

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
