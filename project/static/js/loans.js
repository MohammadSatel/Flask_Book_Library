// Function to handle search
function searchLoans() {
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
document.getElementById("searchInput").addEventListener("input", searchLoans);

// Handle form submission for adding a new Loan
$(document).ready(function() {
    $('#addLoanForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const customer_name = $('#customer_name').val();
        const book_name = $('#book_name').val();
        const loan_date = $('#loan_date').val();
        const return_date = $('#return_date').val();

        // Send an AJAX request to create a new Loan
        $.ajax({
            url: '/loans/create',
            method: 'POST',
            data: {
                customer_name: customer_name,
                book_name: book_name,
                loan_date: loan_date,
                return_date: return_date
            },
            success: function(response) {
                // Display a success notification
                alert('Loan added successfully!');

                // Close the modal
                $('#addLoanModal').modal('hide');

                // Reload the page to show the updated Loan list
                location.reload();
            },
            error: function(error) {
                // Display an error notification
                alert('Error adding loan: ' + error.responseJSON.error);
            }
        });
    });
});
