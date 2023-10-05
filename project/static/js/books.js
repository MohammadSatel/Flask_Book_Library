// Function to handle search
function searchBooks() {
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
    $('#addBookForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const name = $('#name').val();
        const author = $('#author').val();
        const time = $('#time').val();

        // Send an AJAX request to create a new book
        $.ajax({
            url: '/books/create',
            method: 'POST',
            data: {
                name: name,
                author: author,
                time: time
            },
            success: function(response) {
                // Display a success notification
                alert('Book added successfully!');

                // Close the modal
                $('#addBookModal').modal('hide');

                // Reload the page to show the updated book list
                location.reload();
            },
            error: function(error) {
                // Display an error notification
                alert('Error adding book: ' + error.responseJSON.error);
            }
        });
    });
});
