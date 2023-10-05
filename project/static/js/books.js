// Event listener for edit button
$(document).on('click', '.edit-book-btn', function() {
    // This function is triggered when an 'edit' button is clicked for a book
    const bookId = $(this).data('book-id');
    const book = findBookById(bookId);

    // Populate the edit modal with book details
    $('#edit_name').val(book.name);
    $('#edit_author').val(book.author);
    $('#edit_time').val(book.time);
    $('#edit_book_id').val(bookId);

    // Show the edit modal
    $('#editBookModal').modal('show');
});

// Function to handle search
function searchBooks() {
    // This function is triggered when the search input changes
    let input, filter, table, tr, td, i, j, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toLowerCase();
    table = document.querySelector(".table");
    tr = table.getElementsByTagName("tr");
    for (i = 1; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        let rowDisplay = false;  // Flag to determine if this row should be displayed
        for (j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toLowerCase().indexOf(filter) > -1) {
                    rowDisplay = true;  // Display the row if any cell matches the search
                    break;
                }
            }
        }
        tr[i].style.display = rowDisplay ? "" : "none";  // Show or hide the row
    }
}

// Event listener for search input
document.getElementById("searchInput").addEventListener("input", searchBooks);

// Handle form submission for adding a new book
$(document).ready(function() {
    // This function is executed when the document is ready (loaded)

    // Event listener for form submission
    $('#addBookForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const name = $('#name').val();
        const author = $('#author').val();
        const yearPublished = $('#year_published').val();  // New field: Year Published
        const bookType = $('#book_type').val();  // New field: Book Type

        // Send an AJAX request to create a new book
        $.ajax({
            url: '/books/create',
            method: 'POST',
            data: {
                name: name,
                author: author,
                year_published: yearPublished,
                book_type: bookType
            },
            success: function(response) {
                // This function is executed if the AJAX request is successful
                console.log('Success:', response);
                // Display a success notification
                alert('Book added successfully!');

                // Close the modal
                $('#addBookModal').modal('hide');

                // Reload the page to show the updated book list
                location.reload();
            },
            error: function(error) {
                // This function is executed if the AJAX request encounters an error
                console.log('Error:', error);
                // Display an error notification
                alert('Error adding book: ' + error.responseJSON.error);
            }
        });
    });
});
