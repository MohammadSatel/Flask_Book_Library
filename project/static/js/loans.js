// Function to populate book and customer dropdowns
function populateDropdowns() {
    // Fetch book names and populate the book dropdown
    $.ajax({
        url: '/books/json',
        method: 'GET',
        success: function(response) {
            const books = response.books;
            const bookDropdown = $('#book_name');

            bookDropdown.empty();  // Clear previous options

            // Populate options
            books.forEach(function(book) {
                bookDropdown.append($('<option>').val(book.name).text(book.name));
            });
        },
        error: function(error) {
            console.error('Error fetching book names: ', error);
        }
    });

    // Fetch customer names and populate the customer dropdown
    $.ajax({
        url: '/customers/json',
        method: 'GET',
        success: function(response) {
            const customers = response.customers;
            const customerDropdown = $('#customer_name');

            customerDropdown.empty();  // Clear previous options

            // Populate options
            customers.forEach(function(customer) {
                customerDropdown.append($('<option>').val(customer.name).text(customer.name));
            });
        },
        error: function(error) {
            console.error('Error fetching customer names: ', error);
        }
    });
}

// Function to fetch book details based on the selected book name
function fetchBookDetails(bookName) {
    return $.ajax({
        url: `/books/details/${bookName}`, // Modify the URL to match your endpoint for fetching book details
        method: 'GET',
    });
}

// Handle form submission for adding a new Loan
$(document).ready(function() {
    // Populate dropdowns when the page loads
    populateDropdowns();

    $('#addLoanForm').submit(function(event) {
        event.preventDefault();  // Prevent the default form submission

        // Get form data
        const formData = {
            customer_name: $('#customer_name').val(),
            book_name: $('#book_name').val(),
            loan_date: $('#loan_date').val(),
            return_date: $('#return_date').val()
        };

        const bookName = formData.book_name;

        // Fetch book details based on the selected book name
        fetchBookDetails(bookName)
            .then(function(bookDetails) {
                // Include book details in the form data
                formData.book_details = bookDetails;

                // Send an AJAX request to create a new Loan
                $.ajax({
                    url: '/loans/create',
                    method: 'POST',
                    data: formData,
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
            })
            .catch(function(error) {
                console.error('Error fetching book details: ', error);
            });
    });
});
